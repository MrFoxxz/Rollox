import { createSlice } from '@reduxjs/toolkit';
import { DEFAULT_PRESETS } from '../../constants/presets';

const initialState = {
  defaultPresets: DEFAULT_PRESETS,
  customPresets: [],
};

const presetsSlice = createSlice({
  name: 'presets',
  initialState,
  reducers: {
    addCustomPreset: (state, action) => {
      const newPreset = {
        ...action.payload,
        id: 'custom-' + Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.customPresets.push(newPreset);
    },
    updateCustomPreset: (state, action) => {
      const index = state.customPresets.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.customPresets[index] = {
          ...state.customPresets[index],
          ...action.payload.updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    removeCustomPreset: (state, action) => {
      state.customPresets = state.customPresets.filter(p => p.id !== action.payload);
    },
  },
});

export const { addCustomPreset, updateCustomPreset, removeCustomPreset } = presetsSlice.actions;
export default presetsSlice.reducer;
