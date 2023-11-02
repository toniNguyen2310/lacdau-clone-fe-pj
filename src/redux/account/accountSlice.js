import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  user: {
    id: "",
    email: "",
    username: "",
    phone: "",
    isAdmin: false,
    address: "",
    birthday: "",
  },
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    doLoginAction: (state, action) => {
      state.isAuthenticated = true;
      state.isLoading = false;
      state.user = action.payload;
    },

    doGetAccountPending: (state, action) => {
      state.isLoading = true;
    },

    doGetAccountError: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
    },

    doGetAccountAction: (state, action) => {
      state.isAuthenticated = true;
      state.isLoading = false;
      state.user = action.payload.user;
    },

    doLogoutAction: (state, action) => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      state.isAuthenticated = false;
      state.isLoading = false;
      state.user = {
        id: "",
        email: "",
        username: "",
        phone: "",
        isAdmin: false,
      };
    },

    doEditAccount: (state, action) => {
      state.isLoading = false;
      state.user.username = action.payload.username;
      state.user.phone = action.payload.phone;
      state.user.address = action.payload.address;
      state.user.birthday = action.payload.birthday;
    },

    //NEW
  },

  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {},
});

export const {
  doLoginAction,
  doGetAccountAction,
  doLogoutAction,
  doGetAccountPending,
  doGetAccountError,
  doEditAccount,
} = accountSlice.actions;

export default accountSlice.reducer;
