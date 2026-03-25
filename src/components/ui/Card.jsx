const Card = ({ children, className = '', title, subtitle, footer, ...props }) => {
  return (
    <div 
      className={`bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden shadow-xl ${className}`}
      {...props}
    >
      {(title || subtitle) && (
        <div className="p-4 border-b border-slate-800">
          {title && <h3 className="text-xl font-bold text-white tracking-tight leading-none">{title}</h3>}
          {subtitle && <p className="text-slate-400 text-sm mt-1">{subtitle}</p>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 bg-slate-900/30 border-t border-slate-800">
          {footer}
        </div>
      )}
    </div>
  )
}

export default Card
