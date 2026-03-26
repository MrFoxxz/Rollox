import React from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { removeCombatant, setCombatantVisibility } from '../../features/initiative/initiativeSlice';
import ActionCounter from './ActionCounter';
import { Trash2, Eye, EyeOff, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CombatantCard = ({ combatant, isActive, viewMode }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const activeSystemId = useSelector(state => state.gameConfig.activeSystemId);
  const configs = useSelector(state => state.gameConfig.configs);
  const activeSystem = configs[activeSystemId];

  const { id, name, type, initiative, isHidden, notes, actions } = combatant;
  const isPathfinder = activeSystem?.turnSystem?.type === 'actions';

  const typeGradients = {
    'player-character': 'from-blue-500 to-indigo-600',
    'npc': 'from-slate-500 to-slate-700',
    'enemy': 'from-rose-500 to-red-800',
    'summon': 'from-amber-500 to-orange-700',
    'custom': 'from-purple-500 to-pink-700',
  };

  const getRoleBadgeColor = () => {
    switch(combatant.roleOwner) {
       case 'admin': return 'bg-amber-500 text-slate-900';
       case 'gm': return 'bg-purple-500 text-white';
       default: return 'bg-slate-700 text-slate-300';
    }
  };

  const isHiddenForPlayer = isHidden && viewMode === 'player';
  if (isHiddenForPlayer) return null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`relative p-[1px] rounded-[24px] transition-all duration-500 group overflow-hidden ${
        isActive 
          ? 'bg-gradient-to-r from-amber-500 via-orange-400 to-amber-500 animate-gradient-x shadow-2xl shadow-amber-500/20 scale-100 z-10' 
          : 'bg-slate-800/50 hover:bg-slate-800 scale-[0.98]'
      }`}
    >
      <div className={`bg-slate-900/95 backdrop-blur-xl rounded-[23px] overflow-hidden p-4 flex items-center justify-between gap-4 h-full relative ${isHidden ? 'opacity-60 saturate-[0.5]' : ''}`}>
        
        {/* Initiative Number Badge */}
        <div className={`w-12 h-12 flex-shrink-0 rounded-2xl flex items-center justify-center font-black text-lg italic tracking-tighter shadow-lg transition-all ${
          isActive 
            ? 'bg-amber-500 text-slate-900 scale-110 rotate-2' 
            : 'bg-slate-950/80 text-slate-500 border border-slate-800'
        }`}>
          {initiative}
        </div>

        {/* Combatant Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={`text-sm font-black italic uppercase truncate transition-colors ${
              isActive ? 'text-white' : 'text-slate-300'
            }`}>
              {name}
            </h4>
            {isHidden && (
              <span className="p-1 rounded-md bg-slate-950/50 text-slate-600">
                <EyeOff size={10} />
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-gradient-to-r ${typeGradients[type] || 'from-slate-700 to-slate-800'} text-white shadow-sm`}>
              {t(`initiative.types.${type}`, type)}
            </span>
            {combatant.roleOwner !== 'npc' && (
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${getRoleBadgeColor()} shadow-sm`}>
                {combatant.roleOwner}
              </span>
            )}
          </div>
        </div>

        {/* Pathfinder Action Counter */}
        {isPathfinder && (
           <div className="flex-shrink-0 pr-2 border-r border-slate-800">
             <ActionCounter combatant={combatant} isActive={isActive} />
           </div>
        )}

        {/* Status indicator for current turn */}
        {isActive && (
          <div className="absolute top-2 right-2 p-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 animate-pulse">
             <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
          </div>
        )}

        {/* Actions Bar (GM Mode) */}
        {viewMode === 'gm' && (
          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => dispatch(setCombatantVisibility({ id, isHidden: !isHidden }))}
              className={`p-2 rounded-xl transition-colors ${isHidden ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-950/50 text-slate-600 hover:text-white'}`}
              title={isHidden ? t('initiative.view_players', 'Show to Players') : t('initiative.hide_players', 'Hide from Players')}
            >
              {isHidden ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
            <button 
              onClick={() => {
                if (window.confirm(t('initiative.remove_confirm', { name }))) {
                  dispatch(removeCombatant(id));
                }
              }}
              className="p-2 rounded-xl bg-slate-950/50 text-slate-600 hover:text-rose-500 transition-colors"
              title={t('initiative.remove_btn', 'Remove')}
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Quick Notes Tooltip/Indicator */}
      {notes && (
         <div className="absolute bottom-1 right-3 text-slate-700 flex items-center gap-1 group-hover:text-slate-500 transition-colors">
            <MessageSquare size={10} />
            <span className="text-[8px] font-black uppercase truncate max-w-[80px]">{notes}</span>
         </div>
      )}
    </motion.div>
  );
};

export default CombatantCard;
