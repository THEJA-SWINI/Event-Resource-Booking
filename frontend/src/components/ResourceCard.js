import { Link } from "react-router-dom";

function ResourceCard({ resource }) {
  return (
    <div className="resource-card">

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

      <p>{resource.description}</p>

      <p>
        <strong>Status:</strong>{" "}
        {resource.available ? "Available" : "Unavailable"}
      </p>

      <Link
        to={`/resources/${resource.id}`}
        className="primary-button"
      >
        View Details
      </Link>

    </div>
  );
}

export default ResourceCard;