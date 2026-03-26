import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  history: [], // Array of { id, sessionId, actorId, actorName, actorRole, source, diceType, quantity, modifier, rawResults, total, criticalState, createdAt }
  lastRoll: null
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addHistoryEntry: (state, action) => {
      // action.payload: { sessionId, actorId, actorName, actorRole, source, diceType, quantity, modifier, rawResults, total, criticalState }
      const newEntry = {
        ...action.payload,
        id: 'roll-' + Date.now() + Math.random().toString(36).substr(2, 5),
        createdAt: new Date().toISOString()
      };
      state.lastRoll = newEntry;
      state.history.unshift(newEntry);
      
      // Limit history size to 50 items
      if (state.history.length > 50) {
        state.history.pop();
      }
    },
    clearHistory: (state, action) => {
      if (action.payload) {
        // Clear history for a specific session
        state.history = state.history.filter(h => h.sessionId !== action.payload);
      } else {
        // Clear all history
        state.history = [];
      }
      state.lastRoll = null;
    }
  }
});

export const { addHistoryEntry, clearHistory } = historySlice.actions;

export default historySlice.reducer;
