import { useEffect, useState } from "react";
import {
  getResources,
  getBookings,
  addResource,
  updateResource,
  deleteResource,
  cancelBooking
} from "../services/api";

function Admin() {
  const [resources, setResources] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    type: "",
    location: "",
    capacity: "",
    description: ""
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [resourceResponse, bookingResponse] = await Promise.all([
        getResources(),
        getBookings()
      ]);

      setResources(
        Array.isArray(resourceResponse.data)
          ? resourceResponse.data
          : []
      );

      setBookings(
        Array.isArray(bookingResponse.data)
          ? bookingResponse.data
          : []
      );
    } catch (error) {
      console.error("Admin loading error:", error);
      setError("Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  };

  const resetForm = () => {
    setForm({
      name: "",
      type: "",
      location: "",
      capacity: "",
      description: ""
    });

    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !form.name ||
      !form.type ||
      !form.location ||
      !form.capacity ||
      !form.description
    ) {
      alert("Please fill all resource fields.");
      return;
    }

    try {
      if (editingId) {
        await updateResource(editingId, {
          ...form,
          capacity: Number(form.capacity),
          available: true
        });

        alert("Resource updated successfully.");
      } else {
        await addResource({
          ...form,
          capacity: Number(form.capacity)
        });

        alert("Resource added successfully.");
      }

      resetForm();
      await loadData();
    } catch (error) {
      console.error("Resource save error:", error);

      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Failed to save resource.");
      }
    }
  };

  const handleEdit = (resource) => {
    setEditingId(resource.id);

    setForm({
      name: resource.name || "",
      type: resource.type || "",
      location: resource.location || "",
      capacity: resource.capacity || "",
      description: resource.description || ""
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this resource?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteResource(id);

      alert("Resource deleted successfully.");

      await loadData();
    } catch (error) {
      console.error("Delete resource error:", error);

      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Failed to delete resource.");
      }
    }
  };

  const handleCancelBooking = async (id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) {
      return;
    }

    try {
      await cancelBooking(id);

      alert("Booking cancelled successfully.");

      await loadData();
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
        <h1>Admin</h1>
        <p>Loading admin data...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>Admin Dashboard</h1>

      {error && (
        <div className="error-message">
          <p>{error}</p>

          <button onClick={loadData}>
            Try Again
          </button>
        </div>
      )}

      {/* RESOURCE MANAGEMENT */}

      <section className="admin-section">
        <h2>
          {editingId
            ? "Edit Resource"
            : "Add New Resource"}
        </h2>

        <form
          className="resource-form"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="name"
            placeholder="Resource name"
            value={form.name}
            onChange={handleChange}
          />

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
          >
            <option value="">
              Select resource type
            </option>
            <option value="Meeting Room">
              Meeting Room
            </option>
            <option value="Projector">
              Projector
            </option>
            <option value="Camera">
              Camera
            </option>
            <option value="Laboratory">
              Laboratory
            </option>
            <option value="Seminar Hall">
              Seminar Hall
            </option>
          </select>

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
          />

          <input
            type="number"
            name="capacity"
            placeholder="Capacity"
            min="1"
            value={form.capacity}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />

          <div>
            <button type="submit">
              {editingId
                ? "Update Resource"
                : "Add Resource"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </section>

      {/* RESOURCE LIST */}

      <section className="admin-section">
        <h2>Resources</h2>

        {resources.length === 0 ? (
          <p>No resources found.</p>
        ) : (
          <div className="bookings-grid">
            {resources.map((resource) => (
              <div
                className="booking-card"
                key={resource.id}
              >
                <h3>{resource.name}</h3>

                <p>
                  <strong>Type:</strong>{" "}
                  {resource.type}
                </p>

                <p>
                  <strong>Location:</strong>{" "}
                  {resource.location}
                </p>

                <p>
                  <strong>Capacity:</strong>{" "}
                  {resource.capacity}
                </p>

                <p>
                  <strong>Description:</strong>{" "}
                  {resource.description}
                </p>

                <p>
                  <strong>Available:</strong>{" "}
                  {resource.available
                    ? "Yes"
                    : "No"}
                </p>

                <button
                  onClick={() =>
                    handleEdit(resource)
                  }
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(resource.id)
                  }
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* BOOKING MANAGEMENT */}

      <section className="admin-section">
        <h2>All Bookings</h2>

        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <div className="bookings-grid">
            {bookings.map((booking) => (
              <div
                className="booking-card"
                key={booking.id}
              >
                <h3>
                  {booking.resourceName}
                </h3>

                <p>
                  <strong>Booking ID:</strong>{" "}
                  {booking.id}
                </p>

                <p>
                  <strong>User:</strong>{" "}
                  {booking.userName}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {booking.userEmail}
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {booking.date}
                </p>

                <p>
                  <strong>Time:</strong>{" "}
                  {booking.startTime} -{" "}
                  {booking.endTime}
                </p>

                <p>
                  <strong>Purpose:</strong>{" "}
                  {booking.purpose}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {booking.status}
                </p>

                {booking.status !== "cancelled" &&
                  booking.status !== "completed" && (
                    <button
                      onClick={() =>
                        handleCancelBooking(
                          booking.id
                        )
                      }
                    >
                      Cancel Booking
                    </button>
                  )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Admin;