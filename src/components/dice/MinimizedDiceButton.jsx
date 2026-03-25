import { motion } from 'framer-motion'
import { Dice5 } from 'lucide-react'

const MinimizedDiceButton = ({ onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1, rotate: 180 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onClick}
      className="w-14 h-14 bg-primary-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary-500/30 border border-primary-400/50 group"
      aria-label="Open Dice Panel"
    >
      <Dice5 size={28} className="group-hover:text-white transition-colors" />
    </motion.button>
  )
}

export default MinimizedDiceButton
