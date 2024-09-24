import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/User";
import axios from "axios";
import toast from "react-hot-toast";
import { AppThunk, RootState } from "../../store/store";
import api from "../../api/CustomAxios";

interface initialStatePrps {
  status: "idle" | "loading" | "failed";
  users: User[];
  error: string | null;
  searchedUserName: string;
  totalCount: number | null;
  onlineUsers: String[]; //TODO
}

const initialState: initialStatePrps = {
  status: "idle",
  users: [],
  error: "",
  searchedUserName: "",
  totalCount: null,
  onlineUsers: [],
};
export const fetchUsers = createAsyncThunk<{ users: User[]; totalCount: number }, void>(
  "user/fetchUsers",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const response = await api.get("/user/all-users", {
        params: {
          name: state.user.searchedUserName,
        },
      });
      return { users: response.data.data, totalCount: response.data.data.totalCount };
    } catch (error: any) {
      throw error?.response?.data?.message;
    }
  },
);

export const fetchUserData = createAsyncThunk<User, void>("user/fetchUserData", async () => {
  const url = `${import.meta.env.VITE_BASE_URL}/api/user/current-user-details`;

  try {
    const response = await axios({
      url: url,
      method: "GET",
      withCredentials: true, // Ensure cookies are included
    });

    return response.data;
  } catch (error: any) {
    throw error?.response?.data?.message;
  }
});

export const updateUserData = createAsyncThunk<User, User>("user/updateUserData", async (updatedUser: User) => {
  const url = `${import.meta.env.VITE_BASE_URL}/user/update`;

  try {
    const response = await axios.put(url, updatedUser);
    toast.success(response?.data?.message);
    return response.data.data;
  } catch (error: any) {
    throw error?.response?.data?.message;
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSearchUser(state, action: PayloadAction<string>) {
      state.searchedUserName = action.payload;
    },
    setOnlineUsers(state, action) {
      state.onlineUsers = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserData.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchUserData.fulfilled, (state) => {
      state.status = "idle";
    });
    builder.addCase(fetchUserData.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message as string;
      toast.error(state.error);
    });
    builder.addCase(updateUserData.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(updateUserData.fulfilled, (state) => {
      state.status = "idle";
    });
    builder.addCase(updateUserData.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message as string;
      toast.error(state.error);
    });
    builder.addCase(fetchUsers.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.status = "idle";
      state.users = action.payload.users;
      state.totalCount = action.payload.totalCount;
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message as string;
      toast.error(state.error);
    });
  },
});

export const setSearchUser =
  (userName: string): AppThunk =>
  (dispatch, _getState) => {
    dispatch(userSlice.actions.setSearchUser(userName));
    dispatch(fetchUsers());
  };

export const { setOnlineUsers } = userSlice.actions;

export const selectStatus = (state: RootState) => state.user.status;

export const selectUsers = (state: RootState) => state.user.users;
export const selectOnlineUsers = (state: RootState) => state.user.onlineUsers;

export const selectTotalCount = (state: RootState) => state.user.totalCount;

export const selectError = (state: RootState) => state.auth.error;

export default userSlice.reducer;
