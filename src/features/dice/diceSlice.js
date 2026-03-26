import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentDice: [], // Current selected dice to roll
  modifier: 0,
  isRolling: false
};

const diceSlice = createSlice({
  name: 'dice',
  initialState,
  reducers: {
    addDie: (state, action) => {
      state.currentDice.push(action.payload);
    },
    removeDie: (state, action) => {
      const index = state.currentDice.indexOf(action.payload);
      if (index > -1) {
        state.currentDice.splice(index, 1);
      }
    },
    setModifier: (state, action) => {
      state.modifier = action.payload;
    },
    resetRoller: (state) => {
      state.currentDice = [];
      state.modifier = 0;
    },
    setIsRolling: (state, action) => {
      state.isRolling = action.payload;
    }
  }
});

export const { addDie, removeDie, setModifier, resetRoller, setIsRolling } = diceSlice.actions;
export default diceSlice.reducer;
