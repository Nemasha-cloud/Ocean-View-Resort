import React from 'react';

const Help = () => {
    return (
        <div className="container">
            <h2>Help Section (Staff Training)</h2>
            <p>Welcome to the Ocean View Resort Reservation Management System. Review these guidelines to assist guests properly.</p>

            <div className="amenities wrapper-glass" style={{ marginTop: '2rem' }}>
                <h3>Staff Guidelines for System Use</h3>
                <ul style={{ flexDirection: 'column', marginTop: '1rem', gap: '1.5rem' }}>
                    <li style={{ borderBottom: '1px solid #ddd', paddingBottom: '1rem', alignItems: 'flex-start' }}>
                        <div>
                            <strong>1. User Authentication (Login)</strong>
                            <p style={{ margin: '0.5rem 0' }}>All staff MUST log in using their unique credentials to process tasks. Sharing accounts is strictly prohibited by management.</p>
                        </div>
                    </li>
                    <li style={{ borderBottom: '1px solid #ddd', paddingBottom: '1rem', alignItems: 'flex-start' }}>
                        <div>
                            <strong>2. Add New Reservation</strong>
                            <p style={{ margin: '0.5rem 0' }}>Click "Add New Reservation" at the top navbar. You MUST enter the guest's name, address, contact number correctly to prevent booking conflicts.</p>
                        </div>
                    </li>
                    <li style={{ borderBottom: '1px solid #ddd', paddingBottom: '1rem', alignItems: 'flex-start' }}>
                        <div>
                            <strong>3. Display Reservation Details</strong>
                            <p style={{ margin: '0.5rem 0' }}>Guests often ask for their booking info. Go to the "Display Reservation" tab to look up active or past bookings. Ensure you verify the reservation number given to the guest.</p>
                        </div>
                    </li>
                    <li style={{ borderBottom: '1px solid #ddd', paddingBottom: '1rem', alignItems: 'flex-start' }}>
                        <div>
                            <strong>4. Calculate and Print Bill</strong>
                            <p style={{ margin: '0.5rem 0' }}>When a guest is ready to check out, navigate to "Calculate and Print Bill". Locate their reservation to compute their stay and print the physical or PDF invoice.</p>
                        </div>
                    </li>
                    <li style={{ alignItems: 'flex-start' }}>
                        <div>
                            <strong>5. Exit System</strong>
                            <p style={{ margin: '0.5rem 0' }}>If stepping away from the front desk, ensure you click "Exit System" (Logout) to safely close the application and protect guest records.</p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Help;
