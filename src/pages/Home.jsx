import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const homeIntroImage =
    'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

// Removed static rooms variable

const faqData = [
    {
        question: 'What makes Ocean View Resort villas unique?',
        answer:
            'Our villas combine contemporary luxury with breathtaking sea views, private pools, and personalized service to create a one-of-a-kind coastal experience.',
    },
    {
        question: 'What amenities are offered in Ocean View Resort villas?',
        answer:
            'Guests enjoy private pools, premium bedding, complimentary Wi-Fi, in-villa dining options, and dedicated concierge assistance throughout their stay.',
    },
    {
        question: 'Can I expect privacy and tranquility at Ocean View Resort?',
        answer:
            'Yes. The resort layout is designed for comfort and privacy, with peaceful surroundings ideal for relaxation, romantic stays, and quiet family holidays.',
    },
    {
        question: 'How can I make a reservation at Ocean View Resort?',
        answer:
            'You can book directly through our website or by contacting our reservations team via email or phone for personalized support.',
    },
    {
        question: 'What is the cancellation policy at Ocean View Resort?',
        answer:
            'Cancellation terms vary by booking type and season. Please review the policy shown during booking or contact us for exact details.',
    },
];

const amenities = [
    {
        title: 'Private Beach Access',
        features: ['Direct access to clean and safe beach', 'Sunbeds and umbrellas', 'Relaxing ocean views'],
    },
    {
        title: 'Luxury Accommodation',
        features: ['Ocean-view rooms or suites', 'Air conditioning', 'Free Wi-Fi', '24-hour room service'],
    },
    {
        title: 'Restaurant & Bar',
        features: ['Multi-cuisine dining', 'Buffet breakfast', 'Fresh seafood', 'Poolside or beachfront bar'],
    },
    {
        title: 'Swimming Pool',
        features: ['Large outdoor or infinity pool', 'Separate kids pool', 'Poolside relaxation area'],
    },
    {
        title: 'Spa & Wellness',
        features: ['Massage and body treatments', 'Sauna and steam room', 'Relaxation therapies'],
    },
    {
        title: 'Recreation & Events Facilities',
        features: ['Water sports activities', 'Event and wedding venues', 'Conference facilities', 'Evening entertainment'],
    },
];

const amenityImages = [
    'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/b0/c2/4f/private-beach-hotels.jpg?w=1200&h=-1&s=1',
    'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://www.wedvisions.com/wp-content/uploads/2020/06/Cavo_ventus_santorini_wedding_venues.jpg',
];

const initialContactForm = { firstName: '', lastName: '', email: '', phone: '', message: '' };

const Home = () => {
    const [openFaqIndex, setOpenFaqIndex] = useState(null);
    const [dbRooms, setDbRooms] = useState([]);
    const [contactForm, setContactForm] = useState(initialContactForm);
    const [contactStatus, setContactStatus] = useState(null); // 'success' | 'error' | null
    const [contactSending, setContactSending] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const id = location.hash?.slice(1) || location.state?.scrollTo;
        if (id) {
            const el = document.getElementById(id);
            if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 150);
        }
    }, [location.pathname, location.hash, location.state?.scrollTo]);

    useEffect(() => {
        fetch('/api/rooms')
            .then(res => res.json())
            .then(data => setDbRooms(data))
            .catch(err => console.error(err));
    }, []);

    const handleFaqToggle = (index) => {
        setOpenFaqIndex((current) => (current === index ? null : index));
    };

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        setContactStatus(null);
        setContactSending(true);
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contactForm),
            });
            if (res.ok) {
                setContactStatus('success');
                setContactForm(initialContactForm);
            } else {
                setContactStatus('error');
            }
        } catch (err) {
            setContactStatus('error');
        } finally {
            setContactSending(false);
        }
    };

    return (
        <>
            <div
                className="hero"
                style={{
                    backgroundImage:
                        'url("https://assets.vogue.com/photos/62fe6a4e47cfb60aa2359c71/master/w_1600%2Cc_limit/SAN_Exteriors_Hotel_2021_DJI_0566.jpg")',
                }}
            >
                <div className="hero-text">
                    <div className="hero-kicker">DISCOVER COASTAL LUXURY WITH</div>
                    <h1>OCEAN VIEW RESORT</h1>
                    <p>Escape to a world of comfort and elegance where breathtaking ocean views meet exceptional hospitality. Relax by crystal-clear waters, enjoy refined dining experiences, 
                        and create unforgettable memories in a destination designed for pure relaxation and luxury.</p>
                </div>
            </div>

            <div className="container">
                <section id="about" className="home-intro-section">
                    <div className="home-intro-content">
                        <h1>Create Unforgettable Moments by the Sea</h1>
                        <p>
                            Step into a world of coastal elegance at Ocean View Resort, where every stay is designed to relax, 
                            inspire, and delight. Surrounded by breathtaking ocean views and refreshing sea breezes, our resort offers the perfect blend of tranquility and luxury — from peaceful sunrise 
                            walks along the beach to unforgettable sunset experiences by the water.
                        </p>
                        <p>
                            Our dedicated team is committed to delivering exceptional hospitality and personalized service for every guest. Whether you're planning a romantic escape, a family holiday, or a special celebration, 
                            Ocean View Resort ensures a comfortable, memorable, and truly relaxing seaside getaway.
                        </p>

                        <div className="home-intro-stats">
                            <div className="home-intro-stat">
                                <h3>1200+</h3>
                                <span>Happy Travelers</span>
                            </div>
                            <div className="home-intro-stat">
                                <h3>85+</h3>
                                <span>Destinations</span>
                            </div>
                            <div className="home-intro-stat">
                                <h3>15+</h3>
                                <span>Years Experience</span>
                            </div>
                        </div>
                    </div>

                    <div className="home-intro-visual">
                        <img src={homeIntroImage} alt="Ocean View Resort visual" />
                    </div>
                </section>

                <h1 className="rooms-title">Our Rooms</h1>
                <div className="room-grid">
                    {dbRooms.length === 0 && <p style={{ textAlign: 'center', width: '100%' }}>More rooms coming soon...</p>}
                    {dbRooms.map((room) => (
                        <Link key={room.id} to="/book" className="room-card room-card-link">
                            {room.imageUrl && <img src={room.imageUrl} alt={room.type} />}
                            <div className="room-info">
                                <h1>{room.type} Room</h1>
                                <p>Room No: {room.roomNumber}</p>
                                <div className="price">${room.pricePerNight} / night</div>
                            </div>
                        </Link>
                    ))}
                </div>

                <h1 id="gallery" className="rooms-title">Our Amenities</h1>
                <div className="amenities">
                    <div className="amenities-grid">
                        {amenities.map((amenity, index) => (
                            <div className="amenity-card" key={amenity.title}>
                                <img src={amenityImages[index]} alt={amenity.title} />
                                <h4>{amenity.title}</h4>
                                <ul className="amenity-feature-list">
                                    {amenity.features.map((feature) => (
                                        <li key={feature}>{feature}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="cta-box">
                    <h3>Ready to Plan Your Stay?</h3>
                    <p>Check availability and secure the best direct booking rates.</p>
                    <Link to="/book" className="button">
                        Check Availability
                    </Link>
                </div>

                <section id="faq" className="faq-section">
                    <h2>Frequently Asked Questions</h2>
                    <p className="faq-support-intro">Find quick answers about amenities, reservations, and your stay.</p>
                    <div className="faq-list">
                        {faqData.map((item, index) => {
                            const isOpen = openFaqIndex === index;
                            return (
                                <div key={item.question} className={`faq-item ${isOpen ? 'open' : ''}`}>
                                    <button type="button" className="faq-question" onClick={() => handleFaqToggle(index)}>
                                        <span>{item.question}</span>
                                        <span className="faq-icon">{isOpen ? 'x' : '+'}</span>
                                    </button>
                                    {isOpen && <p className="faq-answer">{item.answer}</p>}
                                </div>
                            );
                        })}
                    </div>
                </section>

                <section id="contact-us" className="contact-section">
                    <aside className="contact-info-card">
                        <h1>Contact Us</h1>
                        <p>
                            <span>Phone:</span>
                            +302286021735 and +306976739926 (WhatsApp)
                        </p>
                        <p>
                            <span>Reservations:</span>
                            reservations@oceanviewresort.com
                        </p>
                        <p>
                            <span>Events:</span>
                            info@oceanviewresort.com
                        </p>
                    </aside>

                    <form className="contact-form-card" onSubmit={handleContactSubmit}>
                        {contactStatus === 'success' && (
                            <p className="form-message form-message-success">Thank you! Your message has been sent. We will get back to you soon.</p>
                        )}
                        {contactStatus === 'error' && (
                            <p className="form-message form-message-error">Something went wrong. Please try again or contact us by phone/email.</p>
                        )}
                        <input
                            type="text"
                            placeholder="First Name"
                            required
                            value={contactForm.firstName}
                            onChange={(e) => setContactForm({ ...contactForm, firstName: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            required
                            value={contactForm.lastName}
                            onChange={(e) => setContactForm({ ...contactForm, lastName: e.target.value })}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            required
                            value={contactForm.email}
                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        />
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            value={contactForm.phone}
                            onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        />
                        <textarea
                            placeholder="Your message"
                            rows={7}
                            value={contactForm.message}
                            onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        />
                        <button type="submit" className="contact-submit" disabled={contactSending}>
                            {contactSending ? 'Sending...' : 'Submit'}
                        </button>
                    </form>
                </section>
            </div>
        </>
    );
};

export default Home;
