import { createSlice } from "@reduxjs/toolkit";

export interface UserState {
  loginType?: "injected" | "torus" | "walletConnect" | "walletLink";
  openLoginModal: boolean;
  ethAlias?: string | null;
  ethAvatar?: string | null;
}

const userSlice = createSlice({
  name: "auth",
  initialState: {
    openLoginModal: false,
    loginType: "injected",
    ethAlias: undefined,
    ethAvatar: undefined
  } as UserState,
  reducers: {
    setLoginType(state, action) {
      state.loginType = action.payload;
    },
    setOpenLoginModal(state, action) {
      state.openLoginModal = action.payload;
    },
    setEthAlias(state, action) {
      state.ethAlias = action.payload;
    },
    setEthAvatar(state, action) {
      state.ethAvatar = action.payload;
    }
  }
});

export const { setLoginType, setOpenLoginModal, setEthAlias, setEthAvatar } = userSlice.actions;

export const userReducer = userSlice.reducer;
