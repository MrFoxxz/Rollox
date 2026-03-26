import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { getDiceImageSrc } from '../../utils/diceAssets'

const MinimizedDiceButton = ({ onClick }) => {
  const { t } = useTranslation()
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.1, rotate: 180 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onClick}
      className="w-14 h-14 bg-primary-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary-500/30 border border-primary-400/50 group p-2"
      aria-label={t('floating.open_panel')}
    >
      <img src={getDiceImageSrc(20)} alt="" className="w-9 h-9 object-contain drop-shadow-md" width={36} height={36} />
    </motion.button>
  )
}

export default MinimizedDiceButton
