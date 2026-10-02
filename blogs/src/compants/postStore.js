const publishedPostsKey = 'devlog-published-posts';
const draftsKey = 'devlog-post-drafts';

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

export function updatePublishedPost(previousTitle, post) {
    const publishedPosts = getPublishedPosts().filter((entry) => entry.title !== previousTitle);
    const nextPosts = [post, ...publishedPosts];
    localStorage.setItem(publishedPostsKey, JSON.stringify(nextPosts));
    return nextPosts;
}

export function deletePublishedPost(title) {
    const nextPosts = getPublishedPosts().filter((post) => post.title !== title);
    localStorage.setItem(publishedPostsKey, JSON.stringify(nextPosts));
    return nextPosts;
}

export function getDrafts() {
    try {
        return JSON.parse(localStorage.getItem(draftsKey) || '[]');
    } catch {
        return [];
    }
}

export function saveDraft(draft, draftId) {
    const drafts = getDrafts();
    const existingDraft = drafts.find((entry) => entry.id === draftId);
    const savedDraft = {
        ...draft,
        id: draftId || `${Date.now()}`,
        createdAt: existingDraft?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    const nextDrafts = [savedDraft, ...drafts.filter((entry) => entry.id !== savedDraft.id)];
    localStorage.setItem(draftsKey, JSON.stringify(nextDrafts));
    return savedDraft;
}

export function deleteDraft(draftId) {
    const nextDrafts = getDrafts().filter((draft) => draft.id !== draftId);
    localStorage.setItem(draftsKey, JSON.stringify(nextDrafts));
    return nextDrafts;
}
