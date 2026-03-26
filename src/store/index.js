import { configureStore } from '@reduxjs/toolkit';
import diceReducer from '../features/dice/diceSlice'
import presetsReducer from '../features/presets/presetsSlice'
import notesReducer from '../features/notes/notesSlice'
import settingsReducer from '../features/settings/settingsSlice'
import languageReducer from '../features/language/languageSlice'
import sessionReducer from '../features/session/sessionSlice'
import notificationsReducer from '../features/notifications/notificationsSlice'
import gameConfigReducer from '../features/gameConfig/gameConfigSlice'
import historyReducer from '../features/history/historySlice'
import initiativeReducer from '../features/initiative/initiativeSlice'
import { loadFromLocalStorage, saveToLocalStorage } from './localStorageMiddleware'
import i18n from '../i18n'

const preloadedState = loadFromLocalStorage()

const lang = preloadedState?.language?.current ?? 'es'
void i18n.changeLanguage(lang)

export const store = configureStore({
  reducer: {
    dice: diceReducer,
    presets: presetsReducer,
    notes: notesReducer,
    settings: settingsReducer,
    language: languageReducer,
    session: sessionReducer,
    notifications: notificationsReducer,
    gameConfig: gameConfigReducer,
    history: historyReducer,
    initiative: initiativeReducer,
  },
  preloadedState
})

store.subscribe(() => {
  saveToLocalStorage(store.getState())
})
