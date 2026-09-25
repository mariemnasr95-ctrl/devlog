import { ArrowLeft, ImagePlus, Save, Send } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { publishPost } from './postStore';

function NewPost() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Development');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [status, setStatus] = useState('');

    function handleSubmit(event) {
        event.preventDefault();
        const words = content.trim().split(/\s+/).filter(Boolean).length;
        publishPost({
            title: title.trim(),
            description: excerpt.trim() || content.trim().slice(0, 120),
            category,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            readTime: `${Math.max(1, Math.ceil(words / 200))} min read`,
            art: 'published-art',
            glyph: category === 'Java' ? 'J' : category === 'C' ? 'C' : '>_',
        });
        navigate('/');
    }

    function handleSaveDraft() {
        setStatus('Draft saved locally.');
    }

    return (
        <main className="new-post-page">
            <header className="new-post-header">
                <Link className="back-link" to="/"><ArrowLeft size={16} /> Back to dashboard</Link>
                <div>
                    <span className="eyebrow">Creator studio</span>
                    <h1>Write a new post</h1>
                    <p>Turn your latest idea into something worth sharing.</p>
                </div>
            </header>

            <form className="post-editor" onSubmit={handleSubmit}>
                <section className="editor-main">
                    <label htmlFor="post-title">Title</label>
                    <input id="post-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Give your post a clear title" required />
                    <label htmlFor="post-content">Your story</label>
                    <textarea className="content-input" id="post-content" value={content} onChange={(event) => setContent(event.target.value)} placeholder="Start writing..." required />
                </section>

                <aside className="editor-sidebar">
                    <div className="editor-panel">
                        <h2>Post details</h2>
                        <label htmlFor="post-category">Category</label>
                        <select id="post-category" value={category} onChange={(event) => setCategory(event.target.value)}>
                            <option>Development</option>
                            <option>C</option>
                            <option>Java</option>
                            <option>Linux</option>
                            <option>Python</option>
                        </select>
                        <label htmlFor="post-excerpt">Short description</label>
                        <textarea id="post-excerpt" value={excerpt} onChange={(event) => setExcerpt(event.target.value)} placeholder="What will readers learn?" rows="4" />
                        <label htmlFor="post-tags">Tags</label>
                        <input id="post-tags" value={tags} onChange={(event) => setTags(event.target.value)} placeholder="python, tips, guide" />
                    </div>
                    <button className="cover-upload" type="button"><ImagePlus size={18} /><span>Add cover image<small>Recommended: 1600 x 900</small></span></button>
                    <div className="editor-actions">
                        <button className="draft-button" onClick={handleSaveDraft} type="button"><Save size={15} /> Save draft</button>
                        <button className="publish-button" type="submit"><Send size={15} /> Publish</button>
                    </div>
                    {status && <p className="editor-status" role="status">{status}</p>}
                </aside>
            </form>
        </main>
    );
}

export default NewPost;
