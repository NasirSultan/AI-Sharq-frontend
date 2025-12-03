import api from "../api";

// 1. Add Participant to Agenda
export const addParticipantToAgenda = async (data: {
  userId: number;
  sessionId: number;
  eventId: number;
}) => {
  const res = await api.post("/participants/agenda", data);
  return res.data;
};

// 2. Get Participant Details by User ID
export const getParticipantByUserId = async (participantId: number) => {
  const res = await api.get(`/participants/participants/${participantId}`);
  return res.data;
};

// 3. Get All Participants by Event ID
export const getParticipantsByEvent = async (eventId: number) => {
  const res = await api.get(`/participants/event/${eventId}`);
  return res.data;
};

// 4. Get Participants by Session ID
export const getParticipantsBySession = async (sessionId: number) => {
  const res = await api.get(`/participants/session/${sessionId}`);
  return res.data;
};


export const getRemainingSessions = async (userId: number) => {
  try {
    const res = await api.get(`/participants/all-sessions/${userId}`);
    const data = res.data;

    console.log("API response (getRemainingSessions):", data);

    // If API already returned an array, return it
    if (Array.isArray(data)) return data;

    // If API returned object with arrays
    if (data?.allSessions && Array.isArray(data.allSessions)) return data.allSessions;
    if (data?.liveSessions && Array.isArray(data.liveSessions)) return data.liveSessions;

    // Some APIs nest result under `data`
    if (data?.data) {
      const inner = data.data;
      if (Array.isArray(inner)) return inner;
      if (Array.isArray(inner.allSessions)) return inner.allSessions;
      if (Array.isArray(inner.liveSessions)) return inner.liveSessions;
    }

    // Nothing matched — return empty array as fallback
    return [];
  } catch (error: any) {
    console.error("getRemainingSessions error:", error);

    // Safer default: return empty array so frontend mapping won't crash
    return [];
  }
};