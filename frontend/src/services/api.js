import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

// Resources
export const getResources = (search = "", type = "") => {
  return API.get("/resources", {
    params: {
      search,
      type
    }
  });
};

export const getResourceById = (id) => {
  return API.get(`/resources/${id}`);
};

export const addResource = (resource) => {
  return API.post("/resources", resource);
};

export const updateResource = (id, resource) => {
  return API.put(`/resources/${id}`, resource);
};

export const deleteResource = (id) => {
  return API.delete(`/resources/${id}`);
};

// Bookings
export const getBookings = () => {
  return API.get("/bookings");
};

export const getUserBookings = (userId) => {
  return API.get(`/bookings/user/${userId}`);
};

export const createBooking = (booking) => {
  return API.post("/bookings", booking);
};

export const cancelBooking = (id) => {
  return API.patch(`/bookings/${id}/cancel`);
};

export default API;