export function getCurrentUsername() {
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) return savedUsername;

    try {
        const token = localStorage.getItem('token');
        const payload = token?.split('.')[1];
        if (!payload) return '';
        const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
        return decoded.username || '';
    } catch {
        return '';
    }
}

export function isAdminUsername(username) {
    return username.trim().toLowerCase().startsWith('admin');
}