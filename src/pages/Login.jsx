import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });

            if (response.ok) {
                const data = await response.json();
                login({ username: data.username, roles: data.roles });
                localStorage.setItem('token', data.token);

                if (data.roles?.includes('ROLE_ADMIN')) {
                    navigate('/reports');
                } else {
                    navigate('/dashboard');
                }
            } else {
                setError('Invalid username or password');
            }
        } catch (err) {
            setError('System error: Unable to authenticate');
        }
    };

    return (
        <div className="auth-container" style={{ background: 'url(https://images.pexels.com/photos/261169/pexels-photo-261169.jpeg?auto=compress) center/cover' }}>
            <div className="auth-card wrapper-glass">
                <h2 style={{ color: '#1b4d5e' }}>Login</h2>
                <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#555' }}>Welcome back! Please login to your account.</p>
                {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            value={credentials.username}
                            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary">Login</button>
                </form>
                <div className="auth-links">
                    <p>Don't have an account? <Link to="/register">Register here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
