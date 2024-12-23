import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      window.location.href = "/login";
      await api.get("/auth/logout");
    }
    if (error.response.status === 500) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      window.location.href = "/login";
      await api.get("/auth/logout");
    }
    return Promise.reject(error);
  },
);

// Add an interceptor to set authorization header with user token before requests
// apiClient.interceptors.request.use(
//   function (config) {
//     // Retrieve user token from local storage
//     const token = LocalStorage.get("token");
//     // Set authorization header with bearer token
//     config.headers.Authorization = `Bearer ${token}`;
//     return config;
//   },
//   function (error) {
//     return Promise.reject(error);
//   }
// );

export default api;
