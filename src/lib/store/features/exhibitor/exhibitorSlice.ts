import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { setCookie, getCookie, deleteCookie } from "cookies-next"

interface ExhibitorState {
  exhibitorId: number | null
}

const initialState: ExhibitorState = {
  exhibitorId: getCookie("exhibitorId") ? Number(getCookie("exhibitorId")) : null,
}

const exhibitorSlice = createSlice({
  name: "exhibitor",
  initialState,
  reducers: {
    setExhibitorId: (state, action: PayloadAction<number>) => {
      state.exhibitorId = action.payload
      setCookie("exhibitorId", String(action.payload), { maxAge: 60 * 60 * 24 * 7 })
    },
    clearExhibitorId: (state) => {
      state.exhibitorId = null
      deleteCookie("exhibitorId")
    },
  },
})

export const { setExhibitorId, clearExhibitorId } = exhibitorSlice.actions
export default exhibitorSlice.reducer
