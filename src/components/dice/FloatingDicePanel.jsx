import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getDiceImageSrc } from '../../utils/diceAssets'
import { ChevronDown, Sparkles, Wand2, Swords, ChevronUp } from 'lucide-react'
import { addHistoryEntry } from '../../features/history/historySlice'
import { addNotification, markAllAsRead } from '../../features/notifications/notificationsSlice'
import { toggleFloatingDice, setFloatingDiceOpen } from '../../features/settings/settingsSlice'
import MinimizedDiceButton from './MinimizedDiceButton'
import DiceResultDisplay from './DiceResultDisplay'
import CompactTurnWidget from '../initiative/CompactTurnWidget'

const FloatingDicePanel = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const location = useLocation()
  const isPanelOpen = useSelector(state => state.settings.isFloatingDiceOpen)
  const hideOnHome = useSelector(state => state.settings.hideFloatingDiceOnHome ?? true)
  const session = useSelector(state => state.session.currentSession)
  const participants = useSelector(state => state.session.participants)
  const activeParticipantId = useSelector(state => state.session.activeParticipantId)
  const notifications = useSelector(state => state.notifications.notifications)
  const tracker = useSelector(state => state.initiative.tracker)
  const unreadCount = notifications.filter(n => !n.read).length
  
  const activeParticipant = participants.find(p => p.id === activeParticipantId)
  
  const [isRolling, setIsRolling] = useState(false)
  const [activeTab, setActiveTab] = useState('dice') // dice, presets
  const [showTracker, setShowTracker] = useState(true)
  const presets = useSelector(state => state.presets)

  const isHomePage = location.pathname === '/'
  if (isHomePage && hideOnHome) return null

  const handleRoll = (dieType, count = 1, modifier = 0, name = '') => {
    setIsRolling(true)
    setTimeout(() => {
      const individual = Array.from(
        { length: count },
        () => Math.floor(Math.random() * dieType) + 1
      )
      const sum = individual.reduce((a, b) => a + b, 0)
      const total = sum + modifier

      const rollData = {
        id: Date.now(),
        sessionId: session?.id || 'local',
        actorId: activeParticipantId || 'local-user',
        actorName: activeParticipant?.name || 'Local User',
        actorRole: activeParticipant?.role || 'player',
        source: 'floating-panel',
        diceType: dieType,
        quantity: count,
        modifier: modifier,
        rawResults: individual,
        total,
        name: name,
        criticalState: dieType === 20 ? (individual.includes(20) ? 'critical' : individual.includes(1) ? 'fumble' : 'normal') : 'normal',
      };

      dispatch(addHistoryEntry(rollData))

      if (session) {
        dispatch(addNotification({
          type: 'roll',
          sessionId: session.id,
          actorName: rollData.actorName,
          actorRole: rollData.actorRole,
          message: `${rollData.actorName} rolou ${count}d${dieType}${modifier !== 0 ? (modifier > 0 ? '+' + modifier : modifier) : ''} e obteve ${total}`,
        }));
      }

      setIsRolling(false)
    }, 450)
  }

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4 pointer-events-none sticky-floating-panel">
      {/* Backdrop for click-outside */}
      {isPanelOpen && (
        <div 
          className="fixed inset-0 z-[-1] pointer-events-auto cursor-default" 
          onClick={() => dispatch(setFloatingDiceOpen(false))}
        />
      )}
      <AnimatePresence>
        {!isPanelOpen ? (
          <div className="pointer-events-auto">
            <MinimizedDiceButton onClick={() => dispatch(toggleFloatingDice())} />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, x: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.9, y: 20, x: 20, filter: 'blur(10px)' }}
            className="w-96 bg-slate-900/95 backdrop-blur-2xl border border-slate-800 rounded-[2.5rem] shadow-2xl p-7 pointer-events-auto flex flex-col gap-6 overflow-hidden relative group"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-[-20%] right-[-20%] w-[50%] h-[50%] bg-primary-500/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-primary-500/20 transition-all duration-500" />

            <header className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center overflow-hidden relative border border-primary-500/20">
                  <img src={getDiceImageSrc(20)} alt="" className="w-7 h-7 object-contain" width={24} height={24} />
                  {unreadCount > 0 && (
                    <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-slate-900" />
                  )}
                </div>
                <div className="flex flex-col">
                  <h3 className="text-base font-black italic uppercase tracking-tighter text-white leading-none">{t('floating.panel_title')}</h3>
                  {session && (
                    <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest mt-1.5 italic">{session.name}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {tracker.isActive && (
                  <button
                    onClick={() => setShowTracker(!showTracker)}
                    className={`p-2 rounded-xl border transition-all ${showTracker ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-slate-800 border-slate-700 text-slate-500'}`}
                    title="Toggle Combat Tracker"
                  >
                    <Swords size={16} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => dispatch(setFloatingDiceOpen(false))}
                  className="p-2 hover:bg-slate-800 rounded-xl text-slate-500 hover:text-white transition-colors border border-transparent hover:border-slate-700"
                >
                  <ChevronDown size={20} />
                </button>
              </div>
            </header>

            {/* Combat Tracker (Global) */}
            <AnimatePresence>
              {tracker.isActive && showTracker && (
                <motion.div
                   initial={{ height: 0, opacity: 0, marginBottom: -24 }}
                   animate={{ height: 'auto', opacity: 1, marginBottom: 0 }}
                   exit={{ height: 0, opacity: 0, marginBottom: -24 }}
                   className="relative z-10 overflow-hidden"
                >
                  <CompactTurnWidget />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center bg-slate-950/70 rounded-full p-0.5 relative z-10 border border-slate-800/50">
               <button 
                onClick={() => setActiveTab('dice')}
                className={`flex-1 flex items-center justify-center py-2 rounded-full transition-all ${activeTab === 'dice' ? 'bg-primary-500/20 text-primary-500 shadow-lg' : 'text-slate-500 hover:text-slate-400'}`}
               >
                  <Sparkles size={14} className="mr-2" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em]">{t('nav.dice')}</span>
               </button>
               <button 
                onClick={() => setActiveTab('presets')}
                className={`flex-1 flex items-center justify-center py-2 rounded-full transition-all ${activeTab === 'presets' ? 'bg-primary-500/20 text-primary-500 shadow-lg' : 'text-slate-500 hover:text-slate-400'}`}
               >
                  <Wand2 size={14} className="mr-2" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em]">{t('dice.quick_presets', 'Quick Presets')}</span>
               </button>
            </div>

            <AnimatePresence mode="wait">
               {activeTab === 'dice' ? (
                 <motion.div 
                   key="dice-tab"
                   initial={{ opacity: 0, scale: 0.95 }} 
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.95 }}
                   className="flex flex-col gap-6"
                 >
                   <DiceResultDisplay />
                   
                   <div className="grid grid-cols-4 gap-3">
                      {[4, 6, 8, 10, 12, 20, 100].map(type => (
                        <button
                          key={type}
                          onClick={() => handleRoll(type, 1, 0)}
                          className="bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-primary-500/50 rounded-2xl p-3 flex flex-col items-center gap-2 transition-all active:scale-90 group/die"
                        >
                          <img 
                            src={getDiceImageSrc(type)} 
                            alt={`d${type}`} 
                            className="w-10 h-10 object-contain transition-transform group-hover/die:rotate-12"
                          />
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">d{type}</span>
                        </button>
                      ))}
                   </div>
                 </motion.div>
               ) : (
                 <motion.div 
                  key="presets-tab"
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-2 thin-scrollbar"
                >
                   <div className="flex items-center gap-2 mb-2 px-1">
                      <Wand2 size={14} className="text-primary-500" />
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{t('dice.quick_presets', 'Quick Presets')}</h4>
                   </div>
                   
                   {[...presets.defaultPresets, ...presets.customPresets].map(p => (
                     <button
                       key={p.id}
                       onClick={() => handleRoll(p.type || p.diceType, p.dice || p.quantity, p.modifier, p.name || t(p.label))}
                       className="flex items-center justify-between p-4 bg-slate-950/50 hover:bg-slate-800 border border-slate-800 rounded-[1.5rem] transition-all text-left active:scale-[0.98] group/p"
                     >
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover/p:border-amber-500/50 transition-colors">
                             <img src={getDiceImageSrc(p.type || p.diceType || 20)} className="w-7 h-7 object-contain" />
                          </div>
                          <div className="flex flex-col">
                             <span className="text-xs font-black text-slate-100 italic tracking-tight uppercase group-hover/p:text-amber-500 transition-colors">
                                {p.name || t(p.label) || t('dice.unnamed_preset', 'Unnamed')}
                             </span>
                             <span className="text-[11px] font-black text-amber-500/70 tracking-[0.15em] mt-1 italic leading-none">
                                {p.dice || p.quantity || 1}d{p.type || p.diceType || 20}{p.modifier !== 0 ? (p.modifier > 0 ? '+' : '') + p.modifier : ''}
                             </span>
                          </div>
                       </div>
                     </button>
                   ))}
                </motion.div>
               )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FloatingDicePanel
