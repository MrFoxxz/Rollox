import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isFloatingDiceOpen: false,
  preferredDie: 20,
  preferredQuantity: 1,
  preferredModifier: 0,
  showIndividualRollResults: true,
  rememberLastDiceSelection: true,
  compactHistoryMode: false,
  enableCriticalHighlighting: true,
  notesViewMode: 'cards', // 'list' | 'cards'
  hideFloatingDiceOnHome: true,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateSetting: (state, action) => {
      // action.payload: { [key]: value }
      const key = Object.keys(action.payload)[0];
      if (key in state) {
        state[key] = action.payload[key];
      }
    },
    toggleFloatingDice: (state) => {
      state.isFloatingDiceOpen = !state.isFloatingDiceOpen;
    },
    setFloatingDiceOpen: (state, action) => {
      state.isFloatingDiceOpen = action.payload;
    },
    resetSettings: () => initialState,
  }
});

export const { updateSetting, toggleFloatingDice, setFloatingDiceOpen, resetSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
