import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tracker: {
    id: null,
    sessionId: null,
    isActive: false,
    round: 1,
    currentTurnIndex: 0,
    startedAt: null,
    updatedAt: null,
  },
  combatants: [], // Array of combatant objects: { id, name, type, participantId, roleOwner, initiative, isHidden, isActive, notes, actions: { current, max } }
  viewMode: 'gm', // 'gm' or 'player'
};

const initiativeSlice = createSlice({
  name: 'initiative',
  initialState,
  reducers: {
    startInitiative: (state, action) => {
      const { sessionId } = action.payload;
      state.tracker = {
        ...initialState.tracker,
        id: `init-${Date.now()}`,
        sessionId,
        isActive: true,
        startedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.combatants = [];
    },
    endInitiative: (state) => {
      state.tracker.isActive = false;
    },
    addCombatant: (state, action) => {
      const combatant = {
        ...action.payload,
        id: `combatant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        actions: action.payload.actions || { current: 3, max: 3 },
        isActive: false,
      };
      state.combatants.push(combatant);
      // Sort immediately by initiative descending
      state.combatants.sort((a, b) => b.initiative - a.initiative);
      state.tracker.updatedAt = new Date().toISOString();
    },
    removeCombatant: (state, action) => {
      state.combatants = state.combatants.filter(c => c.id !== action.payload);
      state.tracker.updatedAt = new Date().toISOString();
    },
    updateCombatant: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.combatants.findIndex(c => c.id === id);
      if (index !== -1) {
        state.combatants[index] = { ...state.combatants[index], ...updates };
        if (updates.initiative !== undefined) {
          state.combatants.sort((a, b) => b.initiative - a.initiative);
        }
      }
      state.tracker.updatedAt = new Date().toISOString();
    },
    nextTurn: (state, action) => {
      if (!state.tracker.isActive || state.combatants.length === 0) return;

      const { defaultActions } = action.payload || { defaultActions: 3 };
      
      // Update turn index
      let nextIndex = state.tracker.currentTurnIndex + 1;
      
      if (nextIndex >= state.combatants.length) {
        nextIndex = 0;
        state.tracker.round += 1;
      }
      
      state.tracker.currentTurnIndex = nextIndex;
      
      // Reset actions for the new active combatant
      const activeCombatant = state.combatants[nextIndex];
      if (activeCombatant) {
        activeCombatant.actions = {
          ...activeCombatant.actions,
          current: activeCombatant.actions.max || defaultActions
        };
      }
      
      state.tracker.updatedAt = new Date().toISOString();
    },
    consumeAction: (state, action) => {
       const { id, amount = 1 } = action.payload;
       const combatant = state.combatants.find(c => c.id === id);
       if (combatant && combatant.actions) {
         combatant.actions.current = Math.max(0, combatant.actions.current - amount);
       }
    },
    resetActions: (state, action) => {
       const { id, amount } = action.payload;
       const combatant = state.combatants.find(c => c.id === id);
       if (combatant && combatant.actions) {
         combatant.actions.current = amount ?? combatant.actions.max;
       }
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload; // 'gm' or 'player'
    },
    setCombatantVisibility: (state, action) => {
      const { id, isHidden } = action.payload;
      const combatant = state.combatants.find(c => c.id === id);
      if (combatant) {
        combatant.isHidden = isHidden;
      }
    }
  },
});

export const {
  startInitiative,
  endInitiative,
  addCombatant,
  removeCombatant,
  updateCombatant,
  nextTurn,
  consumeAction,
  resetActions,
  setViewMode,
  setCombatantVisibility,
} = initiativeSlice.actions;

export default initiativeSlice.reducer;
