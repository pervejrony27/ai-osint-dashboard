import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 120000, // 2 minutes for long scans
  headers: {
    "Content-Type": "application/json",
  },
});

export const scanSubdomains = (domain) =>
  api.post("/api/scan/subdomains", { domain });

export const scanDns = (domain) =>
  api.post("/api/scan/dns", { domain });

export const scanPorts = (domain) =>
  api.post("/api/scan/ports", { domain });

export const findEmails = (domain) =>
  api.post("/api/scan/emails", { domain });

export const checkBreaches = (domain) =>
  api.post("/api/scan/breaches", { domain });

export const detectTech = (domain) =>
  api.post("/api/scan/tech", { domain });

export const generateSummary = (data) =>
  api.post("/api/scan/summary", data);

export const fullScan = (domain) =>
  api.post("/api/scan/full", { domain });

export default api;