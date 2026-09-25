const publishedPostsKey = 'devlog-published-posts';

export function getPublishedPosts() {
    try {
        return JSON.parse(localStorage.getItem(publishedPostsKey) || '[]');
    } catch {
        return [];
    }
}

export function publishPost(post) {
    const publishedPosts = getPublishedPosts();
    const nextPosts = [post, ...publishedPosts];
    localStorage.setItem(publishedPostsKey, JSON.stringify(nextPosts));
    return post;
}
