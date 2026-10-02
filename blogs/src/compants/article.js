import { ArrowLeft, Clock3, Code2, Tag } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Article() {
    const { slug } = useParams();
    const [serverArticle, setServerArticle] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        setIsLoading(true);
        fetch('http://localhost:5000/api/blogs', { signal: controller.signal })
            .then((response) => response.ok ? response.json() : [])
            .then((blogs) => {
                const blog = blogs.find((entry) => entry.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') === slug);
                if (blog) {
                    setServerArticle({
                        title: blog.title,
                        category: blog.category || 'Development',
                        image: blog.image || '',
                        date: new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                        description: blog.description || blog.content.slice(0, 120),
                        content: blog.content,
                        readTime: `${Math.max(1, Math.ceil(blog.content.trim().split(/\s+/).filter(Boolean).length / 200))} min read`,
                    });
                }
            })
            .catch(() => {})
            .finally(() => {
                if (!controller.signal.aborted) setIsLoading(false);
            });
        return () => controller.abort();
    }, [slug]);

    const article = serverArticle;

    if (!article && isLoading) {
        return <main className="article-page"><p>Loading article...</p></main>;
    }

    if (!article) {
        return <main className="article-page"><Link className="article-back-link" to="/"><ArrowLeft size={15} /> Back to dashboard</Link><h1>Article not found</h1><p>This article may have been moved or removed.</p></main>;
    }

    return (
        <main className="article-page">
            <header className="article-header"><Link className="article-back-link" to="/"><ArrowLeft size={15} /> Back to dashboard</Link><Link className="article-brand" to="/"><Code2 size={17} /> Dev<span>Log</span></Link></header>
            <article className="article-content">
                <div className="article-cover">{article.image && <img src={article.image} alt={`${article.title} cover`} />}<span>{article.category}</span></div>
                <div className="article-copy"><div className="article-meta"><span><Tag size={13} /> {article.category}</span><span>{article.date}</span><span><Clock3 size={13} /> {article.readTime}</span></div><h1>{article.title}</h1><p className="article-lead">{article.description}</p><p className="article-body">{article.content}</p></div>
            </article>
        </main>
    );
}

export default Article;
