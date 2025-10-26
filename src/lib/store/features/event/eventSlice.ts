import { createSlice, PayloadAction } from "@reduxjs/toolkit"

// Load initial state from localStorage if available
const storedEventId = typeof window !== "undefined" ? localStorage.getItem("eventId") : null

interface EventState {
  id: number | null
}

const initialState: EventState = {
  id: storedEventId ? Number(storedEventId) : null,
}

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    setEventId: (state, action: PayloadAction<number>) => {
      state.id = action.payload
      // Save to localStorage whenever it changes
      if (typeof window !== "undefined") {
        localStorage.setItem("eventId", action.payload.toString())
      }
    },
  },
})

export const { setEventId } = eventSlice.actions
export default eventSlice.reducer
