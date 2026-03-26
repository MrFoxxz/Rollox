import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { startInitiative, endInitiative } from '../../features/initiative/initiativeSlice';
import CombatantList from './CombatantList';
import AddCombatantModal from './AddCombatantModal';
import { Plus, Power, ShieldAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';

const InitiativeTracker = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const session = useSelector(state => state.session.currentSession);
  const tracker = useSelector(state => state.initiative.tracker);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleStartTracker = () => {
    if (session) {
      dispatch(startInitiative({ sessionId: session.id }));
    }
  };

  const handleEndTracker = () => {
     if (window.confirm(t('initiative.end_confirm', 'End the current initiative tracker? All combat data will be cleared.'))) {
        dispatch(endInitiative());
     }
  };

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-700 opacity-50">
           <ShieldAlert size={32} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">{t('initiative.no_session_title', 'No Active Session')}</h3>
          <p className="text-sm text-slate-500 max-w-xs">{t('initiative.no_session_desc', 'You must create or join a session to use the Initiative Tracker.')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[600px] flex flex-col">
      
      {!tracker.isActive ? (
        <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-8">
           <div className="w-24 h-24 rounded-[32px] bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-500 shadow-[0_0_40px_rgba(242,129,33,0.1)] relative">
              <Plus size={48} />
              <div className="absolute inset-0 bg-primary-500 blur-2xl opacity-10 animate-pulse rounded-[32px]" />
           </div>
           
           <div className="space-y-4">
              <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
                {t('initiative.start_encounters', 'Start Combat Encounters')}
              </h2>
              <p className="text-slate-500 max-w-sm mx-auto">
                {t('initiative.start_desc', 'Ready to roll? Start the initiative tracker to manage turns and actions for your tabletop sessions.')}
              </p>
           </div>

           <Button 
             size="lg" 
             className="px-12 h-16 shadow-2xl shadow-primary-500/20"
             onClick={handleStartTracker}
           >
             <Power size={20} className="mr-2" />
             {t('initiative.start_btn', 'Start Tracker')}
           </Button>
        </div>
      ) : (
        <>
          {/* Main List */}
          <div className="flex-1">
             <CombatantList />
          </div>

          {/* Quick Actions (Sticky Area) */}
          <div className="sticky bottom-6 right-6 flex flex-col items-end gap-3 p-4 pointer-events-none">
             <button
               onClick={() => setIsAddModalOpen(true)}
               className="pointer-events-auto h-14 px-6 bg-slate-900 border border-slate-800 rounded-2xl text-white font-black uppercase text-xs tracking-widest italic flex items-center gap-3 shadow-2xl hover:border-amber-500 transition-all group"
             >
               <Plus size={16} className="text-amber-500 group-hover:rotate-90 transition-transform duration-500" />
               {t('initiative.add_combatant', 'Add Combatant')}
             </button>
             
             <button
               onClick={handleEndTracker}
               className="pointer-events-auto h-12 px-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 font-black uppercase text-[10px] tracking-widest italic flex items-center gap-3 hover:bg-rose-500/20 transition-all"
             >
               <Power size={12} />
               {t('initiative.end_tracker', 'End Encounter')}
             </button>
          </div>
        </>
      )}

      {/* Modals */}
      <AddCombatantModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
};

export default InitiativeTracker;
