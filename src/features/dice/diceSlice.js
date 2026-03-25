import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  history: [],
  lastRoll: null,
  sessionId: 'session-' + Math.random().toString(36).substr(2, 9)
};

const diceSlice = createSlice({
  name: 'dice',
  initialState,
  reducers: {
    addRoll: (state, action) => {
      // action.payload: { total, individual, diceConfig, timestamp, sessionId }
      const rollWithSession = { 
        ...action.payload, 
        id: action.payload.id || Date.now(),
        sessionId: state.sessionId 
      };
      state.lastRoll = rollWithSession;
      state.history.unshift(rollWithSession);
      if (state.history.length > 50) {
        state.history.pop();
      }
    },
    clearHistory: (state) => {
      state.history = [];
      state.lastRoll = null;
    },
    clearLastRoll: (state) => {
      state.lastRoll = null;
    },
    updateSessionId: (state) => {
      state.sessionId = 'session-' + Math.random().toString(36).substr(2, 9);
    }
  }
});

export const { addRoll, clearHistory, clearLastRoll, updateSessionId } = diceSlice.actions;
export default diceSlice.reducer;
