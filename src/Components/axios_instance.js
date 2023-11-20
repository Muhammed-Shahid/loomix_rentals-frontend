import axios from 'axios';

// Create a custom Axios instance with a base URL
const token=localStorage.getItem('access_token')
const instance = axios.create({
  baseURL: 'https://loomix.in', 
  
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: `Bearer ${token}`,

  },
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if the error is a permission error
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Handle the permission error here
      console.error('Permission error:', error.response.data);
      // You may redirect to a login page or display a modal
      // or dispatch an action to update the state, etc.
    }

    // If it's not a permission error, pass the error along
    return Promise.reject(error);
  }
);
export default instance;




