import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentSession: null, 
  sessions: [], // Track all sessions created
  participants: [], 
  activeParticipantId: null,
  availableGameSystems: [
    { id: 'pathfinder', label: 'Pathfinder' },
    { id: 'dnd', label: 'D&D 5e' }
  ],
  sessionSettings: {
    showActivityFeed: true,
    showFloatingNotifications: true,
    allowRoleChanges: true,
    maxHistoryItems: 50
  }
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    createSession: (state, action) => {
      const { name, gameSystem, maxParticipants, adminName } = action.payload;
      const sessionId = 'session-' + Date.now();
      const adminId = 'user-' + Date.now();
      
      const newSession = {
        id: sessionId,
        name,
        gameSystem,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: adminId,
        adminId: adminId,
        maxParticipants
      };
      
      state.currentSession = newSession;
      state.sessions.push(newSession);
      
      const adminParticipant = {
        id: adminId,
        name: adminName,
        role: 'admin'
      };
      
      state.participants = [adminParticipant];
      state.activeParticipantId = adminId;
    },
    addParticipant: (state, action) => {
      // action.payload: { name, role }
      const newParticipant = {
        id: 'user-' + Date.now() + Math.random().toString(36).substr(2, 5),
        name: action.payload.name,
        role: action.payload.role || 'player'
      };
      state.participants.push(newParticipant);
    },
    updateParticipantRole: (state, action) => {
      const { id, role } = action.payload;
      const participant = state.participants.find(p => p.id === id);
      if (participant) {
        participant.role = role;
      }
    },
    setActiveParticipant: (state, action) => {
      state.activeParticipantId = action.payload;
    },
    endSession: (state) => {
      // We keep the session in state.sessions, but clear the active one
      state.currentSession = null;
      state.participants = [];
      state.activeParticipantId = null;
    },
    updateSessionSettings: (state, action) => {
      state.sessionSettings = { ...state.sessionSettings, ...action.payload };
    },
    updateSession: (state, action) => {
      if (state.currentSession) {
        state.currentSession = { ...state.currentSession, ...action.payload, updatedAt: new Date().toISOString() };
      }
    }
  }
});

export const { 
  createSession, 
  addParticipant, 
  updateParticipantRole, 
  setActiveParticipant, 
  endSession,
  updateSessionSettings,
  updateSession
} = sessionSlice.actions;

export default sessionSlice.reducer;
