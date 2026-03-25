import { motion } from 'framer-motion'

const Button = ({ children, onClick, className = '', variant = 'primary', size = 'md', ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/50 disabled:opacity-50 disabled:cursor-not-allowed select-none'
  
  const variants = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700',
    secondary: 'bg-slate-800 text-slate-100 hover:bg-slate-700 active:bg-slate-600 border border-slate-700',
    ghost: 'bg-transparent text-slate-400 hover:text-white hover:bg-slate-800',
    outline: 'bg-transparent border-2 border-primary-500 text-primary-500 hover:bg-primary-500/10'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg'
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export default Button
