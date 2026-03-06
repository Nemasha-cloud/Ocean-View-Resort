import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
    const [credentials, setCredentials] = useState({ username: '', email: '', password: '', fullName: '', address: '', contactNumber: '' });
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // First, register the user
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });

            if (res.ok) {
                // If successful, instantly login the user and navigate to dashboard
                const loginRes = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: credentials.username, password: credentials.password })
                });

                if (loginRes.ok) {
                    const data = await loginRes.json();
                    login({ username: data.username, roles: data.roles });
                    localStorage.setItem('token', data.token);
                    navigate('/dashboard'); // Go directly to customer page
                } else {
                    navigate('/login');
                }
            } else {
                const text = await res.text();
                setError(text || 'Registration failed. Username may be taken.');
            }
        } catch (err) {
            setError('System error connecting to server.');
        }
    };

    return (
        <div className="auth-container" style={{ background: 'url(https://images.pexels.com/photos/261169/pexels-photo-261169.jpeg?auto=compress) center/cover' }}>
            <div className="auth-card wrapper-glass">
                <h2 style={{ color: '#1b4d5e' }}>Customer Registration</h2>
                <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#555' }}>Create your account to start booking stays.</p>
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
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={credentials.email}
                            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
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
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            value={credentials.fullName}
                            onChange={(e) => setCredentials({ ...credentials, fullName: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Address</label>
                        <input
                            type="text"
                            value={credentials.address}
                            onChange={(e) => setCredentials({ ...credentials, address: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Contact Number</label>
                        <input
                            type="text"
                            value={credentials.contactNumber}
                            onChange={(e) => setCredentials({ ...credentials, contactNumber: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary">Register Account</button>
                </form>
                <div className="auth-links">
                    <p>Already have an account? <Link to="/login">Login here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
