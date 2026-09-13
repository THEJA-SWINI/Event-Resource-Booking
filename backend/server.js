const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());

const resourcesFile = path.join(__dirname, "data", "resources.json");
const bookingsFile = path.join(__dirname, "data", "bookings.json");

function readResources() {
  return JSON.parse(fs.readFileSync(resourcesFile, "utf-8"));
}

function readBookings() {
  return JSON.parse(fs.readFileSync(bookingsFile, "utf-8"));
}

function saveResources(resources) {
  fs.writeFileSync(
    resourcesFile,
    JSON.stringify(resources, null, 2)
  );
}

function saveBookings(bookings) {
  fs.writeFileSync(
    bookingsFile,
    JSON.stringify(bookings, null, 2)
  );
}

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Resource Booking Backend is running"
  });
});

// ===============================
// RESOURCE ROUTES
// ===============================

// Get all resources
app.get("/api/resources", (req, res) => {
  const resources = readResources();

  const { search, type } = req.query;

  let filteredResources = resources;

  if (search) {
    filteredResources = filteredResources.filter((resource) =>
      resource.name.toLowerCase().includes(search.toLowerCase()) ||
      resource.type.toLowerCase().includes(search.toLowerCase()) ||
      resource.location.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (type) {
    filteredResources = filteredResources.filter(
      (resource) =>
        resource.type.toLowerCase() === type.toLowerCase()
    );
  }

  res.json(filteredResources);
});

// Get resource by ID
app.get("/api/resources/:id", (req, res) => {
  const resources = readResources();

  const resource = resources.find(
    (item) => item.id === Number(req.params.id)
  );

  if (!resource) {
    return res.status(404).json({
      message: "Resource not found"
    });
  }

  res.json(resource);
});

// ===============================
// BOOKING ROUTES
// ===============================

// Get all bookings
app.get("/api/bookings", (req, res) => {
  const bookings = readBookings();

  res.json(bookings);
});

// Get bookings for a particular user
app.get("/api/bookings/user/:userId", (req, res) => {
  const bookings = readBookings();

  const userBookings = bookings.filter(
    (booking) => booking.userId === req.params.userId
  );

  res.json(userBookings);
});

// Create booking
app.post("/api/bookings", (req, res) => {
  const {
    resourceId,
    date,
    startTime,
    endTime,
    purpose,
    userId,
    userName,
    userEmail
  } = req.body;

  // Required field validation
  if (
    !resourceId ||
    !date ||
    !startTime ||
    !endTime ||
    !purpose ||
    !userId ||
    !userName ||
    !userEmail
  ) {
    return res.status(400).json({
      message: "All booking fields are required"
    });
  }

  // Validate resource
  const resources = readResources();

  const resource = resources.find(
    (item) => item.id === Number(resourceId)
  );

  if (!resource) {
    return res.status(404).json({
      message: "Resource not found"
    });
  }

  // Validate date
  const selectedDate = new Date(`${date}T00:00:00`);
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  if (isNaN(selectedDate.getTime())) {
    return res.status(400).json({
      message: "Invalid date"
    });
  }

  if (selectedDate < today) {
    return res.status(400).json({
      message: "Booking date cannot be in the past"
    });
  }

  // Validate time
  if (endTime <= startTime) {
    return res.status(400).json({
      message: "End time must be later than start time"
    });
  }

  const bookings = readBookings();

  // Check overlapping bookings
  const overlappingBooking = bookings.find((booking) => {
    if (booking.resourceId !== Number(resourceId)) {
      return false;
    }

    if (booking.date !== date) {
      return false;
    }

    if (
      booking.status === "cancelled" ||
      booking.status === "completed"
    ) {
      return false;
    }

    const existingStart = booking.startTime;
    const existingEnd = booking.endTime;

    const newStart = startTime;
    const newEnd = endTime;

    return (
      newStart < existingEnd &&
      newEnd > existingStart
    );
  });

  if (overlappingBooking) {
    return res.status(409).json({
      message:
        "This resource is already booked for the selected time slot"
    });
  }

  const newBooking = {
    id: Date.now(),
    resourceId: Number(resourceId),
    resourceName: resource.name,
    date,
    startTime,
    endTime,
    purpose,
    userId,
    userName,
    userEmail,
    status: "upcoming"
  };

  bookings.push(newBooking);

  saveBookings(bookings);

  res.status(201).json({
    message: "Booking created successfully",
    booking: newBooking
  });
});

// Cancel booking
app.patch("/api/bookings/:id/cancel", (req, res) => {
  const bookings = readBookings();

  const bookingIndex = bookings.findIndex(
    (booking) => booking.id === Number(req.params.id)
  );

  if (bookingIndex === -1) {
    return res.status(404).json({
      message: "Booking not found"
    });
  }

  const booking = bookings[bookingIndex];

  if (booking.status === "completed") {
    return res.status(400).json({
      message: "Completed booking cannot be cancelled"
    });
  }

  if (booking.status === "cancelled") {
    return res.status(400).json({
      message: "Booking is already cancelled"
    });
  }

  booking.status = "cancelled";

  saveBookings(bookings);

  res.json({
    message: "Booking cancelled successfully",
    booking
  });
});

// ===============================
// ADMIN RESOURCE ROUTES
// ===============================

// Add resource
app.post("/api/resources", (req, res) => {
  const {
    name,
    type,
    location,
    capacity,
    description
  } = req.body;

  if (
    !name ||
    !type ||
    !location ||
    !capacity ||
    !description
  ) {
    return res.status(400).json({
      message: "All resource fields are required"
    });
  }

  const resources = readResources();

  const newResource = {
    id: Date.now(),
    name,
    type,
    location,
    capacity: Number(capacity),
    description,
    available: true
  };

  resources.push(newResource);

  saveResources(resources);

  res.status(201).json({
    message: "Resource added successfully",
    resource: newResource
  });
});

// Update resource
app.put("/api/resources/:id", (req, res) => {
  const resources = readResources();

  const resourceIndex = resources.findIndex(
    (resource) => resource.id === Number(req.params.id)
  );

  if (resourceIndex === -1) {
    return res.status(404).json({
      message: "Resource not found"
    });
  }

  const {
    name,
    type,
    location,
    capacity,
    description,
    available
  } = req.body;

  if (
    !name ||
    !type ||
    !location ||
    !capacity ||
    !description
  ) {
    return res.status(400).json({
      message: "All resource fields are required"
    });
  }

  resources[resourceIndex] = {
    ...resources[resourceIndex],
    name,
    type,
    location,
    capacity: Number(capacity),
    description,
    available:
      available !== undefined
        ? available
        : resources[resourceIndex].available
  };

  saveResources(resources);

  res.json({
    message: "Resource updated successfully",
    resource: resources[resourceIndex]
  });
});

// Delete resource
app.delete("/api/resources/:id", (req, res) => {
  const resources = readResources();

  const resourceIndex = resources.findIndex(
    (resource) => resource.id === Number(req.params.id)
  );

  if (resourceIndex === -1) {
    return res.status(404).json({
      message: "Resource not found"
    });
  }

  const deletedResource = resources.splice(resourceIndex, 1)[0];

  saveResources(resources);

  res.json({
    message: "Resource deleted successfully",
    resource: deletedResource
  });
});

// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});