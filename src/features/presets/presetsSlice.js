import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  presets: [
    { id: 'attack', label: 'presets.attack', dice: 1, type: 20 },
    { id: 'damage', label: 'presets.damage', dice: 1, type: 8 },
    { id: 'skill', label: 'presets.skill', dice: 1, type: 20 },
    { id: 'save', label: 'presets.save', dice: 1, type: 20 },
    { id: 'initiative', label: 'presets.initiative', dice: 1, type: 20 }
  ]
};

const presetsSlice = createSlice({
  name: 'presets',
  initialState,
  reducers: {
    addPreset: (state, action) => {
      state.presets.push(action.payload);
    },
    removePreset: (state, action) => {
      state.presets = state.presets.filter(p => p.id !== action.payload);
    }
  }
});

export const { addPreset, removePreset } = presetsSlice.actions;
export default presetsSlice.reducer;
