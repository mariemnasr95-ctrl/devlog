import { ArrowUpRight, Clock3, Code2, Moon, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import About from './about';
import cImage from '../media/c.jpg';
import javaImage from '../media/java.jpg';
import linuxImage from '../media/linux.jpg';

const categoryPosts = [
    { category: 'C', title: 'Pointers in C: A Simple Guide', description: 'Understand what pointers are, how they work and when to use them in your programs.', date: 'Apr 5, 2025', readTime: '4 min read', image: cImage, className: 'category-c', slug: 'pointers-in-c-a-simple-guide' },
    { category: 'Java', title: 'Java Classes and Objects Explained', description: 'A beginner-friendly guide to classes, objects and how they work in Java.', date: 'Apr 2, 2025', readTime: '6 min read', image: javaImage, className: 'category-java', slug: 'java-classes-and-objects-explained' },
    { category: 'Linux', title: "5 Useful Linux Commands You'll Actually Use", description: 'Boost your productivity with essential Linux commands for everyday workflows.', date: 'May 28, 2025', readTime: '4 min read', image: linuxImage, className: 'category-linux', slug: '5-useful-linux-commands-youll-actually-use' },
];

function Categories() {
    const [showAbout, setShowAbout] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const filteredPosts = categoryPosts.filter((post) => `${post.title} ${post.description} ${post.category}`.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="categories-page">
            <header className="categories-header">
                <Link className="brand" to="/"><Code2 size={18} /><span>Dev<span>Log</span></span></Link>
                <nav className="categories-nav"><Link to="/">Home</Link><Link className="active" to="/categories">Categories</Link><button className="categories-about-button" onClick={() => setShowAbout(true)} type="button">About</button></nav>
                <div className="categories-actions"><label className="search-box"><Search size={14} /><input aria-label="Search categories" onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search articles..." value={searchTerm} /></label><button className="icon-button" type="button" aria-label="Toggle theme"><Moon size={16} /></button><Link className="login-link" to="/login">Login</Link></div>
            </header>
            <main className="categories-content">
                <div className="categories-intro"><div><span className="eyebrow">Explore the library</span><h1>Browse by category</h1><p>Find practical notes, explainers, and useful ideas for your next build.</p></div><span className="category-count">03 topics</span></div>
                {filteredPosts.length ? <div className="category-grid">{filteredPosts.map((post) => <article className={`category-card ${post.className}`} key={post.category}><Link className="category-card-link" to={`/article/${post.slug}`}><div className="category-image"><img src={post.image} alt={`${post.category} articles`} /><span>{post.category}</span></div><div className="category-card-body"><span className="post-tag">{post.category}</span><h2>{post.title}</h2><p>{post.description}</p><div className="category-meta"><span>{post.date}</span><span><Clock3 size={12} /> {post.readTime}</span></div><span className="category-read-link"><span>Read article</span><ArrowUpRight size={14} /></span></div></Link></article>)}</div> : <p className="empty-search">No categories match “{searchTerm}”.</p>}
            </main>
            {showAbout && <div className="sidebar-overlay" onClick={() => setShowAbout(false)} />}
            <aside className={`about-drawer ${showAbout ? 'open' : ''}`}><button className="close-btn" onClick={() => setShowAbout(false)} type="button" aria-label="Close about panel"><X size={18} /></button><About /></aside>
        </div>
    );
}

export default Categories;