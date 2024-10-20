import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Conversation {
  sender: string;
  email: string;
  message: string;
  timestamp: string;
  role: string;
}

export interface Query {
  id: string;
  userEmail: string;
  subject: string;
  status: string;
  userRole: string;
  createdAt: string;
  updatedAt: string;
  conversation: Conversation[];
}

interface QueryState {
  queries: Query[];
  selectedQueryId: string | null;  // Add this line
}

const initialState: QueryState = {
  queries: [],
  selectedQueryId: null,  // Add this line
};

const querySlice = createSlice({
  name: "queries",
  initialState,
  reducers: {
    setQueries(state, action: PayloadAction<Query[]>) {
      state.queries = action.payload;
    },
    updateQuery(state, action: PayloadAction<Query>) {
      const index = state.queries.findIndex(query => query.id === action.payload.id);
      if (index !== -1) {
        state.queries[index] = action.payload;
      }
    },
    addConversationMessage(state, action: PayloadAction<{ queryId: string; message: Conversation }>) {
      const { queryId, message } = action.payload;
      const query = state.queries.find(q => q.id === queryId);
      if (query) {
        query.conversation.push(message);
      }
    },
    selectQuery(state, action: PayloadAction<string | null>) {
      state.selectedQueryId = action.payload;
    },
  },
});

export const { setQueries, updateQuery, addConversationMessage, selectQuery } = querySlice.actions;

export default querySlice.reducer;