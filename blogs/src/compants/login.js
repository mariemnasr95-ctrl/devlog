import { useState } from 'react';
import { LockKeyhole, LogIn, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';

const loginUser = async (data) => {
  // Send credentials to the backend and keep its JWT for protected requests.
  const response = await fetch('http://localhost:5000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const resData = await response.json();

  if (!response.ok) {
    throw new Error(resData.message || 'Login failed');
  }

  if (resData.token) {
    localStorage.setItem('token', resData.token);
  }

  return resData;
};

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    try {
      const res = await loginUser({ username, password });
      if (res.token) {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Unable to connect to the server. Please try again.');
    }
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
                            <input type="text" id="username" name="username" value={username} onChange={(event) => setUsername(event.target.value)} required />
                        </div>
                    </div>

                    <div className="form-field">
                        <label htmlFor="password">Password:</label>
                        <div className="input-with-icon">
                            <LockKeyhole className="input-icon" size={18} aria-hidden="true" />
                            <input type="password" id="password" name="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
                        </div>
                    </div>

                    {error && <p role="alert">{error}</p>}
                    <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
                    <button type="submit">
                        <LogIn size={18} aria-hidden="true" /> Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;