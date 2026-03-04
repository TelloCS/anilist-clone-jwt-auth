import api from "./api";

const authService = {
    getCsrfToken: async () => {
    await api.get("/api/csrf/"); 
  },
  login: async (credentials) => {
    await authService.getCsrfToken();
    const response = await api.post("/api/login/", credentials);
    return response.data;
  },
  register: async (userData) => {
    await authService.getCsrfToken();
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