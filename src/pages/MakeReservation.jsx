import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const MakeReservation = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        guestName: '',
        address: '',
        contactNumber: '',
        checkInDate: '',
        checkOutDate: '',
        roomType: '',
        guestCount: 1
    });
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' | 'error'
    const [dbRooms, setDbRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/rooms')
            .then(res => res.json())
            .then(data => {
                setDbRooms(data);
                if (data.length > 0 && !formData.roomType) {
                    setFormData(prev => ({ ...prev, roomType: data[0].type }));
                }
            })
            .catch(() => setDbRooms([]))
            .finally(() => setLoading(false));
    }, []);

    const selectedRoom = dbRooms.find(r => r.type === formData.roomType);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setMessageType('');
        const token = localStorage.getItem('token');

        try {
            const res = await fetch('/api/reservations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setMessage('Reservation requested successfully! We will confirm shortly.');
                setMessageType('success');
                setTimeout(() => navigate('/reservations'), 2200);
            } else {
                setMessage('Unable to create reservation. Please check dates and try again.');
                setMessageType('error');
            }
        } catch (err) {
            setMessage('Error connecting to the server. Please try again.');
            setMessageType('error');
        }
    };

    const nights = formData.checkInDate && formData.checkOutDate
        ? Math.max(0, Math.ceil((new Date(formData.checkOutDate) - new Date(formData.checkInDate)) / (1000 * 60 * 60 * 24)))
        : 0;
    const estimatedTotal = selectedRoom && nights > 0
        ? (Number(selectedRoom.pricePerNight) || 0) * nights
        : null;

    return (
        <div className="page-book">
            <div className="book-hero">
                <div className="book-hero-content">
                    <h1>Book Your Stay</h1>
                    <p>Choose your dates and room for a seamless reservation at Ocean View Resort.</p>
                </div>
            </div>

            <div className="container">
                <div className="book-layout">
                    <section className="book-form-section">
                        <h2>Reservation Details</h2>
                        {message && (
                            <div className={`form-message ${messageType === 'success' ? 'form-message-success' : 'form-message-error'}`}>
                                {message}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="book-form">
                            <div className="form-section-block">
                                <h3 className="form-section-title">Guest information</h3>
                                <div className="form-group">
                                    <label>Full name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="John Smith"
                                        value={formData.guestName}
                                        onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Address</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Street, city, country"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Contact number</label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="+1 234 567 8900"
                                        value={formData.contactNumber}
                                        onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-section-block">
                                <h3 className="form-section-title">Dates</h3>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Check-in</label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.checkInDate}
                                            onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Check-out</label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.checkOutDate}
                                            onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-section-block">
                                <h3 className="form-section-title">Room & guests</h3>
                                <div className="form-group">
                                    <label>Room type</label>
                                    <select
                                        value={formData.roomType}
                                        onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                                        required
                                    >
                                        {loading && <option value="">Loading rooms...</option>}
                                        {!loading && dbRooms.length === 0 && <option value="">No rooms available</option>}
                                        {dbRooms.map(room => (
                                            <option key={room.id} value={room.type}>
                                                {room.type} — ${room.pricePerNight}/night
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Number of guests</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        required
                                        value={formData.guestCount}
                                        onChange={(e) => setFormData({ ...formData, guestCount: Number(e.target.value) || 1 })}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn-primary btn-book-submit">
                                Reserve room
                            </button>
                        </form>
                    </section>

                    <aside className="book-summary">
                        <div className="book-summary-card">
                            <h3>Your selection</h3>
                            {loading ? (
                                <p className="book-summary-loading">Loading rooms...</p>
                            ) : selectedRoom ? (
                                <>
                                    <div className="book-summary-room">
                                        {selectedRoom.imageUrl && (
                                            <img src={selectedRoom.imageUrl} alt={selectedRoom.type} />
                                        )}
                                        <div>
                                            <strong>{selectedRoom.type} Room</strong>
                                            <p>Room {selectedRoom.roomNumber} · up to {selectedRoom.capacity} guests</p>
                                            <p className="book-summary-price">${selectedRoom.pricePerNight} <span>/ night</span></p>
                                        </div>
                                    </div>
                                    {formData.checkInDate && formData.checkOutDate && nights > 0 && (
                                        <div className="book-summary-dates">
                                            <p><strong>{nights}</strong> night{nights !== 1 ? 's' : ''}</p>
                                            <p>{new Date(formData.checkInDate).toLocaleDateString()} – {new Date(formData.checkOutDate).toLocaleDateString()}</p>
                                            {estimatedTotal != null && (
                                                <p className="book-summary-total">Estimated total <strong>${estimatedTotal.toLocaleString()}</strong></p>
                                            )}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p className="book-summary-muted">Select a room type to see details.</p>
                            )}
                        </div>
                        <p className="book-back-link">
                            <Link to="/">← Back to home</Link>
                        </p>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default MakeReservation;
