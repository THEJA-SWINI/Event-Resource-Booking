import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-page">

      <section className="hero-section">

        <h1>Event Resource Booking System</h1>

        <p>
          Find and reserve meeting rooms, projectors, cameras,
          laboratories, seminar halls, and other shared resources.
        </p>

        <Link to="/resources" className="primary-button">
          Explore Resources
        </Link>

      </section>

      <section className="features-section">

        <div className="feature-card">
          <h2>Find Resources</h2>
          <p>
            Search and filter available resources based on your needs.
          </p>
        </div>

        <div className="feature-card">
          <h2>Check Availability</h2>
          <p>
            View available and booked time slots before making a reservation.
          </p>
        </div>

        <div className="feature-card">
          <h2>Manage Bookings</h2>
          <p>
            View your upcoming bookings and cancel bookings when required.
          </p>
        </div>

      </section>

    </div>
  );
}

export default Home;