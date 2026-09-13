import { useEffect, useState } from "react";
import { getUserBookings, cancelBooking } from "../services/api";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = "user1";

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getUserBookings(userId);

      if (Array.isArray(response.data)) {
        setBookings(response.data);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error("My bookings error:", error);
      setError("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancel = async (id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) {
      return;
    }

    try {
      await cancelBooking(id);

      alert("Booking cancelled successfully.");

      await loadBookings();
    } catch (error) {
      console.error("Cancel booking error:", error);

      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Failed to cancel booking.");
      }
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <h1>My Bookings</h1>
        <p>Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>My Bookings</h1>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={loadBookings}>Try Again</button>
        </div>
      )}

      {!error && bookings.length === 0 && (
        <div className="empty-message">
          <h3>No bookings found</h3>
          <p>You have not made any bookings yet.</p>
        </div>
      )}

      {!error && bookings.length > 0 && (
        <div className="bookings-grid">
          {bookings.map((booking) => (
            <div className="booking-card" key={booking.id}>
              <h2>{booking.resourceName}</h2>

              <p>
                <strong>Booking ID:</strong> {booking.id}
              </p>

              <p>
                <strong>Date:</strong> {booking.date}
              </p>

              <p>
                <strong>Time:</strong> {booking.startTime} -{" "}
                {booking.endTime}
              </p>

              <p>
                <strong>Purpose:</strong> {booking.purpose}
              </p>

              <p>
                <strong>Name:</strong> {booking.userName}
              </p>

              <p>
                <strong>Email:</strong> {booking.userEmail}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span className={`status-${booking.status}`}>
                  {booking.status}
                </span>
              </p>

              {booking.status !== "cancelled" &&
                booking.status !== "completed" && (
                  <button
                    className="cancel-button"
                    onClick={() => handleCancel(booking.id)}
                  >
                    Cancel Booking
                  </button>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;