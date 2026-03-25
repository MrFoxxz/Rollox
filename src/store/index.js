import { configureStore } from '@reduxjs/toolkit';
import diceReducer from '../features/dice/diceSlice';
import presetsReducer from '../features/presets/presetsSlice';
import languageReducer from '../features/language/languageSlice';

export const store = configureStore({
  reducer: {
    dice: diceReducer,
    presets: presetsReducer,
    language: languageReducer
  }
});
