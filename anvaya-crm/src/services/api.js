import axios from "axios";

const API_BASE_URL = "https://major-project2-backend-psi.vercel.app";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Leads API
export const leadsAPI = {
  getAll: (params) => api.get("/leads", { params }),
  getById: (id) => api.get(`/leads/${id}`),
  create: (data) => api.post("/leads", data),
  update: (id, data) => api.patch(`/leads/${id}`, data),
  delete: (id) => api.delete(`/leads/${id}`),
};

// Sales Agents API
export const agentsAPI = {
  getAll: () => api.get("/agents"),
  create: (data) => api.post("/agents", data),
};

// Comments API
export const commentsAPI = {
  getByLeadId: (leadId) => api.get(`/leads/${leadId}/comments`),
  create: (leadId, data) => api.post(`/leads/${leadId}/comments`, data),
};

// Reports API
export const reportsAPI = {
  getLastWeek: () => api.get("/report/last-week"),
  getPipeline: () => api.get("/report/pipeline"),
  getClosedByAgent: () => api.get("/report/closed-by-agent"),
};

export default api;
