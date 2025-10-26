import api from "../api";

// 1. Create Speaker
export const createSpeaker = async (data: any) => {
  const res = await api.post("/speakers", data);
  return res.data;
};

// 2. Get All Speakers
export const getAllSpeakers = async () => {
  const res = await api.get("/speakers");
  return res.data;
};

// 3. Get Speaker by ID
export const getSpeakerById = async (id: number) => {
  const res = await api.get(`/speakers/${id}`);
  return res.data;
};

// 4. Update Speaker
export const updateSpeaker = async (id: number, data: any) => {
  const res = await api.patch(`/speakers/${id}`, data);
  return res.data;
};

// 5. Delete Speaker
export const deleteSpeaker = async (id: number) => {
  const res = await api.delete(`/speakers/${id}`);
  return res.data;
};
