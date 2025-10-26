import axios from "axios";

const api = axios.create({
  // baseURL: "https://psychic-goldfish-p7prgwg6j5fxgx-3000.app.github.dev",
  baseURL:  "http://138.68.104.206:3000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;