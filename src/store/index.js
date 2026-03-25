import { configureStore } from '@reduxjs/toolkit';
import diceReducer from '../features/dice/diceSlice'
import presetsReducer from '../features/presets/presetsSlice'
import notesReducer from '../features/notes/notesSlice'
import settingsReducer from '../features/settings/settingsSlice'
import { loadFromLocalStorage, saveToLocalStorage } from './localStorageMiddleware'

const preloadedState = loadFromLocalStorage()

export const store = configureStore({
  reducer: {
    dice: diceReducer,
    presets: presetsReducer,
    notes: notesReducer,
    settings: settingsReducer
  },
  preloadedState
})

store.subscribe(() => {
  saveToLocalStorage(store.getState())
})
