import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { Dice6, Users, ScrollText, ShieldAlert, MapPin, EyeOff, LayoutDashboard, Database, Swords, Wand, Package, NotebookPen, UserRoundSearch, ShieldCheck, ChevronLeft } from 'lucide-react'
import Card from '../components/ui/Card'
import { motion, AnimatePresence } from 'framer-motion'
import NotesPanel from '../components/notes/NotesPanel'

const Toolkit = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState('grid') // 'grid' | 'notes'

  useEffect(() => {
    if (location.state?.openNotes) {
      setActiveTab('notes')
    }
  }, [location.state])

  const playerTools = [
    { id: 'dice', icon: Dice6, label: 'dice.title', active: true, to: '/dice' },
    { id: 'notes', icon: NotebookPen, label: 'toolkit.notes', active: true, onClick: () => setActiveTab('notes') },
    { id: 'attack', icon: Swords, label: 'dice.presets.attack', active: false },
    { id: 'summary', icon: UserRoundSearch, label: 'toolkit.character_summary', active: false },
    { id: 'player', icon: ShieldCheck, label: 'common.player', active: false },
    { id: 'inventory', icon: Package, label: 'toolkit.inventory', active: false }
  ]

  const gmTools = [
    { icon: LayoutDashboard, label: 'toolkit.gm_dashboard', active: false },
    { icon: ShieldAlert, label: 'toolkit.encounter_tracker', active: false },
    { icon: EyeOff, label: 'toolkit.hidden_rolls', active: false },
    { icon: Users, label: 'toolkit.npc_manager', active: false },
    { icon: MapPin, label: 'toolkit.maps_explorer', active: false },
    { icon: Database, label: 'toolkit.bestiary', active: false }
  ]

  const ToolCard = ({ icon: Icon, label, active, to, onClick, delay }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      <div 
        onClick={(e) => {
          if (!active) return e.preventDefault()
          if (onClick) onClick()
        }}
        className={`group flex flex-col items-center justify-center p-8 rounded-3xl border transition-all h-full cursor-pointer ${
          active 
            ? 'bg-slate-900 border-primary-500/20 hover:border-primary-500/50 hover:bg-primary-500/5 active:scale-95' 
            : 'bg-slate-900/30 border-slate-800/50 grayscale opacity-60 cursor-not-allowed'
        }`}
      >
        {to && active ? (
          <Link to={to} className="flex flex-col items-center w-full">
            <ToolIcon Icon={Icon} active={active} />
            <ToolLabel label={label} active={active} t={t} />
          </Link>
        ) : (
          <>
            <ToolIcon Icon={Icon} active={active} />
            <ToolLabel label={label} active={active} t={t} />
            {!active && (
              <div className="mt-4 px-3 py-1 bg-slate-800 rounded-full text-[10px] font-black text-rose-500 uppercase tracking-widest italic">{t('common.coming_soon')}</div>
            )}
          </>
        )}
      </div>
    </motion.div>
  )

  const ToolIcon = ({ Icon, active }) => (
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all ${
      active 
        ? 'bg-primary-500 text-white shadow-xl shadow-primary-500/20 group-hover:scale-110' 
        : 'bg-slate-800 text-slate-500'
    }`}>
      <Icon size={32} />
    </div>
  )

  const ToolLabel = ({ label, active, t }) => (
    <span className={`text-sm font-black italic uppercase tracking-widest text-center ${active ? 'text-white' : 'text-slate-600'}`}>
      {label.includes('.') ? t(label) : label}
    </span>
  )

  return (
    <div className="flex flex-col gap-12">
      <AnimatePresence mode="wait">
        {activeTab === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col gap-24"
          >
            <header className="flex flex-col gap-4">
              <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase">{t('toolkit.title')}</h1>
              <p className="text-slate-400 text-lg max-w-2xl">{t('home.hero_subtitle')}</p>
            </header>

            {/* Player Section */}
            <section className="flex flex-col gap-12">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-500">
                   <Swords size={20} />
                 </div>
                 <h2 className="text-3xl font-black text-white italic tracking-tight uppercase">{t('toolkit.player_tools')}</h2>
                 <div className="flex-grow h-[1px] bg-slate-800" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                 {playerTools.map((tool, idx) => (
                   <ToolCard key={idx} {...tool} delay={idx * 0.05} />
                 ))}
              </div>
            </section>

            {/* GM Section */}
            <section className="flex flex-col gap-12">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                   <Wand size={20} />
                 </div>
                 <h2 className="text-3xl font-black text-white italic tracking-tight uppercase">{t('toolkit.gm_tools')}</h2>
                 <div className="flex-grow h-[1px] bg-slate-800" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                 {gmTools.map((tool, idx) => (
                   <ToolCard key={idx} {...tool} delay={idx * 0.05} />
                 ))}
              </div>
            </section>
          </motion.div>
        ) : (
          <motion.div
            key="notes"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex flex-col gap-8"
          >
            <button 
              onClick={() => setActiveTab('grid')}
              className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors font-bold uppercase tracking-widest text-xs italic group"
            >
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              {t('common.back')}
            </button>
            <NotesPanel />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Toolkit

