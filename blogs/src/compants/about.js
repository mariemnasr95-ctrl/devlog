import { Archive, CircleAlert, PenLine, Search, Settings, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCurrentUsername, isAdminUsername } from './auth';

function About({ user, onLogout }) {
    const username = getCurrentUsername();

    return (
        <section className="about-sidebar">
            <div className="sidebar-heading">
                <div className="profile-avatar" aria-label={user?.name || 'Profile'}>
                    {user?.avatarUrl ? <img src={user.avatarUrl} alt="Profile" /> : <UserRound size={34} />}
                </div>
                <strong>{user?.name || username || 'Guest'}</strong>
                <span>{username ? `@${username}` : 'Not signed in'}</span>
            </div>
            <nav className="about-menu" aria-label="Profile menu">
                <Link to="/profile"><UserRound size={22} /> <span>Profile</span></Link>
                <Link to="/categories"><Search size={22} /> <span>Search</span></Link>
                {isAdminUsername(getCurrentUsername()) && <Link className="new-post-link" to="/new-post"><PenLine size={22} /> <span>New Post</span><b>+</b></Link>}
                {isAdminUsername(getCurrentUsername()) && <Link to="/drafts"><Archive size={22} /> <span>Drafts</span></Link>}
                <Link to="/about"><Settings size={22} /> <span>Settings</span></Link>
                <Link to="/about"><CircleAlert size={22} /> <span>Support</span></Link>
            </nav>
            {user && <button onClick={onLogout} className="logout-btn" type="button">Log out</button>}
        </section>
    );
}

export default About;
