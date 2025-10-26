import { configureStore } from "@reduxjs/toolkit"
import eventReducer from "./features/event/eventSlice"
import userReducer from "./features/user/userSlice"
import speakerReducer from "./features/speaker/speakerSlice"
import sponsorReducer from "./features/sponsor/sponsorSilice"
import exhibitorReducer from "./features/exhibitor/exhibitorSlice"

export const store = configureStore({
  reducer: {
    event: eventReducer,
    user: userReducer,
    speaker: speakerReducer,
    sponsor: sponsorReducer,
        exhibitor: exhibitorReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
