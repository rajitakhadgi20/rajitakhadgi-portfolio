const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

function getToken() {
  return localStorage.getItem("admin_token") || "";
}

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (res.status === 401) {
    localStorage.removeItem("admin_token");
    window.location.reload();
    throw new Error("Session expired.");
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Request failed (${res.status})`);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  login: (email, password) =>
    request("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  me: () => request("/api/auth/me"),

  listProjects: () => request("/api/projects"),
  createProject: (data) => request("/api/projects", { method: "POST", body: JSON.stringify(data) }),
  updateProject: (id, data) => request(`/api/projects/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteProject: (id) => request(`/api/projects/${id}`, { method: "DELETE" }),
  reorderProjects: (order) => request("/api/projects/reorder/all", { method: "PUT", body: JSON.stringify({ order }) }),

  listMessages: () => request("/api/contact"),
  markMessageRead: (id, read) => request(`/api/contact/${id}/read`, { method: "PUT", body: JSON.stringify({ read }) }),
  deleteMessage: (id) => request(`/api/contact/${id}`, { method: "DELETE" }),

  listExperience: () => request("/api/experience/all"),
  createExperience: (data) => request("/api/experience", { method: "POST", body: JSON.stringify(data) }),
  updateExperience: (id, data) => request(`/api/experience/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteExperience: (id) => request(`/api/experience/${id}`, { method: "DELETE" }),
  reorderExperience: (order) => request("/api/experience/reorder/all", { method: "PUT", body: JSON.stringify({ order }) }),

  listGallery: () => request("/api/gallery"),
  createGalleryItem: (data) => request("/api/gallery", { method: "POST", body: JSON.stringify(data) }),
  updateGalleryItem: (id, data) => request(`/api/gallery/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteGalleryItem: (id) => request(`/api/gallery/${id}`, { method: "DELETE" }),
  reorderGallery: (order) => request("/api/gallery/reorder/all", { method: "PUT", body: JSON.stringify({ order }) }),

  getProfile: () => request("/api/profile"),
  updateProfile: (data) => request("/api/profile", { method: "PUT", body: JSON.stringify(data) }),

  listCertificates: () => request("/api/certificates"),
  createCertificate: (data) => request("/api/certificates", { method: "POST", body: JSON.stringify(data) }),
  updateCertificate: (id, data) => request(`/api/certificates/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteCertificate: (id) => request(`/api/certificates/${id}`, { method: "DELETE" }),
  reorderCertificates: (order) => request("/api/certificates/reorder/all", { method: "PUT", body: JSON.stringify({ order }) }),

  listSkills: () => request("/api/skills"),
  createSkill: (data) => request("/api/skills", { method: "POST", body: JSON.stringify(data) }),
  updateSkill: (id, data) => request(`/api/skills/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteSkill: (id) => request(`/api/skills/${id}`, { method: "DELETE" }),
  reorderSkills: (order) => request("/api/skills/reorder/all", { method: "PUT", body: JSON.stringify({ order }) }),
};

export { getToken };