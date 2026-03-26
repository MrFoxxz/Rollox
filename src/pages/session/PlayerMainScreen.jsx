import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { setViewMode } from '../../features/initiative/initiativeSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Footprints, 
  Swords, 
  Clock, 
  Zap, 
  Sparkles,
  LayoutDashboard,
  Users,
  Eye,
  MessageSquare
} from 'lucide-react';
import InitiativeTracker from '../../components/initiative/InitiativeTracker';
import SessionNotesPanel from '../../components/session/SessionNotesPanel';
import LastRollResult from '../../components/dice/LastRollResult';
import SessionToolkit from '../../components/session/SessionToolkit';
import ParticipantList from '../../components/session/ParticipantList';
import Card from '../../components/ui/Card';

const PlayerMainScreen = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const session = useSelector(state => state.session.currentSession);
  const participants = useSelector(state => state.session.participants);
  const activeParticipantId = useSelector(state => state.session.activeParticipantId);
  const [activeTab, setActiveTab] = useState('combat'); // combat, notes, participants
  
  const currentUser = participants.find(p => p.id === activeParticipantId);

  useEffect(() => {
    dispatch(setViewMode('player'));
  }, [dispatch]);

  if (!session) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center opacity-40">
       <LayoutDashboard size={80} className="mb-4 text-slate-700" />
       <h1 className="text-2xl font-black uppercase text-slate-500">{t('session.no_active_session')}</h1>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 lg:gap-8 min-h-screen pb-32">
       {/* Session Header Controls */}
       <header className="flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-slate-800/50 shrink-0">
          <div className="flex flex-col">
            <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none flex items-center gap-3">
              <Sparkles className="text-amber-500" size={32} />
              {session.name}
            </h1>
            <p className="text-[10px] text-amber-500 font-black uppercase tracking-[0.2em] mt-2 flex items-center gap-1.5 italic">
               <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
               {t('session.playing_as')}: {currentUser?.name || 'Local User'} ({t(`roles.${currentUser?.role || 'player'}`)})
            </p>
          </div>

          <div className="flex items-center gap-2 p-1 bg-slate-900/80 rounded-2xl border border-slate-800">
             {[
               { id: 'combat', label: t('common.combat'), icon: Swords },
               { id: 'notes', label: t('toolkit.notes'), icon: MessageSquare },
               { id: 'participants', label: t('session.participants'), icon: Users }
             ].map(tab => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                   activeTab === tab.id ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'text-slate-500 hover:text-slate-200'
                 }`}
               >
                 <tab.icon size={16} />
                 {tab.label}
               </button>
             ))}
          </div>
       </header>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Main Work Area */}
          <div className="lg:col-span-8 space-y-8">
             <AnimatePresence mode="wait">
                {activeTab === 'combat' && (
                  <motion.div 
                    key="combat"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-6"
                  >
                     <div className="bg-slate-900/50 rounded-[32px] border border-slate-800/80 p-1 min-h-[500px] overflow-hidden">
                        <InitiativeTracker />
                     </div>
                  </motion.div>
                )}

                {activeTab === 'notes' && (
                  <motion.div 
                    key="notes"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="min-h-[500px]"
                  >
                     <SessionNotesPanel />
                  </motion.div>
                )}

                {activeTab === 'participants' && (
                  <motion.div 
                    key="participants"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="min-h-[500px]"
                  >
                     <ParticipantList />
                  </motion.div>
                )}
             </AnimatePresence>
          </div>

          {/* Side Control Area */}
          <div className="lg:col-span-4 space-y-6 flex flex-col h-full lg:sticky lg:top-24">
             <LastRollResult />
             
             <Card className="p-6 border-amber-500/10 bg-gradient-to-br from-amber-500/5 to-transparent relative overflow-hidden group/info">
                <div className="absolute top-[-20%] right-[-20%] w-[50%] h-[50%] bg-amber-500/5 blur-[40px] rounded-full pointer-events-none group-hover/info:bg-amber-500/10 transition-all duration-700" />
                
                <div className="flex items-center gap-3 mb-5 relative z-10">
                   <div className="p-1.5 bg-amber-500/10 rounded-lg border border-amber-500/20">
                      <Clock size={16} className="text-amber-500" />
                   </div>
                   <h3 className="text-[11px] font-black text-amber-200 uppercase tracking-[0.2em] italic">
                      {t('session.active_info', 'Session Status')}
                   </h3>
                </div>

                <div className="space-y-4 relative z-10">
                   <div className="flex items-center justify-between p-3 bg-slate-950/40 rounded-2xl border border-slate-800/50">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">{t('initiative.round_n', { round: '-' })}</span>
                      <span className="text-sm font-black text-amber-500 italic">01</span>
                   </div>
                   <div className="flex items-center justify-between p-3 bg-slate-950/40 rounded-2xl border border-slate-800/50">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">{t('session.participants_active', 'Active Members')}</span>
                      <span className="text-sm font-black text-white italic">{participants.length}</span>
                   </div>
                </div>
             </Card>

             <div className="p-8 border-2 border-dashed border-slate-800/20 rounded-[40px] flex flex-col items-center justify-center text-center opacity-20 grayscale transition-opacity hover:opacity-40">
                <Users size={32} className="text-slate-700 mb-2" />
                <p className="text-[9px] font-black uppercase text-slate-600 tracking-widest italic">Social/Inventory Area</p>
             </div>
          </div>
       </div>

       {/* Floating Session Toolkit */}
       <SessionToolkit mode="player" />
    </div>
  );
};

export default PlayerMainScreen;
