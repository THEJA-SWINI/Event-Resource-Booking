import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">

        <Link to="/" className="navbar-logo">
          Resource Booking
        </Link>

        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/resources">Resources</Link>
          <Link to="/my-bookings">My Bookings</Link>
          <Link to="/admin">Admin</Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;