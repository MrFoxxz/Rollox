/**
 * Determina si un resultado de d20 es crítico (20) o pifia (1).
 * @param {number} val - El valor natural del dado.
 * @param {number} type - El tipo de dado (e.g. 20).
 * @returns {string|null} - 'critical', 'fumble' o null.
 */
export const getD20Status = (val, type) => {
  if (type !== 20) return null;
  if (val === 20) return 'critical';
  if (val === 1) return 'fumble';
  return null;
};

/**
 * Devuelve las clases CSS según el estado del d20.
 * @param {string} status - 'critical', 'fumble' o null.
 * @returns {string} - Clases de Tailwind.
 */
export const getD20Classes = (status) => {
  if (status === 'critical') return 'text-emerald-500 border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.2)]';
  if (status === 'fumble') return 'text-rose-500 border-rose-500/50 bg-rose-500/10 shadow-[0_0_15px_rgba(244,63,94,0.2)]';
  return 'text-slate-400 border-slate-800 bg-slate-900';
};
