import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("bonjourbee_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default http;
