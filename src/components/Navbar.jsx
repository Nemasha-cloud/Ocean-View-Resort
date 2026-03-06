import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [languageOpen, setLanguageOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setLanguageOpen(false);
        };
        if (languageOpen) document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [languageOpen]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const scrollToSection = (id) => (e) => {
        if (window.location.pathname === '/') {
            e.preventDefault();
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
        // else: Link navigates to / with state; Home will scroll on mount
    };

    return (
        <header className="navbar-home">
            <Link to="/" className="navbar-brand">
                <img src="/logo.png" alt="Ocean View Resort" className="navbar-logo-img" />
            </Link>

            <nav className="navbar-nav">
                <Link to="/" className="navbar-link">HOME</Link>
                <Link to="/about" className="navbar-link">ABOUT US</Link>
                <Link to="/gallery" className="navbar-link">GALLERY</Link>
                <Link to="/" className="navbar-link" onClick={scrollToSection('faq')} state={{ scrollTo: 'faq' }}>FAQ</Link>
                <Link to="/" className="navbar-link" onClick={scrollToSection('contact-us')} state={{ scrollTo: 'contact-us' }}>CONTACT US</Link>

                <div className="navbar-dropdown" ref={dropdownRef}>
                    <button type="button" className="navbar-link navbar-link-btn" onClick={(e) => { e.stopPropagation(); setLanguageOpen(!languageOpen); }} aria-expanded={languageOpen}>
                        LANGUAGE <span className="navbar-chevron">▼</span>
                    </button>
                    {languageOpen && (
                        <div className="navbar-dropdown-menu">
                            <button type="button">English</button>
                            <button type="button">Español</button>
                            <button type="button">Français</button>
                        </div>
                    )}
                </div>

                {!user ? (
                    <>
                        <Link to="/login" className="navbar-link">LOGIN</Link>
                        <Link to="/register" className="navbar-btn-register">REGISTER</Link>
                    </>
                ) : (
                    <>
                        <Link to="/book" className="navbar-link">BOOK NOW</Link>
                        {user.roles?.includes('ROLE_ADMIN') ? (
                            <Link to="/reports" className="navbar-link nav-admin">ADMIN</Link>
                        ) : (
                            <Link to="/dashboard" className="navbar-link">MY DASHBOARD</Link>
                        )}
                        <button type="button" onClick={handleLogout} className="navbar-btn-logout">LOGOUT</button>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Navbar;
