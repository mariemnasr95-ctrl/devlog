import { LockKeyhole, User, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './login.css';

function Signup() {
    const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();
        navigate('/login');
    }

    return (
        <div className="signup-page">
            <div className="signup-container">
                <h2>Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label htmlFor="username">Username:</label>
                        <div className="input-with-icon">
                            <User className="input-icon" size={18} aria-hidden="true" />
                            <input type="text" id="username" name="username" />
                        </div>
                    </div>
                    <div className="form-field">
                        <label htmlFor="password">Password:</label>
                        <div className="input-with-icon">
                            <LockKeyhole className="input-icon" size={18} aria-hidden="true" />
                            <input type="password" id="password" name="password" />
                        </div>
                    </div>
                    <button type="submit"><UserPlus size={18} aria-hidden="true" /> Sign Up</button>
                </form>
            </div>
        </div>
    )
}
export default Signup;