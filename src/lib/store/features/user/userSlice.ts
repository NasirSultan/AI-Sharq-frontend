import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { setCookie, getCookie, deleteCookie } from "cookies-next"

interface UserState {
  userId: number | null
}

const initialState: UserState = {
  userId: getCookie("userId") ? Number(getCookie("userId")) : null,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<number>) => {
      state.userId = action.payload
      setCookie("userId", String(action.payload), { maxAge: 60 * 60 * 24 * 7 }) 
      // cookie expires in 7 days
    },
    clearUserId: (state) => {
      state.userId = null
      deleteCookie("userId")
    },
  },
})

export const { setUserId, clearUserId } = userSlice.actions
export default userSlice.reducer
