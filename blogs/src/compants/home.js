import { useEffect, useState } from 'react';
import { ArrowUpRight, Clock3, Code2, Moon, Search, Tag, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import About from './about';
import cImage from '../media/c.jpg';
import javaImage from '../media/java.jpg';
import linuxImage from '../media/linux.jpg';
import { getPublishedPosts } from './postStore';

const posts = [
    { title: 'Pointers in C: A Simple Guide', description: 'Understand what pointers are, how they work and when to use them.', category: 'C', date: 'Apr 5, 2025', readTime: '4 min read', art: 'c-art', image: cImage, slug: 'pointers-in-c-a-simple-guide' },
    { title: 'Java Classes and Objects Explained', description: 'A beginner-friendly guide to classes, objects and how they work.', category: 'Java', date: 'Apr 2, 2025', readTime: '6 min read', art: 'java-art', image: javaImage, slug: 'java-classes-and-objects-explained' },
    { title: "5 Useful Linux Commands You'll Actually Use", description: 'Essential Linux commands for everyday developer workflows.', category: 'Linux', date: 'May 28, 2025', readTime: '4 min read', art: 'linux-art', image: linuxImage, slug: '5-useful-linux-commands-youll-actually-use' },
];

function PostCard({ post }) {
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
        </article>
    );
}

function Home() {
    const [showAbout, setShowAbout] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [publishedPosts] = useState(() => getPublishedPosts());
    const [serverBlogs, setServerBlogs] = useState([]);

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

    const serverPosts = serverBlogs.map((blog) => {
        const localPost = publishedPosts.find((post) => post.title === blog.title);
        const content = blog.content || '';
        const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
        return {
            ...localPost,
            title: blog.title,
            description: localPost?.description || content.slice(0, 120),
            category: localPost?.category || 'Development',
            date: localPost?.date || new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            readTime: localPost?.readTime || `${Math.max(1, Math.ceil(wordCount / 200))} min read`,
            art: localPost?.art || 'published-art',
            glyph: localPost?.glyph || '>_',
        };
    });
    const localOnlyPosts = publishedPosts.filter((post) => !serverBlogs.some((blog) => blog.title === post.title));
    const visiblePosts = [...serverPosts, ...localOnlyPosts, ...posts];
    const filteredPosts = visiblePosts.filter((post) => `${post.title} ${post.description} ${post.category}`.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="home-page">
            <header className="site-header">
                <Link className="brand" to="/"><Code2 size={18} /><span>Dev<span>Log</span></span></Link>
                <nav className="main-nav"><Link className="active" to="/">Home</Link><Link to="/categories">Categories</Link><button className="nav-link-button" onClick={() => setShowAbout(true)} type="button">About</button></nav>
                <div className="header-actions"><label className="search-box"><Search size={14} /><input aria-label="Search articles" onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search articles..." value={searchTerm} /></label><button className="icon-button" type="button" aria-label="Toggle theme"><Moon size={16} /></button><Link className="login-link" to="/login">Login</Link></div>
            </header>

            <main>
                <section className="dashboard-grid">
                    <article className="featured-post"><div className="featured-copy"><span className="eyebrow">Featured</span><h1>Getting Started with<br />Python and NumPy</h1><p>Learn the basics of NumPy and how to work with arrays, perform operations and make your data analysis easier.</p><div className="post-meta featured-meta"><span>Apr 12, 2025</span><span><Tag size={12} /> Python</span><span><Clock3 size={12} /> 5 min read</span></div><button className="read-button" type="button">Read more <ArrowUpRight size={14} /></button></div><div className="code-window" aria-label="NumPy code example"><div className="window-dots"><i /><i /><i /></div><code><span>import numpy as np</span><br /><br /><em># Create an array</em><br />arr = np.array([1, 2, 3, 4, 5])<br /><br /><em># Perform operations</em><br />print(arr * 2)<br /><br /><strong># Output: [2 4 6 8 10]</strong></code></div></article>
                    <aside className="dashboard-rail"><div className="rail-section latest-rail"><h2>Latest Posts <span>View all <ArrowUpRight size={12} /></span></h2><Link className="mini-post" to="/categories"><span className="mini-art terminal-art">&gt;_</span><span>Linux Basics: Essential Commands<small>Apr 10, 2025</small></span></Link><Link className="mini-post" to="/categories"><span className="mini-art web-art">&lt;/&gt;</span><span>Building a Simple Web Server<small>Apr 8, 2025</small></span></Link></div></aside>
                </section>
                <section className="latest-posts"><div className="section-heading"><h2>{searchTerm ? 'Search results' : 'Latest Posts'}</h2><Link to="/categories">View all <ArrowUpRight size={13} /></Link></div>{filteredPosts.length ? <div className="post-grid">{filteredPosts.map((post) => <PostCard key={`${post.title}-${post.date}`} post={post} />)}</div> : <p className="empty-search">No articles match “{searchTerm}”.</p>}</section>
            </main>

            {showAbout && <div className="sidebar-overlay" onClick={() => setShowAbout(false)} />}
            <aside className={`about-drawer ${showAbout ? 'open' : ''}`}><button className="close-btn" onClick={() => setShowAbout(false)} type="button" aria-label="Close about panel"><X size={18} /></button><About /></aside>
        </div>
    );
}

export default Home;