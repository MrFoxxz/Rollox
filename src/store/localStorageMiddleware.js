import { mergeSavedDefaultPresets } from '../constants/presets';

// Only persist user-generated data. Never persist defaultPresets (they're hardcoded in the slice).
const STORAGE_KEY = 'rollox_state';

export const saveToLocalStorage = (state) => {
  try {
    const serializedState = JSON.stringify({
      customPresets: state.presets.customPresets || [],
      defaultPresets: state.presets.defaultPresets || [],
      notes: state.notes.notes || [],
      settings: state.settings,
      language: state.language,
    });
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (e) {
    console.warn('Could not save state to localStorage', e);
  }
};

export const loadFromLocalStorage = () => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return undefined;
    const saved = JSON.parse(serialized);

    // Build a partial preloaded state that MERGES with each slice's own initialState.
    // We only override the keys we actually persisted.
    return {
      presets: {
        defaultPresets: mergeSavedDefaultPresets(saved.defaultPresets),
        customPresets: saved.customPresets || [],
      },
      notes: {
        notes: saved.notes || [],
      },
      settings: saved.settings || {},
      language: saved.language || { current: 'es' },
    };
  } catch (e) {
    console.warn('Could not load state from localStorage', e);
    return undefined;
  }
};
