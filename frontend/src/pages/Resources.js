import { useEffect, useState } from "react";
import { getResources } from "../services/api";
import ResourceCard from "../components/ResourceCard";

function Resources() {
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadResources = async (searchValue, typeValue) => {
    try {
      setLoading(true);
      setError("");

      const response = await getResources(
        searchValue,
        typeValue
      );

      setResources(response.data);
    } catch (error) {
      console.error(error);
      setError("Failed to load resources.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources("", "");
  }, []);

  const handleSearch = () => {
    loadResources(search, type);
  };

  const handleTypeChange = (event) => {
    const selectedType = event.target.value;

    setType(selectedType);

    loadResources(search, selectedType);
  };

  const handleClear = () => {
    setSearch("");
    setType("");

    loadResources("", "");
  };

  return (
    <div className="page-container">

      <h1>Available Resources</h1>

      <div className="filter-section">

        <input
          type="text"
          placeholder="Search by name, type or location..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          value={type}
          onChange={handleTypeChange}
        >
          <option value="">All Types</option>
          <option value="Meeting Room">Meeting Room</option>
          <option value="Projector">Projector</option>
          <option value="Camera">Camera</option>
          <option value="Laboratory">Laboratory</option>
          <option value="Seminar Hall">Seminar Hall</option>
        </select>

        <button onClick={handleSearch}>
          Search
        </button>

        <button
          className="secondary-button"
          onClick={handleClear}
        >
          Clear
        </button>

      </div>

      {loading && (
        <p>Loading resources...</p>
      )}

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {!loading && !error && resources.length === 0 && (
        <div className="empty-message">
          <h3>No resources found</h3>
          <p>
            Try a different search or resource type.
          </p>
        </div>
      )}

      <div className="resources-grid">

        {resources.map((resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
          />
        ))}

      </div>

    </div>
  );
}

export default Resources;