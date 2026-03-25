import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Dice6, Users, ScrollText, ShieldAlert, MapPin, EyeOff, LayoutDashboard, Database, Swords, Wand, Package, NotebookPen, UserRoundSearch, ShieldCheck } from 'lucide-react'
import Card from '../components/ui/Card'
import { motion } from 'framer-motion'

const Toolkit = () => {
  const { t } = useTranslation()

  const playerTools = [
    { icon: Dice6, label: 'dice.title', active: true, to: '/dice' },
    { icon: Swords, label: 'dice.presets.attack', active: false },
    { icon: NotebookPen, label: 'toolkit.notes', active: false },
    { icon: UserRoundSearch, label: 'toolkit.character_summary', active: false },
    { icon: ShieldCheck, label: 'common.player', active: false },
    { icon: Package, label: 'Inventory', active: false }
  ]

  const gmTools = [
    { icon: LayoutDashboard, label: 'GM Dashboard', active: false },
    { icon: ShieldAlert, label: 'toolkit.encounter_tracker', active: false },
    { icon: EyeOff, label: 'Hidden Rolls', active: false },
    { icon: Users, label: 'toolkit.npc_manager', active: false },
    { icon: MapPin, label: 'Maps Explorer', active: false },
    { icon: Database, label: 'Bestiary', active: false }
  ]

  const ToolCard = ({ icon: Icon, label, active, to, delay }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      <Link 
        to={active && to ? to : '#'} 
        onClick={(e) => !active && e.preventDefault()}
        className={`group flex flex-col items-center justify-center p-8 rounded-3xl border transition-all h-full ${
          active 
            ? 'bg-slate-900 border-primary-500/20 hover:border-primary-500/50 hover:bg-primary-500/5 active:scale-95' 
            : 'bg-slate-900/30 border-slate-800/50 grayscale opacity-60 cursor-not-allowed'
        }`}
      >
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all ${
          active 
            ? 'bg-primary-500 text-white shadow-xl shadow-primary-500/20 group-hover:scale-110' 
            : 'bg-slate-800 text-slate-500'
        }`}>
          <Icon size={32} />
        </div>
        <span className={`text-sm font-black italic uppercase tracking-widest text-center ${active ? 'text-white' : 'text-slate-600'}`}>
          {label.includes('.') ? t(label) : label}
        </span>
        {!active && (
          <div className="mt-4 px-3 py-1 bg-slate-800 rounded-full text-[10px] font-black text-rose-500 uppercase tracking-widest italic">{t('common.coming_soon')}</div>
        )}
      </Link>
    </motion.div>
  )

  return (
    <div className="flex flex-col gap-24">
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
    </div>
  )
}

export default Toolkit
