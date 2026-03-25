import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { addRoll, clearHistory, updateDiceConfig } from '../features/dice/diceSlice'
import { Dice6, Plus, Minus, Hash, Trash2, Clock, Zap, Swords, HeartPulse, ShieldCheck, Activity, Timer } from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { motion, AnimatePresence } from 'framer-motion'

const DIE_TYPES = [4, 6, 8, 10, 12, 20, 100]

const DiceRoller = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const diceConfig = useSelector(state => state.dice.diceConfig)
  const history = useSelector(state => state.dice.history)
  const lastRoll = useSelector(state => state.dice.lastRoll)
  
  const [isRolling, setIsRolling] = useState(false)
  const historyRef = useRef(null)

  const handleRoll = (config = diceConfig) => {
    setIsRolling(true)
    
    // Simulate roll animation delay
    setTimeout(() => {
      const individual = Array.from({ length: config.count }, () => 
        Math.floor(Math.random() * config.dieType) + 1
      )
      
      const sum = individual.reduce((a, b) => a + b, 0)
      const total = sum + (config.modifier || 0)
      
      const rollData = {
        id: Date.now(),
        total,
        individual,
        diceConfig: { ...config },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      }
      
      dispatch(addRoll(rollData))
      setIsRolling(false)
    }, 400)
  }

  const updateConfig = (updates) => {
    dispatch(updateDiceConfig(updates))
  }

  const quickPresets = [
    { id: 'attack', icon: Swords, label: t('dice.presets.attack'), config: { count: 1, dieType: 20, modifier: 5 } },
    { id: 'damage', icon: Zap, label: t('dice.presets.damage'), config: { count: 1, dieType: 12, modifier: 3 } },
    { id: 'skill', icon: Activity, label: t('dice.presets.skill'), config: { count: 1, dieType: 20, modifier: 2 } },
    { id: 'save', icon: ShieldCheck, label: t('dice.presets.save'), config: { count: 1, dieType: 20, modifier: 4 } },
    { id: 'initiative', icon: Timer, label: t('dice.presets.initiative'), config: { count: 1, dieType: 20, modifier: 1 } },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Configuration & Roll Panel */}
      <div className="lg:col-span-8 space-y-8">
        <section className="flex flex-col gap-6">
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mr-2">{t('dice.title')}</h1>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {DIE_TYPES.map(type => (
              <button
                key={type}
                onClick={() => updateConfig({ dieType: type })}
                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all group overflow-hidden relative ${
                  diceConfig.dieType === type 
                    ? 'border-primary-500 bg-primary-500/10 text-primary-500' 
                    : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                }`}
              >
                <div className={`text-2xl font-black mb-1 italic ${diceConfig.dieType === type ? 'scale-110' : 'scale-100'} transition-transform`}>d{type}</div>
                <div className="h-1 w-full bg-slate-800 rounded-full mt-auto">
                   <div className={`h-full bg-primary-500 transition-all duration-300 ${diceConfig.dieType === type ? 'w-full' : 'w-0'}`} />
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Hash size={16} className="text-primary-500" />
                {t('dice.number_of_dice')}
              </label>
              <div className="flex items-center space-x-4 bg-slate-950/50 p-2 rounded-xl border border-slate-800">
                <button 
                  onClick={() => updateConfig({ count: Math.max(1, diceConfig.count - 1) })}
                  className="w-10 h-10 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-400 transition-colors"
                >
                  <Minus size={20} />
                </button>
                <span className="text-xl font-bold w-12 text-center text-white italic">{diceConfig.count}</span>
                <button 
                  onClick={() => updateConfig({ count: Math.min(99, diceConfig.count + 1) })}
                  className="w-10 h-10 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-400 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm border-2 border-primary-500 flex items-center justify-center text-[10px] text-primary-500 font-bold">+</div>
                {t('dice.modifier')}
              </label>
              <div className="flex items-center space-x-4 bg-slate-950/50 p-2 rounded-xl border border-slate-800">
                <button 
                  onClick={() => updateConfig({ modifier: diceConfig.modifier - 1 })}
                  className="w-10 h-10 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-400 transition-colors"
                >
                  <Minus size={20} />
                </button>
                <span className={`text-xl font-bold w-12 text-center italic ${diceConfig.modifier > 0 ? 'text-primary-400' : diceConfig.modifier < 0 ? 'text-rose-400' : 'text-white'}`}>
                  {diceConfig.modifier > 0 ? `+${diceConfig.modifier}` : diceConfig.modifier}
                </span>
                <button 
                  onClick={() => updateConfig({ modifier: diceConfig.modifier + 1 })}
                  className="w-10 h-10 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-400 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            <Button 
               size="lg" 
               className="w-full h-20 text-2xl font-black uppercase italic tracking-tighter"
               onClick={() => handleRoll()}
               disabled={isRolling}
            >
              {isRolling ? (
                <div className="flex gap-1">
                   <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 0.4 }} className="w-2 h-2 bg-white rounded-full" />
                   <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 0.4, delay: 0.1 }} className="w-2 h-2 bg-white rounded-full" />
                   <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 0.4, delay: 0.2 }} className="w-2 h-2 bg-white rounded-full" />
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Dice6 size={28} />
                  {t('dice.roll')}
                </div>
              )}
            </Button>
          </Card>

          <div className="flex flex-col gap-6">
             <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Zap size={14} className="text-amber-500" />
                {t('dice.presets.title')}
             </h3>
             <div className="grid grid-cols-1 gap-3">
                {quickPresets.map(({ id, icon: Icon, label, config }) => (
                  <button
                    key={id}
                    onClick={() => handleRoll(config)}
                    className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-primary-500/50 hover:bg-slate-800/80 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary-500/10 group-hover:text-primary-500 transition-colors">
                        <Icon size={18} />
                      </div>
                      <span className="font-bold text-slate-300 group-hover:text-white transition-colors">{label}</span>
                    </div>
                    <div className="text-xs font-black text-slate-500 uppercase tracking-widest">{config.count}d{config.dieType} {config.modifier >= 0 ? '+' : ''}{config.modifier}</div>
                  </button>
                ))}
             </div>
          </div>
        </section>

        {/* Big Result Area */}
        <AnimatePresence mode="wait">
          {lastRoll && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative p-1 rounded-3xl bg-gradient-to-br from-primary-500 to-amber-600 shadow-2xl shadow-primary-500/20"
            >
              <div className="bg-slate-950/95 backdrop-blur-xl rounded-[22px] overflow-hidden">
                <div className="p-8 flex flex-col items-center text-center">
                   <div className="text-slate-500 text-sm font-black uppercase tracking-widest mb-2 italic">
                     {lastRoll.diceConfig.count}d{lastRoll.diceConfig.dieType} 
                     {lastRoll.diceConfig.modifier !== 0 && (lastRoll.diceConfig.modifier > 0 ? ` + ${lastRoll.diceConfig.modifier}` : ` - ${Math.abs(lastRoll.diceConfig.modifier)}`)}
                   </div>
                   
                   <motion.div 
                    key={lastRoll.id}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-[120px] font-black text-white italic tracking-tighter leading-none mb-4 drop-shadow-[0_0_15px_rgba(242,129,33,0.3)]"
                   >
                     {lastRoll.total}
                   </motion.div>

                   <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                      {lastRoll.individual.map((val, i) => (
                        <div key={i} className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 font-bold text-sm italic">
                          {val}
                        </div>
                      ))}
                      {lastRoll.diceConfig.modifier !== 0 && (
                        <div className="w-10 h-10 rounded-lg bg-primary-500/10 border border-primary-500/30 flex items-center justify-center text-primary-500 font-black text-sm italic">
                          {lastRoll.diceConfig.modifier > 0 ? `+${lastRoll.diceConfig.modifier}` : lastRoll.diceConfig.modifier}
                        </div>
                      )}
                   </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* History Panel */}
      <div className="lg:col-span-4 space-y-6">
        <Card className="flex flex-col h-[calc(100vh-250px)] min-h-[500px]">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
             <h2 className="text-lg font-black text-white italic tracking-tighter uppercase flex items-center gap-2">
                <Clock size={18} className="text-primary-500" />
                {t('dice.history')}
             </h2>
             <button 
              onClick={() => dispatch(clearHistory())}
              className="p-2 text-slate-500 hover:text-rose-500 transition-colors"
              title={t('dice.clear_history')}
             >
                <Trash2 size={18} />
             </button>
          </div>

          <div className="flex-grow overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-600 italic">
                <Dice6 size={48} className="opacity-20 mb-4" />
                {t('dice.no_history')}
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {history.map((roll) => (
                  <motion.div 
                    key={roll.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-slate-700 transition-all flex items-center justify-between group"
                  >
                     <div className="flex flex-col gap-1">
                        <div className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                           <span>{roll.diceConfig.count}d{roll.diceConfig.dieType}</span>
                           <span className="opacity-30">•</span>
                           <span>{roll.timestamp}</span>
                        </div>
                        <div className="flex gap-1 flex-wrap">
                          {roll.individual.map((v, i) => (
                            <span key={i} className="text-[10px] bg-slate-800 px-1 rounded text-slate-500">{v}</span>
                          ))}
                        </div>
                     </div>
                     <div className="text-2xl font-black text-white italic group-hover:text-primary-500 transition-colors drop-shadow-sm">
                        {roll.total}
                     </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default DiceRoller
