const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function api(path, opt = {}) {
  const headers = opt.body instanceof FormData ? {} : { "Content-Type": "application/json" };
  const token = localStorage.getItem("travelx_token");
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(API + path, { ...opt, headers: { ...headers, ...(opt.headers || {}) } });
  const text = await response.text();
  let data = {};
  try { data = text ? JSON.parse(text) : {}; } catch { data = { message: text }; }
  if (!response.ok) throw Error(data.message || "Request failed");
  return data;
}

export const auth = {
  login: body => api("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  register: body => api("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  me: () => api("/auth/me"),
};

export const discoveries = {
  list: () => api("/discoveries"),
  create: body => api("/discoveries", { method: "POST", body: JSON.stringify(body) }),
  verify: (id, body = {}) => api(`/discoveries/${id}/verify`, { method: "POST", body: JSON.stringify(body) }),
};

export const trips = {
  list: () => api("/trips"),
  get: id => api(`/trips/${id}`),
  create: body => api("/trips", { method: "POST", body: JSON.stringify(body) }),
  generate: id => api(`/trips/${id}/generate`, { method: "POST" }),
  update: (id, body) => api(`/trips/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  complete: id => api(`/trips/${id}/complete`, { method: "POST" }),
  completeDay: (tripId, dayId) => api(`/trips/${tripId}/days/${dayId}/complete`, { method: "POST" }),
  addActivity: (tripId, dayId, body) => api(`/trips/${tripId}/days/${dayId}/activities`, { method: "POST", body: JSON.stringify(body) }),
  addExpense: (tripId, body) => api(`/trips/${tripId}/expenses`, { method: "POST", body: JSON.stringify(body) }),
};

export const activities = {
  update: (id, body) => api(`/activities/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  remove: id => api(`/activities/${id}`, { method: "DELETE" }),
  complete: (id, completed = true) => api(`/activities/${id}/complete`, { method: "POST", body: JSON.stringify({ completed }) }),
};

export default api;
