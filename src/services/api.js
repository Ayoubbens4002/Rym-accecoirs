import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/** Requis avant login admin (Sanctum SPA) */
export async function fetchCsrfCookie() {
  await axios.get('/sanctum/csrf-cookie', {
    withCredentials: true,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
  });
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      import('../store/useAuthStore').then(({ useAuthStore }) => {
        useAuthStore.setState({ user: null, isAuthenticated: false, isLoading: false });
      });
    }
    return Promise.reject(error);
  }
);

export default api;
