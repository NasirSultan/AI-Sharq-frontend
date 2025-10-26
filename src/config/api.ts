// src/config/api.ts
import axios from "axios"

const api = axios.create({
  baseURL: "http://138.68.104.206:3000", // your backend
  withCredentials: true,            // send cookies if needed
  headers: {
    "Content-Type": "application/json",
  },
})

export default api
