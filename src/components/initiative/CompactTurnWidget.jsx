import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { nextTurn } from '../../features/initiative/initiativeSlice';
import { addNotification } from '../../features/notifications/notificationsSlice';
import { ChevronRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const CompactTurnWidget = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  const tracker = useSelector(state => state.initiative.tracker);
  const combatants = useSelector(state => state.initiative.combatants);
  const activeSystemId = useSelector(state => state.gameConfig.activeSystemId);
  const configs = useSelector(state => state.gameConfig.configs);
  const activeSystem = configs[activeSystemId];

  if (!tracker.isActive || combatants.length === 0) return null;

  const activeCombatant = combatants[tracker.currentTurnIndex];
  if (!activeCombatant) return null;

  const handleNextTurn = () => {
    const defaultActions = activeSystem?.turnSystem?.defaultActionsPerTurn || 3;
    dispatch(nextTurn({ defaultActions }));

    // Notifications logic
    const nextIndex = (tracker.currentTurnIndex + 1) % combatants.length;
    const nextCombatant = combatants[nextIndex];
    if (nextCombatant) {
       dispatch(addNotification({
          type: 'turn_started',
          message: t('initiative.turn_msg', { name: nextCombatant.name, round: nextIndex === 0 ? tracker.round + 1 : tracker.round }),
          actorName: nextCombatant.name,
          actorRole: nextCombatant.roleOwner
       }));
    }
  };

  const isPathfinder = activeSystem?.turnSystem?.type === 'actions';

  return (
    <div className="bg-slate-950/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-3 flex flex-col gap-3 shadow-xl hover:border-amber-500/30 transition-all group/turn">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 flex-shrink-0">
             <ShieldCheck size={16} />
          </div>
          <div className="flex flex-col min-w-0">
             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic flex items-center gap-1 leading-none mb-1">
               {t('common.now', 'Current Turn')}
               <span className="w-1 h-1 bg-amber-500 rounded-full animate-pulse" />
             </span>
             <h4 className="text-xs font-black text-white italic uppercase truncate tracking-tighter leading-none">
               {activeCombatant.name}
             </h4>
          </div>
        </div>

        <div className="flex flex-col items-end">
           <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest italic leading-none mb-1">
             {t('initiative.round_n', { round: tracker.round })}
           </span>
           <button 
             onClick={handleNextTurn}
             className="w-8 h-8 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 flex items-center justify-center shadow-lg transition-all group-hover/turn:scale-110 active:scale-95"
           >
             <ChevronRight size={18} />
           </button>
        </div>
      </div>

      {isPathfinder && (
         <div className="flex items-center justify-between pt-2 border-t border-slate-800/50">
            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest italic">{t('initiative.actions_remaining', 'Actions Remaining')}</span>
            <div className="flex gap-1">
               {Array.from({ length: activeCombatant.actions?.max || 3 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-2.5 h-3 rounded-sm border ${
                      i < (activeCombatant.actions?.current || 3) 
                        ? 'bg-amber-500 border-amber-400 shadow-[0_0_8px_rgba(242,129,33,0.3)]' 
                        : 'bg-slate-900 border-slate-800'
                    } transition-all`}
                  />
               ))}
            </div>
         </div>
      )}
    </div>
  );
};

export default CompactTurnWidget;
