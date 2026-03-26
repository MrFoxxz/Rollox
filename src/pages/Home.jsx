import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Dice6, ShieldAlert, Sparkles, LayoutDashboard, ScrollText, Users, MapPin, EyeOff } from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { motion } from 'framer-motion'

const Home = () => {
  const { t } = useTranslation()

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  return (
    <div className="flex flex-col gap-24">
      {/* Hero Section */}
      <section className="text-center flex flex-col items-center">
        <motion.div 
          {...fadeIn}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 text-primary-400 rounded-full text-sm font-semibold mb-8 uppercase tracking-widest"
        >
          <Sparkles size={16} />
          <span>{t('home.beta_badge')}</span>
        </motion.div>
        
        <motion.h1 
          className="text-5xl md:text-7xl font-black text-white italic tracking-tighter mb-6 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {t('home.hero_title')}
        </motion.h1>

        <motion.p 
          className="text-slate-400 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {t('home.hero_subtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <Link to="/dice">
            <Button size="lg" className="shadow-2xl shadow-primary-500/30 group">
              <Dice6 size={20} className="mr-2 group-hover:rotate-[360deg] transition-transform duration-700" />
              {t('home.cta_dice')}
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Perspectives Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        <Card 
          className="border-primary-500/10 group cursor-pointer hover:border-primary-500/30 active:scale-[0.99] transition-all"
          title={t('home.player_section.title')}
          subtitle={t('home.player_section.desc')}
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-3">
              {(Array.isArray(t('home.player_feature_tags', { returnObjects: true }))
                ? t('home.player_feature_tags', { returnObjects: true })
                : []
              ).map((item) => (
                <span key={item} className="px-3 py-1 bg-slate-800 text-slate-400 rounded-lg text-xs font-semibold group-hover:text-primary-400 group-hover:bg-primary-500/5 transition-colors border border-transparent group-hover:border-primary-500/20 capitalize lowercase tracking-tight italic">{item}</span>
              ))}
            </div>
            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="w-1/3 h-full bg-primary-500 group-hover:w-full transition-all duration-1000" />
            </div>
          </div>
        </Card>

        <Card 
          className="border-amber-500/10 group cursor-pointer hover:border-amber-500/30 active:scale-[0.99] transition-all"
          title={t('home.gm_section.title')}
          subtitle={t('home.gm_section.desc')}
        >
          <div className="flex flex-col gap-6">
             <div className="flex flex-wrap gap-3">
              {(Array.isArray(t('home.gm_feature_tags', { returnObjects: true }))
                ? t('home.gm_feature_tags', { returnObjects: true })
                : []
              ).map((item) => (
                <span key={item} className="px-3 py-1 bg-slate-800 text-slate-400 rounded-lg text-xs font-semibold group-hover:text-amber-400 group-hover:bg-amber-500/5 transition-colors border border-transparent group-hover:border-amber-500/20 capitalize lowercase tracking-tight italic">{item}</span>
              ))}
            </div>
            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="w-1/4 h-full bg-amber-500 group-hover:w-full transition-all duration-1000" />
            </div>
          </div>
        </Card>
      </section>

      {/* Feature Preview Section */}
      <section className="flex flex-col items-center">
        <div className="flex items-center space-x-4 mb-12">
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-slate-800" />
          <h2 className="text-3xl font-bold text-white tracking-widest uppercase italic">{t('home.features_preview')}</h2>
          <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-slate-800" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 w-full">
          {[
            { icon: LayoutDashboard, labelKey: 'home.preview.dashboard' },
            { icon: Users, labelKey: 'home.preview.npcs' },
            { icon: ScrollText, labelKey: 'home.preview.notes' },
            { icon: ShieldAlert, labelKey: 'home.preview.encounter' },
            { icon: MapPin, labelKey: 'home.preview.maps' },
            { icon: EyeOff, labelKey: 'home.preview.secrets' }
          ].map(({ icon: Icon, labelKey }, idx) => (
            <motion.div
              key={labelKey}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-slate-900/30 border border-slate-800/50 hover:bg-slate-800/50 transition-colors group cursor-not-allowed grayscale hover:grayscale-0 relative"
            >
               <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500 group-hover:text-primary-500 group-hover:bg-primary-500/10 transition-all">
                <Icon size={24} />
              </div>
              <span className="text-xs font-bold text-slate-600 group-hover:text-slate-400 uppercase tracking-widest">{t(labelKey)}</span>
              <div className="absolute top-2 right-2 text-[10px] font-black text-slate-700 uppercase tracking-[0.2em]">{t('common.coming_soon')}</div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
