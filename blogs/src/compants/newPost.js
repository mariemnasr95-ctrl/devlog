import { ArrowLeft, ImagePlus, Save, Send, Trash2 } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCurrentUsername, isAdminUsername } from './auth';
import categoryOptions from './categoryOptions';
import { deleteDraft, getDrafts, publishPost, saveDraft, updatePublishedPost } from './postStore';

async function saveBlog(blogData, postId) {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/api/blogs${postId ? `/${encodeURIComponent(postId)}` : ''}`, {
        method: postId ? 'PUT' : 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(blogData),
    });
    const result = await response.json();
    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem('token');
            throw new Error('Session expired. Please log in again.');
        }
        throw new Error(result.message || 'Unable to publish the post.');
    }
    return result;
}

function NewPost() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const postId = searchParams.get('id');
    const draftId = searchParams.get('draft');
    const isAdmin = isAdminUsername(getCurrentUsername());
    const [title, setTitle] = useState('');
    const [originalTitle, setOriginalTitle] = useState('');
    const [category, setCategory] = useState('Python');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState('');
    const [tags, setTags] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        if (!isAdmin) {
            navigate('/', { replace: true });
            return;
        }
        if (draftId) {
            const draft = getDrafts().find((entry) => entry.id === draftId);
            if (!draft) {
                setStatus('Draft not found.');
                return;
            }
            setTitle(draft.title || '');
            setCategory(draft.category || 'Python');
            setExcerpt(draft.description || '');
            setContent(draft.content || '');
            setTags(draft.tags || '');
            setImage(draft.image || '');
            return;
        }
        if (!postId) return;

        fetch(`http://localhost:5000/api/blogs/${encodeURIComponent(postId)}`)
            .then(async (response) => {
                const blog = await response.json();
                if (!response.ok) throw new Error(blog.message || 'Unable to load the post.');
                setTitle(blog.title || '');
                setOriginalTitle(blog.title || '');
                setContent(blog.content || '');
                setCategory(blog.category || 'Python');
                setExcerpt(blog.description || '');
                setImage(blog.image || '');
            })
            .catch((error) => setStatus(error.message || 'Unable to load the post.'));
    }, [draftId, isAdmin, navigate, postId]);

    async function handleSubmit(event) {
        event.preventDefault();
        const words = content.trim().split(/\s+/).filter(Boolean).length;
        setStatus('');
        try {
            await saveBlog({ title: title.trim(), content: content.trim(), category, description: excerpt.trim(), image }, postId);
            if (draftId) deleteDraft(draftId);
            const postDetails = {
                title: title.trim(),
                description: excerpt.trim() || content.trim().slice(0, 120),
                category,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                readTime: `${Math.max(1, Math.ceil(words / 200))} min read`,
                art: 'published-art',
                glyph: category === 'Java' ? 'J' : category === 'C' ? 'C' : '>_',
            };
            if (postId) updatePublishedPost(originalTitle, postDetails);
            else publishPost(postDetails);
            navigate('/');
        } catch (error) {
            setStatus(error.message || 'Unable to publish the post.');
            if (error.message && error.message.includes('Session expired')) {
                navigate('/login');
            }
        }
    }

    function handleSaveDraft() {
        try {
            saveDraft({
                title: title.trim(),
                category,
                description: excerpt.trim(),
                content,
                tags,
                image,
            }, draftId);
            navigate('/drafts');
        } catch (error) {
            setStatus(error.message || 'Unable to save this draft.');
        }
    }

    function handleImageChange(event) {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setStatus('Choose an image file.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setStatus('Image must be smaller than 5 MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setImage(String(reader.result));
            setStatus('');
        };
        reader.onerror = () => setStatus('Unable to read this image.');
        reader.readAsDataURL(file);
    }

    if (!isAdmin) return null;

    return (
        <main className="new-post-page">
            <header className="new-post-header">
                <Link className="back-link" to="/"><ArrowLeft size={16} /> Back to dashboard</Link>
                <div>
                    <span className="eyebrow">Creator studio</span>
                    <h1>{draftId ? 'Edit draft' : postId ? 'Edit post' : 'Write a new post'}</h1>
                    <p>{draftId ? 'Continue writing your saved draft.' : postId ? 'Update your published post.' : 'Turn your latest idea into something worth sharing.'}</p>
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
                            {!categoryOptions.includes(category) && <option>{category}</option>}
                            {categoryOptions.map((option) => <option key={option}>{option}</option>)}
                        </select>
                        <label htmlFor="post-excerpt">Short description</label>
                        <textarea id="post-excerpt" value={excerpt} onChange={(event) => setExcerpt(event.target.value)} placeholder="What will readers learn?" rows="4" />
                        <label htmlFor="post-tags">Tags</label>
                        <input id="post-tags" value={tags} onChange={(event) => setTags(event.target.value)} placeholder="python, tips, guide" />
                    </div>
                    {image && <div className="cover-preview"><img src={image} alt="Post cover preview" /><button aria-label="Remove cover image" onClick={() => setImage('')} type="button"><Trash2 size={15} /> Remove image</button></div>}
                    <label className="cover-upload" htmlFor="cover-image-upload"><ImagePlus size={18} /><span>{image ? 'Change cover image' : 'Add cover image'}<small>Image files, up to 5 MB</small></span><input accept="image/*" id="cover-image-upload" onChange={handleImageChange} type="file" /></label>
                    <div className="editor-actions">
                        <button className="draft-button" onClick={handleSaveDraft} type="button"><Save size={15} /> Save draft</button>
                        <button className="publish-button" type="submit"><Send size={15} /> {postId ? 'Save changes' : 'Publish'}</button>
                    </div>
                    {status && <p className="editor-status" role="status">{status}</p>}
                </aside>
            </form>
        </main>
    );
}

export default NewPost;
