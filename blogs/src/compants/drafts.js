import { ArrowLeft, FileText, PenLine, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUsername, isAdminUsername } from './auth';
import { deleteDraft, getDrafts } from './postStore';

function Drafts() {
    const navigate = useNavigate();
    const isAdmin = isAdminUsername(getCurrentUsername());
    const [drafts, setDrafts] = useState(() => getDrafts());

    useEffect(() => {
        if (!isAdmin) navigate('/', { replace: true });
    }, [isAdmin, navigate]);

    function handleDelete(draft) {
        if (!window.confirm(`Delete draft "${draft.title || 'Untitled draft'}"?`)) return;
        setDrafts(deleteDraft(draft.id));
    }

    if (!isAdmin) return null;

    return (
        <main className="new-post-page drafts-page">
            <header className="new-post-header">
                <Link className="back-link" to="/"><ArrowLeft size={16} /> Back to dashboard</Link>
                <div className="drafts-title-row">
                    <div>
                        <span className="eyebrow">Creator studio</span>
                        <h1>Saved drafts</h1>
                        <p>{drafts.length} {drafts.length === 1 ? 'draft' : 'drafts'} saved in this browser.</p>
                    </div>
                    <Link className="new-draft-link" to="/new-post"><Plus size={15} /> New draft</Link>
                </div>
            </header>
            {drafts.length ? (
                <section className="draft-list" aria-label="Saved drafts">
                    {drafts.map((draft) => (
                        <article className="draft-item" key={draft.id}>
                            {draft.image ? <img className="draft-cover" src={draft.image} alt="" /> : <div className="draft-cover draft-placeholder"><FileText size={24} /></div>}
                            <div className="draft-summary">
                                <span className="post-tag">{draft.category || 'Development'}</span>
                                <h2>{draft.title || 'Untitled draft'}</h2>
                                <p>{draft.description || draft.content?.slice(0, 150) || 'No content yet.'}</p>
                                <small>Updated {new Date(draft.updatedAt || draft.createdAt).toLocaleString()}</small>
                            </div>
                            <div className="draft-actions">
                                <Link to={`/new-post?draft=${encodeURIComponent(draft.id)}`}><PenLine size={14} /> Edit</Link>
                                <button onClick={() => handleDelete(draft)} type="button"><Trash2 size={14} /> Delete</button>
                            </div>
                        </article>
                    ))}
                </section>
            ) : (
                <section className="draft-empty">
                    <FileText size={24} />
                    <h2>No saved drafts</h2>
                    <p>Save a draft from the editor and it will appear here.</p>
                    <Link to="/new-post"><Plus size={15} /> Start a draft</Link>
                </section>
            )}
        </main>
    );
}

export default Drafts;
