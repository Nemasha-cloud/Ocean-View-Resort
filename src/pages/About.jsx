import React from 'react';

const aboutPhoto =
  'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&dpr=2';

const About = () => {
  return (
    <section className="about-page">
      <div className="about-hero-wrap">
        <p className="about-eyebrow">About Ocean View Resort</p>
        <h1>Where Luxury Meets the Ocean</h1>
      </div>

      <div className="about-grid">
        <div className="about-copy">
          <p>
            Nestled along a breathtaking coastline, Ocean View Resort is a sanctuary of elegance, comfort, and unforgettable seaside experiences. Designed to blend modern luxury with the natural beauty of the ocean, our resort offers guests a peaceful escape where every detail is thoughtfully curated for relaxation and indulgence.
          </p>
          <p>
            From stunning sunrise views to golden sunsets over the water, we provide an atmosphere that inspires tranquility and rejuvenation. Whether you are seeking a romantic getaway, a family holiday, or a private luxury retreat, Ocean View Resort promises a stay that exceeds expectations.
          </p>

          <h2>Our Story</h2>
          <p>
            Ocean View Resort was created with a vision to redefine beachfront hospitality. Built on a passion for exceptional service and refined living, our resort combines contemporary architecture, premium facilities, and warm hospitality to deliver a truly memorable experience.
          </p>
          <p>
            Our commitment is simple: to provide every guest with comfort, privacy, and personalized service in a setting of natural beauty.
          </p>

          <h2>Our Mission</h2>
          <p>
            To deliver world-class hospitality by combining luxury, comfort, and personalized service while preserving the beauty of our coastal environment.
          </p>

          <h2>Our Vision</h2>
          <p>
            To become a leading beachfront destination known for excellence, sustainability, and unforgettable guest experiences.
          </p>
        </div>

        <div className="about-photo-card">
          <img src={aboutPhoto} alt="Ocean View Resort coastline" />
        </div>
      </div>
    </section>
  );
};

export default About;
