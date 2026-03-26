import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getDiceImageSrc } from '../../utils/diceAssets'
import { ChevronDown, Sparkles } from 'lucide-react'
import { addHistoryEntry } from '../../features/history/historySlice'
import { addNotification, markAllAsRead } from '../../features/notifications/notificationsSlice'
import { toggleFloatingDice, setFloatingDiceOpen } from '../../features/settings/settingsSlice'
import MinimizedDiceButton from './MinimizedDiceButton'
import DiceControls from './DiceControls'
import DiceResultDisplay from './DiceResultDisplay'
import CompactTurnWidget from '../initiative/CompactTurnWidget'
import Button from '../ui/Button'

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
  const unreadCount = notifications.filter(n => !n.read).length
  
  const activeParticipant = participants.find(p => p.id === activeParticipantId)
  
  const [isRolling, setIsRolling] = useState(false)
  const [sessionConfig, setSessionConfig] = useState({ count: 1, dieType: 20, modifier: 0 })

  const isHomePage = location.pathname === '/'
  if (isHomePage && hideOnHome) return null

  const handleRoll = () => {
    setIsRolling(true)
    setTimeout(() => {
      const dieType = sessionConfig.dieType || 20;
      const count = sessionConfig.count || 1;
      const modifier = sessionConfig.modifier || 0;

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
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4 pointer-events-none">
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
            className="w-80 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-6 pointer-events-auto flex flex-col gap-6 overflow-hidden relative group"
          >
            {/* Glass decoration */}
            <div className="absolute top-[-20%] right-[-20%] w-[50%] h-[50%] bg-primary-500/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-primary-500/20 transition-all duration-500" />

            <header className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-500/10 rounded-lg flex items-center justify-center overflow-hidden relative">
                  <img src={getDiceImageSrc(20)} alt="" className="w-6 h-6 object-contain" width={24} height={24} />
                  {unreadCount > 0 && (
                    <div className="absolute top-0 right-0 w-2 h-2 bg-amber-500 rounded-full border border-slate-900" />
                  )}
                </div>
                <div className="flex flex-col">
                  <h3 className="text-sm font-black italic uppercase tracking-tighter text-white leading-none">{t('floating.panel_title')}</h3>
                  {session && (
                    <span className="text-[9px] text-amber-500 font-bold uppercase tracking-widest mt-1 italic">{session.name}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={() => dispatch(markAllAsRead())}
                    className="p-1 text-[9px] font-black text-amber-500 uppercase tracking-widest hover:text-amber-400 mr-1"
                  >
                    {unreadCount} {t('floating.new', 'Nuevos')}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => dispatch(setFloatingDiceOpen(false))}
                  className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-colors"
                  title={t('floating.minimize')}
                >
                  <ChevronDown size={20} />
                </button>
              </div>
            </header>

            <div className="relative z-10 flex flex-col gap-6">
              <CompactTurnWidget />
              <DiceResultDisplay />
              <DiceControls
                config={sessionConfig}
                updateConfig={(updates) => setSessionConfig(prev => ({ ...prev, ...updates }))}
              />

              <Button
                type="button"
                onClick={handleRoll}
                disabled={isRolling}
                className="w-full h-14 text-sm font-black uppercase italic tracking-widest relative overflow-hidden group/btn"
              >
                {isRolling ? (
                  <div className="animate-pulse flex gap-1 items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
                  </div>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles size={16} />
                    {t('floating.roll_btn')}
                  </span>
                )}
              </Button>
            </div>

            <footer className="text-[10px] font-black text-slate-600 uppercase tracking-widest text-center italic relative z-10 border-t border-slate-800 pt-4">
              {t('floating.footer_tagline')}
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FloatingDicePanel
