import { useState } from 'react';
import { LockKeyhole, User, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';

const registerUser = async (data) => {
  // Send the signup form values to the backend registration API.
  const response = await fetch('http://localhost:5000/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const resData = await response.json();

  if (!response.ok) {
    throw new Error(resData.message || 'Signup failed');
  }

  return resData;
};

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    try {
      const res = await registerUser({ username, email: username, password });
      if (res.message === 'Utilisateur créé avec succès !' || res.token) {
        navigate('/login');
      }
    } catch (err) {
      setError(err.message || 'Unable to connect to the server. Please try again.');
    }
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
                    <p>Already have an account? <Link to="/login">Log in</Link></p>
                    <button type="submit"><UserPlus size={18} aria-hidden="true" /> Sign Up</button>
                </form>
            </div>
        </div>
    )
}
export default Signup;