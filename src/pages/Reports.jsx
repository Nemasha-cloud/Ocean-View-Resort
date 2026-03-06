import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Reports = () => {
    const [activeTab, setActiveTab] = useState('overview');

    // Data States
    const [stats, setStats] = useState({
        totalReservations: 0,
        availableRooms: 0,
        totalRooms: 0,
        occupiedRooms: 0,
        totalGuests: 0,
        todayRevenue: 0,
        monthlyRevenue: 0,
        todayCheckins: 0,
        todayCheckouts: 0
    });
    const [reservations, setReservations] = useState([]);
    const [roomsDb, setRoomsDb] = useState([]);
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    // Form States
    const [roomForm, setRoomForm] = useState({ roomNumber: '', type: 'Standard', capacity: 2, pricePerNight: 100, imageUrl: '' });
    const [roomAddError, setRoomAddError] = useState('');
    const [roomAddSuccess, setRoomAddSuccess] = useState(false);
    const [resForm, setResForm] = useState({ guestName: '', address: '', contactNumber: '', checkInDate: '', checkOutDate: '', roomType: 'Standard', guestCount: 1 });

    useEffect(() => {
        fetchInitialData();
    }, [activeTab]);

    const fetchInitialData = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        try {
            if (activeTab === 'overview') {
                const res = await fetch('/api/dashboard/stats', { headers });
                if (res.ok) setStats(await res.json());

                const res2 = await fetch('/api/reservations', { headers });
                if (res2.ok) setReservations((await res2.json()).slice(0, 5)); // Just 5 for overview
            } else if (activeTab === 'reservations') {
                const res = await fetch('/api/reservations', { headers });
                if (res.ok) setReservations(await res.json());
            } else if (activeTab === 'rooms') {
                const res = await fetch('/api/rooms', { headers });
                if (res.ok) setRoomsDb(await res.json());
            } else if (activeTab === 'users') {
                const res = await fetch('/api/users', { headers });
                if (res.ok) setUsers(await res.json());
            } else if (activeTab === 'messages') {
                const res = await fetch('/api/contact', { headers });
                if (res.ok) setMessages(await res.json());
            }
        } catch (err) {
            console.error("Fetch error", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateResStatus = async (id, status) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`/api/reservations/${id}/status?status=${status}`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchInitialData();
        } catch (err) { }
    };

    const handleDeleteRoom = async (id) => {
        if (!window.confirm("Delete this room?")) return;
        const token = localStorage.getItem('token');
        try {
            await fetch(`/api/rooms/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            fetchInitialData();
        } catch (err) { }
    };

    const handleAddRoom = async (e) => {
        e.preventDefault();
        setRoomAddError('');
        setRoomAddSuccess(false);
        const token = localStorage.getItem('token');
        const payload = {
            roomNumber: roomForm.roomNumber.trim(),
            type: roomForm.type,
            capacity: Number(roomForm.capacity) || 1,
            pricePerNight: Number(roomForm.pricePerNight) || 100,
            imageUrl: roomForm.imageUrl.trim() || undefined,
            isAvailable: true
        };
        try {
            const res = await fetch('/api/rooms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                setRoomAddSuccess(true);
                setRoomForm({ roomNumber: '', type: 'Standard', capacity: 2, pricePerNight: 100, imageUrl: '' });
                fetchInitialData();
                setTimeout(() => {
                    setRoomAddSuccess(false);
                    setActiveTab('rooms');
                }, 1500);
            } else {
                const text = await res.text();
                setRoomAddError(text || 'Failed to add room. Room number may already exist.');
            }
        } catch (err) {
            setRoomAddError('Could not connect to server. Please try again.');
        }
    };

    const handlePrintBill = (reservation) => {
        const printWindow = window.open('', '_blank');
        const d1 = new Date(reservation.checkInDate);
        const d2 = new Date(reservation.checkOutDate);
        const nights = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24)) || 1;
        const rate = 150; // Simple mock for print logic
        const total = nights * rate;

        printWindow.document.write(`
            <html><head><title>Bill - ${reservation.guestName}</title><style>body{font-family:sans-serif;padding:40px;} table{width:100%;border-collapse:collapse;margin-top:20px;} th,td{border:1px solid #ddd;padding:12px;text-align:left;} th{background:#f4f4f4;}</style></head>
            <body>
                <h1>OCEAN VIEW RESORT - INVOICE</h1>
                <p><strong>Guest:</strong> ${reservation.guestName}</p>
                <p><strong>Room Type:</strong> ${reservation.roomType}</p>
                <table>
                    <thead><tr><th>Description</th><th>Nights</th><th>Rate</th><th>Total</th></tr></thead>
                    <tbody><tr><td>Accommodation</td><td>${nights}</td><td>$${rate}</td><td>$${total}</td></tr></tbody>
                </table>
                <h2 style="text-align:right">Total: $${total}</h2>
                <script>window.print();</script>
            </body></html>
        `);
        printWindow.document.close();
    };

    // Render Helpers
    const renderOverview = () => (
        <>
            <div className="stats-grid">
                <div className="stat-card"><h3>Total Reservations</h3><div className="stat-value">{stats.totalReservations}</div></div>
                <div className="stat-card"><h3>Available Rooms</h3><div className="stat-value">{stats.availableRooms}</div></div>
                <div className="stat-card"><h3>Revenue (Overall)</h3><div className="stat-value">${(stats.monthlyRevenue ?? 0).toLocaleString()}</div></div>
                <div className="stat-card"><h3>Total Guests</h3><div className="stat-value">{stats.totalGuests}</div></div>
            </div>

            <h2 style={{ fontSize: '1.5rem', marginTop: '2rem' }}>Recent Reservations</h2>
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr><th>ID</th><th>Guest</th><th>Type</th><th>Check-in</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {reservations.map(res => (
                            <tr key={res.id}>
                                <td>#{String(res.id).substring(0, 6).toUpperCase()}</td>
                                <td>{res.guestName}</td>
                                <td>{res.roomType}</td>
                                <td>{new Date(res.checkInDate).toLocaleDateString()}</td>
                                <td><span className={`status-badge status-${res.status.toLowerCase()}`}>{res.status}</span></td>
                                <td>
                                    <button className="action-btn btn-view" onClick={() => handlePrintBill(res)}>Bill</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );

    const renderReservations = () => (
        <div className="admin-table-container">
            <table className="admin-table">
                <thead>
                    <tr><th>Guest Name</th><th>Contact</th><th>Room</th><th>Dates</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                    {reservations.map(res => (
                        <tr key={res.id}>
                            <td>{res.guestName}</td>
                            <td>{res.contactNumber}</td>
                            <td>{res.roomType}</td>
                            <td>{new Date(res.checkInDate).toLocaleDateString()} - {new Date(res.checkOutDate).toLocaleDateString()}</td>
                            <td><span className={`status-badge status-${res.status.toLowerCase()}`}>{res.status}</span></td>
                            <td>
                                <button className="action-btn btn-view" onClick={() => handleUpdateResStatus(res.id, 'CONFIRMED')}>Confirm</button>
                                <button className="action-btn btn-delete" onClick={() => handleUpdateResStatus(res.id, 'CANCELLED')}>Cancel</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderRooms = () => (
        <>
            <div className="admin-section-header">
                <p className="admin-section-desc">View and manage all resort rooms. Delete rooms or add new ones from the navigation bar.</p>
                <button type="button" className="btn-primary btn-add-room" onClick={() => setActiveTab('addRoom')}>+ Add new room</button>
            </div>
            <div className="admin-table-container admin-rooms-table">
                <table className="admin-table">
                    <thead>
                        <tr><th>Room #</th><th>Type</th><th>Capacity</th><th>Price / night</th><th>Availability</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {roomsDb.length === 0 && (
                            <tr><td colSpan={6} className="admin-table-empty">No rooms yet. Click “Add Room” to create one.</td></tr>
                        )}
                        {roomsDb.map(r => (
                            <tr key={r.id}>
                                <td><strong>{r.roomNumber}</strong></td>
                                <td>{r.type}</td>
                                <td>{r.capacity ?? '—'} guests</td>
                                <td>${r.pricePerNight}</td>
                                <td><span className={`room-availability ${(r.available ?? r.isAvailable) ? 'available' : 'occupied'}`}>{(r.available ?? r.isAvailable) ? 'Available' : 'Occupied'}</span></td>
                                <td>
                                    <button type="button" className="action-btn btn-delete" onClick={() => handleDeleteRoom(r.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );

    const renderUsers = () => (
        <div className="admin-table-container">
            <table className="admin-table">
                <thead>
                    <tr><th>Username</th><th>Email</th><th>Roles</th><th>Actions</th></tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.id}>
                            <td>{u.username}</td>
                            <td>{u.email}</td>
                            <td>{u.roles?.join(', ')}</td>
                            <td>
                                <button className="action-btn btn-delete" onClick={() => {
                                    if (window.confirm("Delete user?")) fetch(`/api/users/${u.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }).then(() => fetchInitialData());
                                }}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderMessages = () => (
        <>
            <div className="admin-section-header" style={{ marginBottom: '1rem' }}>
                <p className="admin-section-desc">Contact form submissions from the website. Newest first.</p>
            </div>
            <div className="admin-table-container">
            <table className="admin-table">
                <thead>
                    <tr><th>Date</th><th>Name</th><th>Email</th><th>Phone</th><th>Message</th></tr>
                </thead>
                <tbody>
                    {messages.length === 0 && !loading && (
                        <tr><td colSpan={5} className="admin-table-empty">No contact messages yet.</td></tr>
                    )}
                    {messages.map(m => (
                        <tr key={m.id}>
                            <td>{m.createdAt ? new Date(m.createdAt).toLocaleString() : '—'}</td>
                            <td><strong>{m.firstName} {m.lastName}</strong></td>
                            <td>{m.email}</td>
                            <td>{m.phone || '—'}</td>
                            <td className="admin-message-cell">{m.message || '—'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </>
    );

    const renderAddRoom = () => (
        <div className="admin-card add-room-card">
            <h2>Add New Room</h2>
            <p className="add-room-intro">Add a new room to the resort. It will appear on the website and be available for booking.</p>
            {roomAddSuccess && <p className="form-message form-message-success">Room added successfully. Redirecting to Rooms...</p>}
            {roomAddError && <p className="form-message form-message-error">{roomAddError}</p>}
            <form onSubmit={handleAddRoom}>
                <div className="form-group">
                    <label>Room Number</label>
                    <input type="text" value={roomForm.roomNumber} onChange={e => setRoomForm({ ...roomForm, roomNumber: e.target.value })} placeholder="e.g. 101" required />
                </div>
                <div className="form-group">
                    <label>Type</label>
                    <select value={roomForm.type} onChange={e => setRoomForm({ ...roomForm, type: e.target.value })}>
                        <option value="Standard">Standard</option>
                        <option value="Deluxe">Deluxe</option>
                        <option value="Suite">Suite</option>
                    </select>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label>Capacity (guests)</label>
                        <input type="number" min="1" max="10" value={roomForm.capacity} onChange={e => setRoomForm({ ...roomForm, capacity: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Price per night ($)</label>
                        <input type="number" min="1" step="1" value={roomForm.pricePerNight} onChange={e => setRoomForm({ ...roomForm, pricePerNight: e.target.value })} required />
                    </div>
                </div>
                <div className="form-group">
                    <label>Image URL <span className="label-optional">(optional)</span></label>
                    <input type="url" value={roomForm.imageUrl} onChange={e => setRoomForm({ ...roomForm, imageUrl: e.target.value })} placeholder="https://example.com/room-image.jpg" />
                </div>
                <div className="form-actions">
                    <button type="submit" className="btn-primary">Add Room</button>
                    <button type="button" className="btn-secondary" onClick={() => { setActiveTab('rooms'); setRoomAddError(''); }}>Cancel</button>
                </div>
            </form>
        </div>
    );

    const panelTitle = activeTab === 'addRoom' ? 'Add Room' : activeTab === 'overview' ? 'Dashboard' : activeTab === 'messages' ? 'Messages' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1);

    return (
        <div className="admin-layout">
            <header className="admin-navbar">
                <div className="admin-navbar-inner">
                    <Link to="/" className="admin-navbar-logo">Ocean View <span>Admin</span></Link>
                    <nav className="admin-navbar-nav">
                        <button type="button" className={`admin-nav-link ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Dashboard</button>
                        <button type="button" className={`admin-nav-link ${activeTab === 'reservations' ? 'active' : ''}`} onClick={() => setActiveTab('reservations')}>Reservations</button>
                        <button type="button" className={`admin-nav-link ${activeTab === 'rooms' ? 'active' : ''}`} onClick={() => setActiveTab('rooms')}>Rooms</button>
                        <button type="button" className={`admin-nav-link ${activeTab === 'addRoom' ? 'active' : ''}`} onClick={() => setActiveTab('addRoom')}>Add Room</button>
                        <button type="button" className={`admin-nav-link ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>Users</button>
                        <button type="button" className={`admin-nav-link ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => setActiveTab('messages')}>Messages</button>
                        <button type="button" className={`admin-nav-link ${activeTab === 'help' ? 'active' : ''}`} onClick={() => setActiveTab('help')}>Help</button>
                    </nav>
                    <button type="button" className="admin-nav-logout" onClick={() => { localStorage.clear(); window.location.href = '/login'; }}>Logout</button>
                </div>
            </header>

            <main className="admin-main">
                <div className="admin-main-header">
                    <h1 className="admin-page-title">{panelTitle}</h1>
                    {loading && <span className="admin-loading-badge">Syncing...</span>}
                </div>

                {activeTab === 'overview' && renderOverview()}
                {activeTab === 'reservations' && renderReservations()}
                {activeTab === 'rooms' && renderRooms()}
                {activeTab === 'addRoom' && renderAddRoom()}
                {activeTab === 'users' && renderUsers()}
                {activeTab === 'messages' && renderMessages()}
                {activeTab === 'help' && (
                    <div className="admin-card">
                        <h3>System Guide</h3>
                        <p>Welcome to the Ocean View Resort Management System. Use the navigation bar above to switch between modules.</p>
                        <ul className="admin-guide-list">
                            <li><strong>Dashboard:</strong> Quick view of occupancy and revenue.</li>
                            <li><strong>Reservations:</strong> Confirm pending bookings or cancel them.</li>
                            <li><strong>Rooms:</strong> View and manage room inventory. Use <strong>Add Room</strong> to create new rooms.</li>
                            <li><strong>Users:</strong> Staff management.</li>
                            <li><strong>Messages:</strong> View contact form submissions from the website.</li>
                        </ul>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Reports;
