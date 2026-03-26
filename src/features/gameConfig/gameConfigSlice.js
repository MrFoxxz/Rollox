import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  configs: {
    pathfinder: {
      id: 'pathfinder',
      label: 'Pathfinder 2e',
      dice: [4, 6, 8, 10, 12, 20, 100],
      turnSystem: {
        enabled: true,
        type: 'actions',
        defaultActionsPerTurn: 3,
      },
      enableCriticalHighlighting: true,
      useNatural20Rules: true,
      useNatural1Rules: true,
      defaultPresets: [
        { name: 'Ataque Espada Longa', dice: '1d20+5' },
        { name: 'Dano Espada Longa', dice: '1d8+3' }
      ]
    },
    dnd: {
      id: 'dnd',
      label: 'D&D 5e',
      dice: [4, 6, 8, 10, 12, 20, 100],
      turnSystem: {
        enabled: true,
        type: 'standard',
        defaultActionsPerTurn: 1,
      },
      enableCriticalHighlighting: true,
      useNatural20Rules: true,
      useNatural1Rules: true,
      defaultPresets: [
        { name: 'Longsword Attack', dice: '1d20+5' },
        { name: 'Longsword Damage', dice: '1d8+3' }
      ]
    }
  },
  activeSystemId: 'pathfinder'
};

const gameConfigSlice = createSlice({
  name: 'gameConfig',
  initialState,
  reducers: {
    setActiveSystem: (state, action) => {
      state.activeSystemId = action.payload;
    },
    updateSystemConfig: (state, action) => {
      const { systemId, config } = action.payload;
      if (state.configs[systemId]) {
        state.configs[systemId] = { ...state.configs[systemId], ...config };
      }
    }
  }
});

export const { setActiveSystem, updateSystemConfig } = gameConfigSlice.actions;

export default gameConfigSlice.reducer;
