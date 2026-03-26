import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getDiceImageSrc } from '../../utils/diceAssets'
import { ChevronDown, Sparkles } from 'lucide-react'
import { addRoll } from '../../features/dice/diceSlice'
import { toggleFloatingDice, setFloatingDiceOpen } from '../../features/settings/settingsSlice'
import MinimizedDiceButton from './MinimizedDiceButton'
import DiceControls from './DiceControls'
import DiceResultDisplay from './DiceResultDisplay'
import Button from '../ui/Button'

const FloatingDicePanel = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const location = useLocation()
  const isPanelOpen = useSelector(state => state.settings.isFloatingDiceOpen)
  const hideOnHome = useSelector(state => state.settings.hideFloatingDiceOnHome ?? true)
  const [isRolling, setIsRolling] = useState(false)
  const [sessionConfig, setSessionConfig] = useState({ count: 1, dieType: 20, modifier: 0 })

  const isHomePage = location.pathname === '/'
  if (isHomePage && hideOnHome) return null

  const handleRoll = () => {
    setIsRolling(true)
    setTimeout(() => {
      const individual = Array.from(
        { length: sessionConfig.count },
        () => Math.floor(Math.random() * sessionConfig.dieType) + 1
      )
      const sum = individual.reduce((a, b) => a + b, 0)
      const total = sum + (sessionConfig.modifier || 0)
      dispatch(addRoll({
        id: Date.now(),
        total,
        individual,
        diceConfig: { ...sessionConfig },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }))
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
                <div className="w-8 h-8 bg-primary-500/10 rounded-lg flex items-center justify-center overflow-hidden">
                  <img src={getDiceImageSrc(20)} alt="" className="w-6 h-6 object-contain" width={24} height={24} />
                </div>
                <h3 className="text-sm font-black italic uppercase tracking-tighter text-white">{t('floating.panel_title')}</h3>
              </div>
              <button
                type="button"
                onClick={() => dispatch(setFloatingDiceOpen(false))}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-colors"
                title={t('floating.minimize')}
              >
                <ChevronDown size={20} />
              </button>
            </header>

            <div className="relative z-10 flex flex-col gap-6">
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
