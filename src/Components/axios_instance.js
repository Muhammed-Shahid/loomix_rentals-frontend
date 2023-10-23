import axios from 'axios';

// Create a custom Axios instance with a base URL
const token=localStorage.getItem('access_token')
const instance = axios.create({
  baseURL: 'http://localhost:8000', 
  
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: `Bearer ${token}`,

  },
});

export default instance;




