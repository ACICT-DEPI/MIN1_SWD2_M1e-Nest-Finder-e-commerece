import axios from "axios";
const instance = axios.create({
  //baseURL: 'http://localhost:8000/api',
  baseURL: 'https://depi-final-project-backend-production.up.railway.app/api',
});
export default instance;
