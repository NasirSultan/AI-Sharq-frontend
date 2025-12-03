import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { setCookie, getCookie, deleteCookie } from "cookies-next"

interface SpeakerState {
  speakerId: number | null
}

const initialState: SpeakerState = {
  speakerId: getCookie("speakerId") ? Number(getCookie("speakerId")) : null,
}

const speakerSlice = createSlice({
  name: "speaker",
  initialState,
  reducers: {
    setSpeakerId: (state, action: PayloadAction<number>) => {
      state.speakerId = action.payload
      setCookie("speakerId", String(action.payload), { maxAge: 60 * 60 * 24 * 7 })
    },
    clearSpeakerId: (state) => {
      state.speakerId = null
      deleteCookie("speakerId")
    },
  },
})

export const { setSpeakerId, clearSpeakerId } = speakerSlice.actions
export default speakerSlice.reducer
