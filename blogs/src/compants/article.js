import { ArrowLeft, Clock3, Code2, Tag } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import cImage from '../media/c.jpg';
import javaImage from '../media/java.jpg';
import linuxImage from '../media/linux.jpg';

const articles = {
    'pointers-in-c-a-simple-guide': {
        category: 'C', date: 'Apr 5, 2025', readTime: '4 min read', title: 'Pointers in C: A Simple Guide', description: 'Understand what pointers are, how they work and when to use them in your programs.', image: cImage,
        sections: [{ heading: 'What is a pointer?', text: 'A pointer is a variable that stores the memory address of another variable. This gives C programs a direct way to work with memory and makes it possible to build flexible data structures.' }, { heading: 'The core idea', text: 'Use the ampersand operator to get an address and the asterisk operator to read the value at that address. Start with small examples, then use pointers when you need shared data or dynamic memory.' }], code: 'int score = 42;\nint *scorePointer = &score;\nprintf("%d", *scorePointer);'
    },
    'java-classes-and-objects-explained': {
        category: 'Java', date: 'Apr 2, 2025', readTime: '6 min read', title: 'Java Classes and Objects Explained', description: 'A beginner-friendly guide to classes, objects and how they work in Java.', image: javaImage,
        sections: [{ heading: 'Classes are blueprints', text: 'A class describes the data and behavior an object should have. It keeps related values and methods together, giving a program a clear structure.' }, { heading: 'Objects do the work', text: 'An object is an instance of a class. Create one with new, then use its fields and methods to model the real thing your program is working with.' }], code: 'class Book {\n    String title;\n\n    void open() {\n        System.out.println(title);\n    }\n}'
    },
    '5-useful-linux-commands-youll-actually-use': {
        category: 'Linux', date: 'May 28, 2025', readTime: '4 min read', title: "5 Useful Linux Commands You'll Actually Use", description: 'Boost your productivity with essential Linux commands for everyday workflows.', image: linuxImage,
        sections: [{ heading: 'Small commands, real momentum', text: 'The command line becomes much less intimidating when you learn a few commands deeply. These tools help you move through files, inspect processes, and understand what your machine is doing.' }, { heading: 'Build a daily habit', text: 'Use pwd and ls to orient yourself, cd to move between folders, grep to find text, and top to inspect running processes. Combine them with pipes as your confidence grows.' }], code: 'pwd\nls -la\ngrep -r "TODO" src/\ntop'
    }
};

function Article() {
    const { slug } = useParams();
    const article = articles[slug];

    if (!article) {
        return <main className="article-page"><Link className="article-back-link" to="/"><ArrowLeft size={15} /> Back to dashboard</Link><h1>Article not found</h1><p>This article may have been moved or removed.</p></main>;
    }

    return (
        <main className="article-page">
            <header className="article-header"><Link className="article-back-link" to="/"><ArrowLeft size={15} /> Back to dashboard</Link><Link className="article-brand" to="/"><Code2 size={17} /> Dev<span>Log</span></Link></header>
            <article className="article-content">
                <div className="article-cover"><img src={article.image} alt={`${article.category} article`} /><span>{article.category}</span></div>
                <div className="article-copy"><div className="article-meta"><span><Tag size={13} /> {article.category}</span><span>{article.date}</span><span><Clock3 size={13} /> {article.readTime}</span></div><h1>{article.title}</h1><p className="article-lead">{article.description}</p>{article.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2><p>{section.text}</p></section>)}<pre><code>{article.code}</code></pre></div>
            </article>
        </main>
    );
}

export default Article;
