import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { setCookie, getCookie, deleteCookie } from "cookies-next"

interface SponsorState {
  sponsorId: number | null
}

const initialState: SponsorState = {
  sponsorId: getCookie("sponsorId") ? Number(getCookie("sponsorId")) : null,
}

const sponsorSlice = createSlice({
  name: "sponsor",
  initialState,
  reducers: {
    setSponsorId: (state, action: PayloadAction<number>) => {
      state.sponsorId = action.payload
      setCookie("sponsorId", String(action.payload), { maxAge: 60 * 60 * 24 * 7 })
    },
    clearSponsorId: (state) => {
      state.sponsorId = null
      deleteCookie("sponsorId")
    },
  },
})

export const { setSponsorId, clearSponsorId } = sponsorSlice.actions
export default sponsorSlice.reducer
