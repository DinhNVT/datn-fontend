import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // địa chỉ của server nodejs
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;