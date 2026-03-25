/**
 * Default system presets. Defined here (not in the Redux slice) so they can
 * be imported both by the slice AND by the localStorage middleware without
 * creating a circular dependency.
 */
export const DEFAULT_PRESETS = [
  { id: 'attack',     label: 'dice.presets.attack',     dice: 1, type: 20, modifier: 5, category: 'Attack'     },
  { id: 'damage',     label: 'dice.presets.damage',     dice: 1, type: 12, modifier: 3, category: 'Damage'     },
  { id: 'skill',      label: 'dice.presets.skill',      dice: 1, type: 20, modifier: 2, category: 'Skill'      },
  { id: 'save',       label: 'dice.presets.save',       dice: 1, type: 20, modifier: 4, category: 'Save'       },
  { id: 'initiative', label: 'dice.presets.initiative', dice: 1, type: 20, modifier: 1, category: 'Initiative' },
];
