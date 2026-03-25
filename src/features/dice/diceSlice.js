import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  history: [],
  lastRoll: null,
  diceConfig: {
    count: 1,
    dieType: 20,
    modifier: 0
  }
};

const diceSlice = createSlice({
  name: 'dice',
  initialState,
  reducers: {
    addRoll: (state, action) => {
      // action.payload: { total, individual, diceConfig, timestamp }
      state.lastRoll = action.payload;
      state.history.unshift(action.payload);
      if (state.history.length > 50) {
        state.history.pop();
      }
    },
    clearHistory: (state) => {
      state.history = [];
      state.lastRoll = null;
    },
    updateDiceConfig: (state, action) => {
      state.diceConfig = { ...state.diceConfig, ...action.payload };
    }
  }
});

export const { addRoll, clearHistory, updateDiceConfig } = diceSlice.actions;
export default diceSlice.reducer;
