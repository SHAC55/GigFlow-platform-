import axios from "axios";

const api = axios.create({
  baseURL: "https://gigflow-platform-2n2e.onrender.com/api",
  withCredentials: true,
});

// baseURL: "http://localhost:3000/api",

export default api;
