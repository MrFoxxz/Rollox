import { DEFAULT_PRESETS } from '../constants/presets';

// Only persist user-generated data. Never persist defaultPresets (they're hardcoded in the slice).
const STORAGE_KEY = 'rollox_state';

export const saveToLocalStorage = (state) => {
  try {
    const serializedState = JSON.stringify({
      // Only custom user presets – NOT defaultPresets (those come from the slice initialState)
      customPresets: state.presets.customPresets || [],
      notes: state.notes.notes || [],
      settings: state.settings,
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
        defaultPresets: DEFAULT_PRESETS,      // always inject hardcoded defaults
        customPresets: saved.customPresets || [],
      },
      notes: {
        notes: saved.notes || [],
      },
      settings: saved.settings || {},
    };
  } catch (e) {
    console.warn('Could not load state from localStorage', e);
    return undefined;
  }
};
