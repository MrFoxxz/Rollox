import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notes: [
    { 
      id: 'welcome-note', 
      title: 'Bienvenido a Rollox', 
      content: 'Tus notas de sesión se guardarán aquí. Úsalas para pistas, NPCs o tesoros.', 
      createdAt: new Date().toISOString(), 
      updatedAt: new Date().toISOString() 
    }
  ]
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    addNote: (state, action) => {
      // action.payload: { title, content }
      const newNote = {
        ...action.payload,
        id: 'note-' + Math.random().toString(36).substr(2, 9),
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
