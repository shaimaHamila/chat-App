import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User } from "../../types/User";
import axios from "axios";
import toast from "react-hot-toast";
import { RootState } from "../../store/store";

interface initialStatePrps {
  status: "idle" | "loading" | "succeeded" | "failed";
  currentUser: User | null;
  error: string | null;
}

const initialState: initialStatePrps = {
  status: "idle",
  currentUser: null,
  error: "",
};

export const signup = createAsyncThunk<User, User>("auth/signup", async (newUser: User) => {
  const url = `${import.meta.env.VITE_BASE_URL}/auth/register`;
  try {
    const response = await axios.post(url, newUser);
    toast.success(response?.data?.data?.message);
    return response.data.data;
  } catch (error: any) {
    toast.error(error?.response?.data?.message);
    return error?.response?.data?.message;
  }
});

export const login = createAsyncThunk<User, User>("auth/login", async ({ email, password }) => {
  const url = `${import.meta.env.VITE_BASE_URL}/auth/login`;
  try {
    const response = await axios({
      url: url,
      method: "POST",
      data: { email, password },
      withCredentials: true, // Ensure cookies are included
    });
    toast.success(response?.data?.message);
    localStorage.setItem("user", response?.data?.data?.name);
    localStorage.setItem("token", response?.data?.token);
    console.log("response.data: ", response?.data);
    return response.data.data;
  } catch (error: any) {
    toast.error(error?.response?.data?.message);
    return error?.response?.data?.message;
  }
});

export const logout = createAsyncThunk<void, void>("auth/logout", async () => {
  const url = `${import.meta.env.VITE_BASE_URL}/auth/logout`;
  try {
    const response = await axios({
      url: url,
      method: "GET",
      withCredentials: true, // Ensure cookies are included
    });
    toast.success(response?.data?.message);
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    return response.data;
  } catch (error: any) {
    toast.error(error?.response?.data?.message);
    return error?.response?.data?.message;
  }
});

export const fetchCurrentUser = createAsyncThunk<User, void>("auth/fetchCurrentUser", async () => {
  const url = `${import.meta.env.VITE_BASE_URL}/user/current-user-details`;

  try {
    const response = await axios({
      url: url,
      method: "GET",
      withCredentials: true, // Ensure cookies are included
    });
    return response.data.data;
  } catch (error: any) {
    toast.error(error?.response?.data?.message);
    console.log("Current User Details fron store: ", error?.response?.data?.message);

    return error?.response?.data?.message;
  }
});
export const updateCurrentUser = createAsyncThunk<User, User>("auth/updateCurrentUser", async (updatedUser: User) => {
  const url = `${import.meta.env.VITE_BASE_URL}/user/update`;

  try {
    // const response = await axios.put(url, updatedUser);
    const response = await axios.post(url, updatedUser, {
      withCredentials: true,
    });
    toast.success(response?.data?.message);
    console.log("Updated User: ", response.data);
    return response.data.data;
  } catch (error: any) {
    toast.error(error?.message);
    console.log("error fron store1: ", error?.response?.data?.message);
    console.log("error fron store2: ", error);

    return error?.response?.data?.message;
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCurrentUser.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.currentUser = action.payload;
    });
    builder.addCase(fetchCurrentUser.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message as string;
    });
    builder.addCase(signup.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(signup.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.currentUser = action.payload;
    });
    builder.addCase(signup.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message as string;
    });
    builder.addCase(login.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.currentUser = action.payload;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message as string;
    });
    builder.addCase(updateCurrentUser.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(updateCurrentUser.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.currentUser = action.payload;
    });
    builder.addCase(updateCurrentUser.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message as string;
    });
    builder.addCase(logout.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.status = "succeeded";
      state.currentUser = null;
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message as string;
    });
  },
});
export const selectCurrentUser = (state: RootState) => state.auth.currentUser;

export const selectCurrentUserId = (state: RootState) => state.auth.currentUser?._id;

export const selectStatus = (state: RootState) => state.auth.status;

export const selectError = (state: RootState) => state.auth.error;

export default authSlice.reducer;
