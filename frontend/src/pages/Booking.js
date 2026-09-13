import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getResourceById, createBooking } from "../services/api";

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [resource, setResource] = useState(null);

  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    endTime: "",
    purpose: "",
    userName: "",
    userEmail: ""
  });

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const userId = "user1";

  useEffect(() => {
    const loadResource = async () => {
      try {
        const response = await getResourceById(id);
        setResource(response.data);
      } catch (error) {
        console.error(error);
        setError("Failed to load resource.");
      } finally {
        setLoading(false);
      }
    };

    loadResource();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (
      !formData.date ||
      !formData.startTime ||
      !formData.endTime ||
      !formData.purpose ||
      !formData.userName ||
      !formData.userEmail
    ) {
      setError("Please fill all required fields.");
      return;
    }

    if (formData.endTime <= formData.startTime) {
      setError("End time must be later than start time.");
      return;
    }

    try {
      setSubmitting(true);

      const bookingData = {
        resourceId: Number(id),
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        purpose: formData.purpose,
        userId: userId,
        userName: formData.userName,
        userEmail: formData.userEmail
      };

      const response = await createBooking(bookingData);

      setBooking(response.data.booking);

      setFormData({
        date: "",
        startTime: "",
        endTime: "",
        purpose: "",
        userName: "",
        userEmail: ""
      });
    } catch (error) {
      console.error(error);

      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError("Failed to create booking. Please check the backend server.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <p>Loading resource...</p>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="page-container">
        <p className="error-message">
          Resource not found.
        </p>
      </div>
    );
  }

  // Show confirmation after successful booking
  if (booking) {
    return (
      <div className="page-container">

        <div className="booking-success">

          <h1>Booking Confirmed!</h1>

          <p className="success-message">
            Your resource has been booked successfully.
          </p>

          <div className="confirmation-card">

            <h2>{booking.resourceName}</h2>

            <p>
              <strong>Booking ID:</strong>{" "}
              {booking.id}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {booking.date}
            </p>

            <p>
              <strong>Time:</strong>{" "}
              {booking.startTime} - {booking.endTime}
            </p>

            <p>
              <strong>Purpose:</strong>{" "}
              {booking.purpose}
            </p>

            <p>
              <strong>Name:</strong>{" "}
              {booking.userName}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {booking.userEmail}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {booking.status}
            </p>

          </div>

          <button
            className="primary-button"
            onClick={() => navigate("/my-bookings")}
          >
            View My Bookings
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="page-container">

      <h1>Book Resource</h1>

      <div className="booking-resource">

        <h2>{resource.name}</h2>

        <p>
          <strong>Type:</strong> {resource.type}
        </p>

        <p>
          <strong>Location:</strong> {resource.location}
        </p>

        <p>
          <strong>Capacity:</strong> {resource.capacity}
        </p>

      </div>

      <form
        className="booking-form"
        onSubmit={handleSubmit}
      >

        <div className="form-group">
          <label>Date</label>

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Start Time</label>

          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>End Time</label>

          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Purpose</label>

          <textarea
            name="purpose"
            placeholder="Enter booking purpose"
            value={formData.purpose}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Your Name</label>

          <input
            type="text"
            name="userName"
            placeholder="Enter your name"
            value={formData.userName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Email</label>

          <input
            type="email"
            name="userEmail"
            placeholder="Enter your email"
            value={formData.userEmail}
            onChange={handleChange}
          />
        </div>

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="primary-button"
          disabled={submitting}
        >
          {submitting ? "Booking..." : "Confirm Booking"}
        </button>

      </form>

    </div>
  );
}

export default Booking;