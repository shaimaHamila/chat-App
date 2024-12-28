import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Conversation } from "../../types/Conversation";
import { RootState } from "../../store/store";
import { Message } from "../../types/Message";
interface initialStatePrps {
  status: "idle" | "loading" | "failed";
  conversations: Conversation[]; // Added proper typing for conversations
  currentConversation: Conversation | null;
  error: string | null;
}

const initialState: initialStatePrps = {
  status: "idle",
  conversations: [],
  currentConversation: null,
  error: null,
};

export const addMessage = createAsyncThunk<Conversation, { id: string; newMessage: Message }>(
  "conversation/addMessage",
  async ({ id, newMessage }) => {
    const url = `${import.meta.env.VITE_BASE_URL}/conversation/${id.toString()}`;

    try {
      const response = await axios({
        url: url,
        method: "PUT",
        data: newMessage,
        withCredentials: true, // Ensure cookies are included
      });
      return response.data.data;
    } catch (error: any) {
      throw error.response.data || "Failed to update conversation";
    }
  },
);

export const fetchUserConversations = createAsyncThunk("conversation/fetchUserConversations", async () => {
  const url = `${import.meta.env.VITE_BASE_URL}/conversation`;

  try {
    const response = await axios({
      url: url,
      method: "GET",
      withCredentials: true, // Ensure cookies are included
    });

    return response.data.data;
  } catch (error: any) {
    throw error.response.data || "Failed to fetch conversations";
  }
});

export const createConversation = createAsyncThunk("conversation/createConversation", async (receiver: string) => {
  try {
    const response = await axios.post("/api/conversation", { receiver });
    return response.data.data;
  } catch (error: any) {
    throw error.response.data || "Failed to create conversation";
  }
});

export const fetchConversationById = createAsyncThunk("conversation/fetchConversationById", async (id: string) => {
  try {
    const response = await axios.get(`/api/conversation/${id}`);
    return response.data.data;
  } catch (error: any) {
    throw error.response.data || "Failed to fetch conversation";
  }
});

export const getConversationByUserId = createAsyncThunk("conversation/getConversationByUserId", async (id: string) => {
  const url = `${import.meta.env.VITE_BASE_URL}/conversation/user/${id}`;
  try {
    const response = await axios({
      url: url,
      method: "GET",
      withCredentials: true, // Ensure cookies are included
    });
    return response.data.data;
  } catch (error: any) {
    throw error.response.data || "Failed to get conversation by user ID";
  }
});

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    resetError(state) {
      state.error = null;
    },
    setConversationsFromSocket(state, action: PayloadAction<Conversation[]>) {
      state.conversations = action.payload;
    },
    updateConversationFromSocket: (state, action: PayloadAction<Conversation>) => {
      // Find and update the conversation in the state based on the _id
      const index = state.conversations.findIndex((conversation) => conversation._id === action.payload._id);

      if (index !== -1) {
        state.conversations[index] = action.payload;
      } else {
        state.conversations.push(action.payload);
      }
    },
    updateCurrentConversationWithNewMessageFromSocket: (state, action: PayloadAction<Message>) => {
      if (state.currentConversation) {
        // Ensure messages is an array
        if (!state.currentConversation.messages) {
          state.currentConversation.messages = [];
        }

        // Check if the message is already in the array by comparing unique properties (e.g., message ID)
        const messageExists = state.currentConversation.messages.some((msg) => msg._id === action.payload._id);

        // Only push the new message if it does not exist in the messages array
        if (!messageExists) {
          state.currentConversation.messages.push(action.payload);
        }
      }
    },
    setCurrentConversationToNull(state) {
      state.currentConversation = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserConversations.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserConversations.fulfilled, (state, action) => {
        state.conversations = action.payload;
        state.status = "idle";
      })
      .addCase(fetchUserConversations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch conversations";
      })
      .addCase(createConversation.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        state.conversations.push(action.payload);
        state.status = "idle";
      })
      .addCase(createConversation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to create conversation";
      })

      // Fetch Conversation by ID

      .addCase(fetchConversationById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchConversationById.fulfilled, (state, action) => {
        state.currentConversation = action.payload;
        state.status = "idle";
      })
      .addCase(fetchConversationById.rejected, (state, action) => {
        state.status = "failed";
        state.currentConversation = null;
        state.error = action.error.message || "Failed to fetch conversation";
      })
      // Get Conversation by User ID

      .addCase(getConversationByUserId.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getConversationByUserId.fulfilled, (state, action) => {
        state.currentConversation = action.payload;
        state.status = "idle";
      })
      .addCase(getConversationByUserId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to get conversation by user ID";
      })

      .addCase(addMessage.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addMessage.fulfilled, (state, action) => {
        state.status = "idle";
      })
      .addCase(addMessage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to get conversation by user ID";
      });
  },
});

export const {
  setCurrentConversationToNull,
  updateConversationFromSocket,
  setConversationsFromSocket,
  updateCurrentConversationWithNewMessageFromSocket,
} = conversationSlice.actions;
export const selectConversations = (state: RootState) => state.conversation.conversations;
export const selectCurrentConversation = (state: RootState) => state.conversation.currentConversation;
export const selectStatus = (state: RootState) => state.conversation.status;
export default conversationSlice.reducer;
