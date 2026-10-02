import { useEffect, useState } from 'react';
import { ArrowUpRight, Clock3, Code2, PenLine, Search, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import About from './about';
import { getCurrentUsername, isAdminUsername } from './auth';
import { deletePublishedPost, getPublishedPosts } from './postStore';
import { ThemeToggle } from './theme';

function PostCard({ post, isAdmin, onDelete }) {
    return (
        <article className="post-card">
            <Link className="post-card-link" to={post.slug ? `/article/${post.slug}` : '/'}>
            <div className={`post-art ${post.art}`}>{post.image && <img src={post.image} alt={`${post.category} article`} />}<span aria-hidden="true">{post.glyph || (post.category === 'C' ? 'C' : post.category === 'Java' ? 'J' : '>_')}</span></div>
            <div className="post-card-body">
                <span className="post-tag">{post.category}</span>
                <h3>{post.title}</h3>
                <p>{post.description}</p>
                <div className="post-meta"><span>{post.date}</span><span><Clock3 size={12} /> {post.readTime}</span></div>
            </div>
            </Link>
            {isAdmin && post.id && <div className="post-admin-actions">
                <Link aria-label={`Edit ${post.title}`} title="Edit post" to={`/new-post?id=${encodeURIComponent(post.id)}`}><PenLine size={14} /> Edit</Link>
                <button aria-label={`Delete ${post.title}`} onClick={() => onDelete(post)} title="Delete post" type="button"><Trash2 size={14} /> Delete</button>
            </div>}
        </article>
    );
}

function Home() {
    const [showAbout, setShowAbout] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [publishedPosts, setPublishedPosts] = useState(() => getPublishedPosts());
    const [serverBlogs, setServerBlogs] = useState([]);
    const isAdmin = isAdminUsername(getCurrentUsername());

    useEffect(() => {
        const controller = new AbortController();

        // Load published blogs from the backend for the home feed.
        async function loadBlogs() {
            try {
                const response = await fetch('http://localhost:5000/api/blogs', { signal: controller.signal });
                if (!response.ok) throw new Error('Unable to load posts.');
                const blogs = await response.json();
                setServerBlogs(Array.isArray(blogs) ? blogs : []);
            } catch {
                if (!controller.signal.aborted) setServerBlogs([]);
            }
        }

        loadBlogs();
        return () => controller.abort();
    }, []);

    async function handleDelete(post) {
        if (!window.confirm(`Delete "${post.title}"?`)) return;
        try {
            const response = await fetch(`http://localhost:5000/api/blogs/${encodeURIComponent(post.id)}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Unable to delete the post.');
            setServerBlogs((blogs) => blogs.filter((blog) => String(blog._id || blog.id) !== String(post.id)));
            setPublishedPosts(deletePublishedPost(post.title));
        } catch (error) {
            window.alert(error.message || 'Unable to delete the post.');
        }
    }

    const serverPosts = serverBlogs.map((blog) => {
        const localPost = publishedPosts.find((post) => post.title === blog.title);
        const content = blog.content || '';
        const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
        return {
            ...localPost,
            title: blog.title,
            id: blog._id || blog.id,
            content,
            image: blog.image || localPost?.image,
            slug: blog.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
            description: blog.description || localPost?.description || content.slice(0, 120),
            category: blog.category || localPost?.category || 'Development',
            date: localPost?.date || new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            readTime: localPost?.readTime || `${Math.max(1, Math.ceil(wordCount / 200))} min read`,
            art: localPost?.art || 'published-art',
            glyph: localPost?.glyph || '>_',
        };
    });
    const localOnlyPosts = publishedPosts.filter((post) => !serverBlogs.some((blog) => blog.title === post.title));
    const visiblePosts = [...serverPosts, ...localOnlyPosts];
    const filteredPosts = visiblePosts.filter((post) => `${post.title} ${post.description} ${post.category}`.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="home-page">
            <header className="site-header">
                <Link className="brand" to="/"><Code2 size={18} /><span>Dev<span>Log</span></span></Link>
                <nav className="main-nav"><Link className="active" to="/">Home</Link><Link to="/categories">Categories</Link><button className="nav-link-button" onClick={() => setShowAbout(true)} type="button">About</button></nav>
                <div className="header-actions"><label className="search-box"><Search size={14} /><input aria-label="Search articles" onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search articles..." value={searchTerm} /></label><ThemeToggle />{isAdmin && <Link className="admin-create-link" to="/new-post"><PenLine size={13} /> New post</Link>}<Link className="login-link" to="/login">{getCurrentUsername() || 'Login'}</Link></div>
            </header>

            <main>
                <section className="latest-posts"><div className="section-heading"><h2>{searchTerm ? 'Search results' : 'Latest Posts'}</h2><Link to="/categories">View all <ArrowUpRight size={13} /></Link></div>{filteredPosts.length ? <div className="post-grid">{filteredPosts.map((post) => <PostCard key={`${post.title}-${post.date}`} isAdmin={isAdmin} onDelete={handleDelete} post={post} />)}</div> : <p className="empty-search">{searchTerm ? `No articles match “${searchTerm}”.` : 'No posts have been published yet.'}</p>}</section>
            </main>

            {showAbout && <div className="sidebar-overlay" onClick={() => setShowAbout(false)} />}
            <aside className={`about-drawer ${showAbout ? 'open' : ''}`}><button className="close-btn" onClick={() => setShowAbout(false)} type="button" aria-label="Close about panel"><X size={18} /></button><About /></aside>
        </div>
    );
}

export default Home;