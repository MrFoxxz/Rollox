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
    updateSystemPreset: (state, action) => {
      const { id, updates } = action.payload;
      const idx = state.defaultPresets.findIndex((p) => p.id === id);
      if (idx === -1) return;
      const cur = state.defaultPresets[idx];
      state.defaultPresets[idx] = {
        ...cur,
        dice: updates.dice ?? cur.dice,
        type: updates.type ?? cur.type,
        modifier: updates.modifier ?? cur.modifier,
      };
    },
  },
});

export const { addCustomPreset, updateCustomPreset, removeCustomPreset, updateSystemPreset } = presetsSlice.actions;
export default presetsSlice.reducer;
