import React, { useState, useEffect } from 'react';

const ViewReservations = () => {
    const [searchId, setSearchId] = useState('');
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('/api/reservations', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setReservations(data);
            }
        } catch (err) {
            console.error('Failed to fetch reservations', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        // filter or focus on the searchId
        alert(`Searching for reservation: ${searchId}`);
    };

    const filtered = searchId
        ? reservations.filter(r => String(r.id).includes(searchId))
        : reservations;

    return (
        <div className="container">
            <h2>My Reservations</h2>

            <div className="amenities" style={{ margin: '2rem 0' }}>
                <h3>Lookup a specific reservation</h3>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Reservation number..."
                        style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc', flex: 1 }}
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                    />
                    <button type="button" onClick={() => { }} className="button" style={{ margin: 0 }}>Filter</button>
                </form>
            </div>

            {loading ? <p>Loading...</p> : (
                <div className="room-grid">
                    {filtered.length === 0 ? <p>No reservations found.</p> : filtered.map(res => (
                        <div key={res.id} className="room-card" style={{ padding: '1.5rem', borderLeft: '4px solid #1b4d5e' }}>
                            <h3>#{String(res.id).substring(0, 8).toUpperCase()}</h3>
                            <p><strong>Name:</strong> {res.guestName}</p>
                            <p><strong>Room:</strong> {res.roomType}</p>
                            <p><strong>Check-in:</strong> {new Date(res.checkInDate).toLocaleDateString()}</p>
                            <p><strong>Check-out:</strong> {new Date(res.checkOutDate).toLocaleDateString()}</p>
                            <p style={{ color: res.status === 'CONFIRMED' ? 'green' : 'red', fontWeight: 'bold' }}>Status: {res.status}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ViewReservations;
