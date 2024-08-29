import axios from 'axios';

const AxiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

AxiosInstance.interceptors.request.use(
  async (config) => {
    // Example flag to check if the token should be added
    const tokenRequired = config.headers.tokenRequired !== false;
    
    if (tokenRequired) {
      const token = localStorage.getItem('UserToken');
      if (token) {
        config.headers.authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

export default AxiosInstance;
