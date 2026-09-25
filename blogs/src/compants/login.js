import { LockKeyhole, LogIn, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './login.css';

function Login() {
    const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();
        navigate('/');
    }

    return (
        <div className="login-page">
            <h1>LOGIN</h1>

            <div className="login-container">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label htmlFor="username">Username:</label>
                        <div className="input-with-icon">
                            <User className="input-icon" size={18} aria-hidden="true" />
                            <input type="text" id="username" name="username" required />
                        </div>
                    </div>

                    <div className="form-field">
                        <label htmlFor="password">Password:</label>
                        <div className="input-with-icon">
                            <LockKeyhole className="input-icon" size={18} aria-hidden="true" />
                            <input type="password" id="password" name="password" required />
                        </div>
                    </div>

                    <p>Don't have an account? <a href="/signup">Sign up</a></p>
                    <button type="submit">
                        <LogIn size={18} aria-hidden="true" /> Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;