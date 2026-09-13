import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getResourceById } from "../services/api";

function ResourceDetails() {
  const { id } = useParams();

  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadResource = async () => {
      try {
        const response = await getResourceById(id);
        setResource(response.data);
      } catch (error) {
        console.error(error);
        setError("Failed to load resource details.");
      } finally {
        setLoading(false);
      }
    };

    loadResource();
  }, [id]);

  if (loading) {
    return <p className="page-container">Loading resource...</p>;
  }

  if (error) {
    return (
      <div className="page-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="page-container">
        <p>Resource not found.</p>
      </div>
    );
  }

  return (
    <div className="page-container">

      <h1>{resource.name}</h1>

      <div className="resource-details">

        <p>
          <strong>Type:</strong> {resource.type}
        </p>

        <p>
          <strong>Location:</strong> {resource.location}
        </p>

        <p>
          <strong>Capacity:</strong> {resource.capacity}
        </p>

        <p>
          <strong>Description:</strong> {resource.description}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {resource.available ? "Available" : "Unavailable"}
        </p>

        {resource.available ? (
          <Link
            to={`/booking/${resource.id}`}
            className="primary-button"
          >
            Book Now
          </Link>
        ) : (
          <p className="error-message">
            This resource is currently unavailable.
          </p>
        )}

      </div>

    </div>
  );
}

export default ResourceDetails;