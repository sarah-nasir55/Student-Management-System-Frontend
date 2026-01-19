import { getCookie, removeCookie } from "../lib/cookies";
import { store } from "../redux/store";
import { logout } from "../redux/authSlice";

const API_BASE_URL = process.env.REACT_APP_BASE_API_URL;

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getCookie("auth_token");

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  if (config.body && typeof config.body === "object") {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    if (response.status === 401) {
      removeCookie("auth_token");
      store.dispatch(logout());
      window.location.href = "/login";
    }
    
    const error = new Error(data?.message || "Request failed");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

// Auth API
export const authAPI = {
  login: (email, password) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: { email, password },
    }),
  signup: (email, password) =>
    apiRequest("/auth/signup", {
      method: "POST",
      body: { email, password },
    }),
  saveLayout: (email, layout) =>
    apiRequest("/auth/layout", {
      method: "POST",
      body: { email, layout: typeof layout === "string" ? layout : JSON.stringify(layout) },
    }),
};

// Students API
export const studentsAPI = {
  getAll: () => apiRequest("/students"),
  getById: (id) => apiRequest(`/students/${id}`),
  create: (data) => apiRequest("/students", { method: "POST", body: data }),
  update: (id, data) =>
    apiRequest(`/students/${id}`, { method: "PUT", body: data }),
  delete: (id) => apiRequest(`/students/${id}`, { method: "DELETE" }),
};

// Semesters API
export const semestersAPI = {
  getAll: () => apiRequest("/semesters"),
  getById: (id) => apiRequest(`/semesters/${id}`),
  create: (data) => apiRequest("/semesters", { method: "POST", body: data }),
  update: (id, data) =>
    apiRequest(`/semesters/${id}`, { method: "PUT", body: data }),
  delete: (id) => apiRequest(`/semesters/${id}`, { method: "DELETE" }),
};

// Courses API
export const coursesAPI = {
  getAll: () => apiRequest("/courses"),
  getById: (id) => apiRequest(`/courses/${id}`),
  create: (data) => apiRequest("/courses", { method: "POST", body: data }),
  update: (id, data) =>
    apiRequest(`/courses/${id}`, { method: "PUT", body: data }),
  delete: (id) => apiRequest(`/courses/${id}`, { method: "DELETE" }),
};

// Enrollments API
export const enrollmentsAPI = {
  getAll: () => apiRequest("/enrollments"),
  create: (data) => apiRequest("/enrollments", { method: "POST", body: data }),
};
