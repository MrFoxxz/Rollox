import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notes: [] // Moved default note to a helper or dynamic initialization if needed
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    addNote: (state, action) => {
      // action.payload: { title, content, sessionId, authorId, authorName, visibility, tags }
      const newNote = {
        id: 'note-' + Math.random().toString(36).substr(2, 9),
        title: '',
        content: '',
        sessionId: null, // Global if null, or link to session
        authorId: 'local-user',
        authorName: 'Local User',
        visibility: 'shared', // 'shared' | 'gm-private' | 'player-private'
        tags: [],
        ...action.payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.notes.unshift(newNote);
    },
    editNote: (state, action) => {
      // action.payload: { id, title, content }
      const index = state.notes.findIndex(n => n.id === action.payload.id);
      if (index !== -1) {
        state.notes[index] = {
          ...state.notes[index],
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    deleteNote: (state, action) => {
      state.notes = state.notes.filter(n => n.id !== action.payload);
    }
  }
});

export const { addNote, editNote, deleteNote } = notesSlice.actions;
export default notesSlice.reducer;
