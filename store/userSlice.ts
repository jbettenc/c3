import { createSlice } from "@reduxjs/toolkit";

export interface UserState {
  loginType?: "metaMask" | "walletConnect" | "coinbaseWallet";
  openLoginModal: boolean;
}

const userSlice = createSlice({
  name: "auth",
  initialState: {
    openLoginModal: false,
    loginType: "metaMask",
    ethAlias: undefined,
    ethAvatar: undefined
  } as UserState,
  reducers: {
    setLoginType(state, action) {
      state.loginType = action.payload;
    },
    setOpenLoginModal(state, action) {
      state.openLoginModal = action.payload;
    }
  }
});

export const { setLoginType, setOpenLoginModal } = userSlice.actions;

export const userReducer = userSlice.reducer;
