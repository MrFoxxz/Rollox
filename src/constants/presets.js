/**
 * Default system presets. Defined here (not in the Redux slice) so they can
 * be imported both by the slice AND by the localStorage middleware without
 * creating a circular dependency.
 */
export const DEFAULT_PRESETS = [
  { id: 'attack',     label: 'dice.presets.attack',     dice: 1, type: 20, modifier: 5, category: 'Attack',     iconKey: 'swords' },
  { id: 'damage',     label: 'dice.presets.damage',     dice: 1, type: 12, modifier: 3, category: 'Damage',     iconKey: 'zap' },
  { id: 'skill',      label: 'dice.presets.skill',      dice: 1, type: 20, modifier: 2, category: 'Skill',      iconKey: 'activity' },
  { id: 'save',       label: 'dice.presets.save',       dice: 1, type: 20, modifier: 4, category: 'Save',       iconKey: 'shield' },
  { id: 'initiative', label: 'dice.presets.initiative', dice: 1, type: 20, modifier: 1, category: 'Initiative', iconKey: 'footprints' },
];

/** Fusiona datos guardados con la plantilla (iconos, claves i18n, nuevos ids). */
export function mergeSavedDefaultPresets(saved) {
  if (!Array.isArray(saved) || saved.length === 0) return DEFAULT_PRESETS;
  return DEFAULT_PRESETS.map((def) => {
    const s = saved.find((p) => p.id === def.id);
    if (!s) return { ...def };
    return {
      ...def,
      dice: Number.isFinite(s.dice) ? s.dice : def.dice,
      type: Number.isFinite(s.type) ? s.type : def.type,
      modifier: Number.isFinite(s.modifier) ? s.modifier : def.modifier,
    };
  });
}
