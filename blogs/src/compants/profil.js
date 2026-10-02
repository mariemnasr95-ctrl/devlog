import { Bookmark, BriefcaseBusiness, MapPin, Star, Wrench } from 'lucide-react';
import cImage from '../media/c.jpg';
import pythonImage from '../media/python.jpg';
import { getCurrentUsername } from './auth';

function Profil() {
    const username = getCurrentUsername();

    return (
        <main className="profile-page">
            <h1 className="profile-page-title">{username ? 'Your profile' : 'Profile'}</h1>
            <article className="profile-card">
                <div className="profile-cover">
                    <img src={pythonImage} alt="Mountain landscape" />
                    <button className="profile-bookmark" type="button" aria-label="Save profile"><Bookmark size={17} /></button>
                </div>
                <div className="profile-card-body">
                    <div className="profile-intro">
                        <img className="profile-photo" src={cImage} alt={username ? `${username} profile` : 'Profile'} />
                        <div>
                            <h2>{username || 'Guest'}</h2>
                            <p>{username ? `@${username}` : 'Log in to see your account profile.'}</p>
                        </div>
                    </div>
                    <div className="profile-details"><span><BriefcaseBusiness size={12} /> Product designer</span><span><MapPin size={12} /> In the feedback loop.</span></div>
                    <div className="profile-bottom-row">
                        <div className="profile-stats"><span><strong><Star size={13} fill="currentColor" /> 4.8</strong><small>rating</small></span><span><strong>12 days</strong><small>duration</small></span><span><strong>$44/hr</strong><small>rate</small></span></div>
                        <div className="profile-tools"><Wrench size={13} /><span>JS</span><span>W</span><span>F</span><b>Tools</b></div>
                        <button className="profile-contact" type="button">Get in touch</button>
                    </div>
                </div>
            </article>
        </main>
    );
}

export default Profil;
