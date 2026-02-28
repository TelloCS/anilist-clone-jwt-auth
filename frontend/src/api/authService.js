import api from "./api";

const authService = {
  login: async (credentials) => {
    const response = await api.post("/api/login/", credentials);
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post("/api/register/", userData);
    return response.data;
  },
  logout: async () => {
    const response = await api.post("/api/logout/");
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get("/api/user/");
    return response.data;
  },
};

export default authService;