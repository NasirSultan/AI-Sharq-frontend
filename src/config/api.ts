// src/config/api.ts
import axios from "axios"

const api = axios.create({
  
    baseURL: "https://apiconnect.sharqforum.org",
  // baseURL: "http://138.68.104.206:3000", 
    // baseURL: "http://localhost:5000",// your backend
  withCredentials: true,            // send cookies if needed
  headers: {
    "Content-Type": "application/json",
  },
})

export default api
