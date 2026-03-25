import Navbar from './Navbar'
import Footer from './Footer'
import FloatingDicePanel from '../dice/FloatingDicePanel'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'

const Layout = ({ children }) => {
  const location = useLocation()

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-primary-500/30 selection:text-primary-500 font-sans antialiased overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 blur-[130px] rounded-full opacity-30 animate-pulse animate-infinite" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/5 blur-[130px] rounded-full opacity-20" />
      </div>

      <Navbar />

      <main className="flex-grow flex flex-col items-center justify-start max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 md:py-16 gap-16 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -15, filter: 'blur(10px)' }}
            transition={{ 
              duration: 0.5, 
              ease: [0.19, 1, 0.22, 1] 
            }}
            className="w-full h-full flex flex-col"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <FloatingDicePanel />

      <Footer />
    </div>
  )
}

export default Layout
