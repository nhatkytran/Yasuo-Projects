import axios from 'axios';
import { BACKEND_URL, FETCH_API_TIMEOUT } from '../config';

const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
  timeout: FETCH_API_TIMEOUT * 1000,
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
