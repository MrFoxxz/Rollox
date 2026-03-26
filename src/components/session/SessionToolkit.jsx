import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronUp, 
  ChevronDown, 
  Zap, 
  Clock, 
  MessageSquare, 
  X, 
  Send, 
  Bell, 
  CheckCircle, 
  Volume2,
  Box,
  Layout
} from 'lucide-react';
import { toggleExpanded, setActiveTab, sendAnnouncement } from '../../features/toolkit/toolkitSlice';

const SessionToolkit = ({ mode = 'player' }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { expanded, activeTab, announcements } = useSelector(state => state.toolkit);
  const session = useSelector(state => state.session.currentSession);
  const { tracker, combatants } = useSelector(state => state.initiative);
  const participants = useSelector(state => state.session.participants);
  const activeParticipantId = useSelector(state => state.session.activeParticipantId);
  const lastRoll = useSelector(state => state.history.lastRoll);
  
  const [message, setMessage] = useState('');
  const currentUser = participants.find(p => p.id === activeParticipantId);
  const isGM = mode === 'gm' || currentUser?.role === 'gm' || currentUser?.role === 'admin';

  const activeCombatant = combatants.length > 0 && tracker.isActive 
    ? combatants[tracker.currentTurnIndex % combatants.length]
    : null;
  
  const isMyTurn = activeCombatant?.participantId === activeParticipantId;

  const handleSendAnnouncement = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    dispatch(sendAnnouncement({
      title: isGM ? 'Anuncio del DJ' : 'Mensaje de Sesión',
      message: message.trim(),
      type: isGM ? 'gm-message' : 'info',
      authorId: activeParticipantId,
      authorRole: currentUser?.role || 'player',
      audience: 'all'
    }));
    setMessage('');
  };

  if (!session) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[150] flex flex-col items-end pointer-events-none">
       {/* Expanded Panel */}
       <AnimatePresence>
          {expanded && (
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="mb-4 w-[360px] bg-slate-900 border-2 border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden pointer-events-auto"
            >
               <div className="p-1 bg-slate-950/50 flex items-center border-b border-slate-800">
                  {['rolls', 'turns', 'messages'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => dispatch(setActiveTab(tab))}
                      className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest transition-all ${
                        activeTab === tab ? 'text-amber-500' : 'text-slate-600 hover:text-slate-400'
                      }`}
                    >
                      {t(`toolkit.tabs.${tab}`)}
                    </button>
                  ))}
               </div>

               <div className="p-6 h-[400px] flex flex-col overflow-y-auto thin-scrollbar">
                  <AnimatePresence mode="wait">
                     {activeTab === 'rolls' && (
                       <motion.div 
                         key="rolls"
                         initial={{ opacity: 0 }} 
                         animate={{ opacity: 1 }}
                         className="space-y-4"
                       >
                         <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic border-b border-slate-800 pb-2">
                            Últimos Eventos
                         </h4>
                         {lastRoll ? (
                           <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl flex items-center justify-between">
                              <div className="flex flex-col">
                                 <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{lastRoll.actorName} rolled</span>
                                 <span className="text-xs font-bold text-slate-300 italic">{lastRoll.quantity}d{lastRoll.diceType}</span>
                              </div>
                              <div className="text-2xl font-black text-white italic">{lastRoll.total}</div>
                           </div>
                         ) : (
                           <p className="text-[10px] text-slate-600 italic py-4">Sin actividad en estos dados...</p>
                         )}
                       </motion.div>
                     )}

                     {activeTab === 'turns' && (
                       <motion.div 
                         key="turns"
                         initial={{ opacity: 0 }} 
                         animate={{ opacity: 1 }}
                         className="flex flex-col h-full"
                       >
                         <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic border-b border-slate-800 pb-2 mb-4">
                            Orden de Combate
                         </h4>
                         
                         {tracker.isActive ? (
                           <div className="space-y-4">
                              <div className={`p-4 rounded-2xl border-2 transition-all flex flex-col gap-3 ${isMyTurn ? 'bg-amber-500/10 border-amber-500 shadow-lg shadow-amber-500/5' : 'bg-slate-950/50 border-slate-800'}`}>
                                 <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                       {isMyTurn ? '¡Es tu turno!' : 'Turno Actual'}
                                    </span>
                                    <div className="px-2 py-0.5 bg-slate-800 rounded text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                       Ronda {tracker.round}
                                    </div>
                                 </div>
                                 
                                 <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl italic ${isMyTurn ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>
                                       {activeCombatant?.initiative}
                                    </div>
                                    <div className="flex flex-col">
                                       <span className={`text-lg font-black italic leading-none ${isMyTurn ? 'text-amber-500' : 'text-white'}`}>
                                          {activeCombatant?.name}
                                       </span>
                                       <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1">
                                          {activeCombatant?.type}
                                       </span>
                                    </div>
                                 </div>
                              </div>
                              
                              <div className="space-y-2 pt-2">
                                 <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest italic px-1">Siguientes...</span>
                                 {combatants.slice(tracker.currentTurnIndex + 1, tracker.currentTurnIndex + 4).map((c, i) => (
                                   <div key={i} className="flex items-center justify-between p-3 bg-slate-950/30 border border-slate-900 rounded-xl opacity-60">
                                      <span className="text-[10px] font-bold text-slate-400 italic">{c.name}</span>
                                      <span className="text-[9px] font-black text-slate-600 italic">INIT {c.initiative}</span>
                                   </div>
                                 ))}
                              </div>
                           </div>
                         ) : (
                           <div className="flex flex-col items-center justify-center py-20 text-center">
                             <Clock size={32} className="text-slate-800 mb-4" />
                             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic leading-relaxed">
                                El seguimiento de turnos activo aparecerá aquí cuando comience el combate.
                             </p>
                           </div>
                         )}
                       </motion.div>
                     )}

                     {activeTab === 'messages' && (
                       <motion.div 
                         key="messages"
                         initial={{ opacity: 0 }} 
                         animate={{ opacity: 1 }}
                         className="flex flex-col h-full"
                       >
                          <div className="flex-1 space-y-4 mb-4">
                             {announcements.length === 0 ? (
                               <p className="text-[10px] text-slate-600 italic text-center py-20">No hay mensajes de sesión</p>
                             ) : (
                               announcements.map(ann => (
                                 <div key={ann.id} className={`p-3 rounded-xl border ${ann.type === 'gm-message' ? 'bg-purple-500/10 border-purple-500/20' : 'bg-slate-950/50 border-slate-800'}`}>
                                    <div className="flex items-center gap-2 mb-1">
                                       <div className={`w-1.5 h-1.5 rounded-full ${ann.type === 'gm-message' ? 'bg-purple-500' : 'bg-amber-500'}`} />
                                       <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest">{ann.title}</span>
                                    </div>
                                    <p className="text-xs text-slate-300 italic leading-snug">{ann.message}</p>
                                 </div>
                               ))
                             )}
                          </div>
                          
                          {isGM && (
                            <form onSubmit={handleSendAnnouncement} className="relative">
                               <input 
                                 type="text" 
                                 placeholder="Enviar mensaje..."
                                 value={message}
                                 onChange={(e) => setMessage(e.target.value)}
                                 className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-4 pr-12 py-3 text-xs text-slate-200 outline-none focus:border-purple-500/50 transition-all font-bold italic"
                               />
                               <button 
                                 type="submit"
                                 className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-purple-500 hover:text-purple-400 transition-colors"
                               >
                                 <Send size={16} />
                               </button>
                            </form>
                          )}
                       </motion.div>
                     )}
                  </AnimatePresence>
               </div>
            </motion.div>
          )}
       </AnimatePresence>

       {/* Floating Toggle Button */}
       <button 
         onClick={() => dispatch(toggleExpanded())}
         className={`h-16 w-16 rounded-[1.75rem] shadow-2xl transition-all duration-300 flex items-center justify-center relative pointer-events-auto border-4 ${
           expanded 
             ? 'bg-slate-950 border-slate-800 text-slate-500 rotate-90 scale-90' 
             : `bg-slate-900 border-slate-800 hover:border-amber-500/50 text-white ${announcements.some(a => !a.isRead) ? 'animate-bounce-short' : ''} ${isMyTurn ? 'border-amber-500 animate-pulse' : ''}`
         }`}
       >
          <div className="relative">
             {isMyTurn && !expanded && (
               <div className="absolute inset-0 bg-amber-500 rounded-2xl blur-xl opacity-20 animate-pulse" />
             )}
             <Box size={24} className={expanded ? 'opacity-0' : 'opacity-100'} />
             <X size={24} className={`absolute inset-0 transition-opacity ${expanded ? 'opacity-100' : 'opacity-0'}`} />
             {!expanded && announcements.some(a => !a.isRead) && (
               <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-slate-900" />
             )}
          </div>
       </button>
    </div>
  );
};

export default SessionToolkit;
