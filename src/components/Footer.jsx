import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer>
            <p>&copy; {new Date().getFullYear()} Ocean View Resort. All rights reserved.</p>
            <p className="footer-links">
                <Link to="#">Privacy Policy</Link>
                <span className="footer-sep">·</span>
                <Link to="#">Terms of Service</Link>
            </p>
            <p className="footer-tagline">Luxury coastal stays</p>
        </footer>
    );
};

export default Footer;
