import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { nextTurn, setViewMode } from '../../features/initiative/initiativeSlice';
import { addNotification } from '../../features/notifications/notificationsSlice';
import CombatantCard from './CombatantCard';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ChevronRight, LayoutGrid, LayoutTemplate, ShieldCheck, Sparkles } from 'lucide-react';

const CombatantList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  const tracker = useSelector(state => state.initiative.tracker);
  const combatants = useSelector(state => state.initiative.combatants);
  const viewMode = useSelector(state => state.initiative.viewMode);
  const activeSystemId = useSelector(state => state.gameConfig.activeSystemId);
  const configs = useSelector(state => state.gameConfig.configs);
  const activeSystem = configs[activeSystemId];

  const handleNextTurn = useCallback(() => {
    if (!tracker.isActive || combatants.length === 0) return;

    const defaultActions = activeSystem?.turnSystem?.defaultActionsPerTurn || 3;
    const oldRound = tracker.round;
    
    dispatch(nextTurn({ defaultActions }));

    // Notifications logic (handled via useEffect to avoid stale state issues, but we can do it here too)
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

    if (nextIndex === 0) {
       dispatch(addNotification({
          type: 'round_started',
          message: t('initiative.round_msg', { round: tracker.round + 1 }),
          actorName: 'System',
          actorRole: 'admin'
       }));
    }
  }, [dispatch, tracker, combatants, activeSystem]);

  // Spacebar keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Guard against typing in inputs/textarea
      const activeElement = document.activeElement;
      const isTyping = 
        activeElement.tagName === 'INPUT' || 
        activeElement.tagName === 'TEXTAREA' || 
        activeElement.isContentEditable;

      if (e.code === 'Space' && !isTyping && tracker.isActive) {
        e.preventDefault();
        handleNextTurn();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tracker.isActive, handleNextTurn]);

  if (!tracker.isActive) return null;

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto p-4 md:p-8">
      
      {/* Tracker Header */}
      <header className="flex flex-wrap items-end justify-between gap-6 pb-6 border-b border-slate-800/50">
        <div className="flex flex-col">
           <div className="flex items-center gap-3 mb-2">
             <div className="w-10 h-10 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-500 shadow-[0_0_20px_rgba(242,129,33,0.15)]">
               <ShieldCheck size={20} />
             </div>
             <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">
               {t('initiative.value', 'Initiative Tracker')}
             </h2>
           </div>
           <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest italic flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                {t('initiative.round_n', { round: tracker.round })}
              </span>
              <span className="w-1 h-1 bg-slate-800 rounded-full" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
                {t('initiative.combatants_count', { count: combatants.length })}
              </span>
           </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center p-1 bg-slate-950/80 rounded-2xl border border-slate-800 shadow-inner">
           <button 
             onClick={() => dispatch(setViewMode('gm'))}
             className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
               viewMode === 'gm' ? 'bg-amber-500 text-slate-900 shadow-lg' : 'text-slate-600 hover:text-slate-300'
             }`}
           >
             <LayoutTemplate size={12} />
             {t('initiative.gm_view', 'GM View')}
           </button>
           <button 
             onClick={() => dispatch(setViewMode('player'))}
             className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
               viewMode === 'player' ? 'bg-amber-500 text-slate-900 shadow-lg' : 'text-slate-600 hover:text-slate-300'
             }`}
           >
             <LayoutGrid size={12} />
             {t('initiative.player_view', 'Player View')}
           </button>
        </div>
      </header>

      {/* Combatant List */}
      <div className="flex flex-col gap-3 min-h-[400px]">
        <AnimatePresence mode="popLayout">
          {combatants.length === 0 ? (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="flex flex-col items-center justify-center py-20 text-slate-700 opacity-50 space-y-4"
            >
               <Sparkles size={48} className="animate-pulse" />
               <p className="text-xs font-black uppercase tracking-[0.3em]">{t('initiative.no_combatants', 'No combatants yet')}</p>
            </motion.div>
          ) : (
            combatants.map((combatant, index) => (
              <CombatantCard 
                key={combatant.id}
                combatant={combatant}
                isActive={tracker.currentTurnIndex === index}
                viewMode={viewMode}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Footer Controls (Next Turn) */}
      <div className="sticky bottom-6 mt-6 flex justify-center">
         <motion.button
           whileHover={{ scale: 1.05 }}
           whileTap={{ scale: 0.95 }}
           onClick={handleNextTurn}
           disabled={combatants.length === 0}
           className="group h-16 px-10 bg-gradient-to-r from-amber-500 to-orange-600 rounded-[32px] text-white font-black uppercase italic tracking-[0.2em] shadow-2xl shadow-amber-500/40 hover:shadow-amber-500/60 transition-all flex items-center justify-center gap-4 border-2 border-white/20 disabled:opacity-50 disabled:grayscale disabled:shadow-none"
         >
           <span className="text-sm">{t('initiative.next_turn', 'Next Turn')}</span>
           <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center group-hover:bg-black/20 transition-colors">
              <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
           </div>
           
           {/* Spacebar indicator */}
           <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[9px] font-black text-slate-700 uppercase tracking-widest italic opacity-50 group-hover:opacity-100 transition-opacity">
             {t('initiative.press_space', 'Press [Spacebar]')}
           </div>
         </motion.button>
      </div>

    </div>
  );
};

export default CombatantList;
