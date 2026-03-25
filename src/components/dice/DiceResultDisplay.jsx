import { motion, AnimatePresence } from 'framer-motion'
import { useSelector } from 'react-redux'
import { getD20Status, getD20Classes } from '../../utils/diceUtils'

const DiceResultDisplay = () => {
  const lastRoll = useSelector(state => state.dice.lastRoll)
  const enableCriticalHighlighting = useSelector(state => state.settings.enableCriticalHighlighting)

  if (!lastRoll) return null

  // Check if any d20 in results is critical/fumble
  const containsCritical = lastRoll.diceConfig.dieType === 20 && lastRoll.individual.some(v => v === 20)
  const containsFumble = lastRoll.diceConfig.dieType === 20 && lastRoll.individual.some(v => v === 1)

  const totalClasses = `text-5xl font-black italic tracking-tighter drop-shadow-xl transition-colors duration-500 ${
    enableCriticalHighlighting && containsCritical ? 'text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 
    enableCriticalHighlighting && containsFumble ? 'text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.4)]' : 
    'text-white drop-shadow-[0_0_10px_rgba(242,129,33,0.3)]'
  }`

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={lastRoll.id}
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="p-4 bg-slate-950/40 rounded-2xl border border-slate-800/50 text-center relative overflow-hidden group/result"
      >
        {/* Glow effect for crit/fumble */}
        {enableCriticalHighlighting && (containsCritical || containsFumble) && (
          <div className={`absolute inset-0 opacity-10 pointer-events-none blur-[40px] ${containsCritical ? 'bg-emerald-500' : 'bg-rose-500'}`} />
        )}

        <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1 italic relative z-10">
          {lastRoll.diceConfig.count}d{lastRoll.diceConfig.dieType}
          {lastRoll.diceConfig.modifier !== 0 && (lastRoll.diceConfig.modifier > 0 ? ` + ${lastRoll.diceConfig.modifier}` : ` - ${Math.abs(lastRoll.diceConfig.modifier)}`)}
        </div>
        
        <div className={`${totalClasses} relative z-10`}>
          {lastRoll.total}
        </div>

        <div className="flex flex-wrap justify-center gap-1.5 mt-3 max-h-16 overflow-y-auto pr-1 thin-scrollbar relative z-10">
          {lastRoll.individual.map((val, i) => {
            const status = enableCriticalHighlighting ? getD20Status(val, lastRoll.diceConfig.dieType) : null
            const classStatus = status ? getD20Classes(status) : 'text-slate-400 border-slate-800 bg-slate-900/50'
            
            return (
              <div 
                key={i} 
                className={`w-7 h-7 rounded-md border flex items-center justify-center font-bold text-[10px] italic transition-all duration-300 ${classStatus} hover:scale-110`}
              >
                {val}
              </div>
            )
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default DiceResultDisplay
