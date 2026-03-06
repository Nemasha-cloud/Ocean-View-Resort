import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="container">
            <h2>Welcome back, {user?.username}</h2>
            <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>This is your personal Customer Dashboard. Manage your upcoming stays and reservations here.</p>

            <div className="room-grid">
                <div className="room-card wrapper-glass" style={{ padding: '2rem', textAlign: 'center' }}>
                    <h3>Book a New Stay</h3>
                    <p>Ready for your next vacation? Check our availability and reserve a room.</p>
                    <Link to="/book" className="button" style={{ marginTop: '1rem' }}>Book Now</Link>
                </div>

                <div className="room-card wrapper-glass" style={{ padding: '2rem', textAlign: 'center' }}>
                    <h3>My Reservations</h3>
                    <p>View or modify your current and upcoming stays with us.</p>
                    <Link to="/reservations" className="button" style={{ marginTop: '1rem', backgroundColor: '#1b4d5e', color: 'white' }}>View Stays</Link>
                </div>

                <div className="room-card wrapper-glass" style={{ padding: '2rem', textAlign: 'center' }}>
                    <h3>Need Assistance?</h3>
                    <p>Get help with your bookings or contact our support team.</p>
                    <Link to="/help" className="button" style={{ marginTop: '1rem', backgroundColor: '#ffd966' }}>Help Center</Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
