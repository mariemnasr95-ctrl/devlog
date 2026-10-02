import { ArrowUpRight, Clock3, Code2, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import About from './about';
import categoryOptions from './categoryOptions';
import { getPublishedPosts } from './postStore';
import { ThemeToggle } from './theme';

function Categories() {
    const [showAbout, setShowAbout] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [serverPosts, setServerPosts] = useState([]);
    const [localPosts] = useState(() => getPublishedPosts());

    useEffect(() => {
        const controller = new AbortController();
        fetch('http://localhost:5000/api/blogs', { signal: controller.signal })
            .then((response) => response.ok ? response.json() : [])
            .then((blogs) => setServerPosts(Array.isArray(blogs) ? blogs : []))
            .catch(() => {});
        return () => controller.abort();
    }, []);

    const categoryPosts = [
        ...serverPosts.map((blog) => {
            const content = blog.content || '';
            const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
            return {
                category: blog.category || 'Development',
                title: blog.title,
                image: blog.image || '',
                description: blog.description || content.slice(0, 120),
                date: new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                readTime: `${Math.max(1, Math.ceil(wordCount / 200))} min read`,
                slug: blog.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
            };
        }),
        ...localPosts.filter((post) => !serverPosts.some((blog) => blog.title === post.title)).map((post) => ({
            ...post,
            slug: post.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        })),
    ];
    const filteredPosts = categoryPosts.filter((post) => (
        (activeCategory === 'All' || post.category.toLowerCase() === activeCategory.toLowerCase())
        && `${post.title} ${post.description} ${post.category}`.toLowerCase().includes(searchTerm.toLowerCase())
    ));

    return (
        <div className="categories-page">
            <header className="categories-header">
                <Link className="brand" to="/"><Code2 size={18} /><span>Dev<span>Log</span></span></Link>
                <nav className="categories-nav"><Link to="/">Home</Link><Link className="active" to="/categories">Categories</Link><button className="categories-about-button" onClick={() => setShowAbout(true)} type="button">About</button></nav>
                <div className="categories-actions"><label className="search-box"><Search size={14} /><input aria-label="Search categories" onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search articles..." value={searchTerm} /></label><ThemeToggle /><Link className="login-link" to="/login">Login</Link></div>
            </header>
            <main className="categories-content">
                <div className="categories-intro"><div><span className="eyebrow">Explore the library</span><h1>Browse by category</h1><p>Find practical notes, explainers, and useful ideas for your next build.</p></div><span className="category-count">{categoryOptions.length} categories</span></div>
                <div className="category-filters" role="group" aria-label="Filter posts by category">
                    {['All', ...categoryOptions].map((category) => <button aria-pressed={activeCategory === category} className={activeCategory === category ? 'category-filter selected' : 'category-filter'} key={category} onClick={() => setActiveCategory(category)} type="button">{category}</button>)}
                </div>
                {filteredPosts.length ? <div className="category-grid">{filteredPosts.map((post) => <article className="category-card" key={`${post.title}-${post.date}`}><Link className="category-card-link" to={`/article/${post.slug}`}><div className="category-image">{post.image && <img src={post.image} alt={`${post.title} cover`} />}<span>{post.category}</span></div><div className="category-card-body"><span className="post-tag">{post.category}</span><h2>{post.title}</h2><p>{post.description}</p><div className="category-meta"><span>{post.date}</span><span><Clock3 size={12} /> {post.readTime}</span></div><span className="category-read-link"><span>Read article</span><ArrowUpRight size={14} /></span></div></Link></article>)}</div> : <p className="empty-search">{searchTerm ? `No posts match “${searchTerm}”.` : activeCategory === 'All' ? 'No posts have been published yet.' : `No ${activeCategory} posts have been published yet.`}</p>}
            </main>
            {showAbout && <div className="sidebar-overlay" onClick={() => setShowAbout(false)} />}
            <aside className={`about-drawer ${showAbout ? 'open' : ''}`}><button className="close-btn" onClick={() => setShowAbout(false)} type="button" aria-label="Close about panel"><X size={18} /></button><About /></aside>
        </div>
    );
}

export default Categories;