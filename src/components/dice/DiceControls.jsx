import { Minus, Plus, Hash } from 'lucide-react'

const DIE_TYPES = [4, 6, 8, 10, 12, 20, 100]

const DiceControls = ({ config, updateConfig }) => {
  return (
    <div className="flex flex-col gap-5">
      {/* Dice Grid */}
      <div className="grid grid-cols-4 gap-2">
        {DIE_TYPES.map(type => (
          <button
            key={type}
            onClick={() => updateConfig({ dieType: type })}
            className={`py-2 px-1 rounded-lg border text-sm font-black italic transition-all ${
              config.dieType === type 
                ? 'border-primary-500 bg-primary-500/20 text-primary-400' 
                : 'border-slate-800 bg-slate-900/50 text-slate-500 hover:border-slate-700 hover:text-slate-300'
            }`}
          >
            d{type}
          </button>
        ))}
      </div>

      {/* Quantity & Modifier */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
             <Hash size={10} className="text-primary-500" />
             Count
           </label>
           <div className="flex items-center justify-between bg-slate-950/50 border border-slate-800 p-1.5 rounded-xl">
             <button 
              onClick={() => updateConfig({ count: Math.max(1, config.count - 1) })}
              className="w-7 h-7 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-white transition-colors"
             >
               <Minus size={14} />
             </button>
             <span className="text-sm font-black text-white italic">{config.count}</span>
             <button 
              onClick={() => updateConfig({ count: Math.min(99, config.count + 1) })}
              className="w-7 h-7 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-white transition-colors"
             >
               <Plus size={14} />
             </button>
           </div>
        </div>

        <div className="flex flex-col gap-2">
           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
             <div className="w-2.5 h-2.5 rounded-sm border-[1.5px] border-primary-500 flex items-center justify-center text-[7px] text-primary-500 font-bold">+</div>
             Mod
           </label>
           <div className="flex items-center justify-between bg-slate-950/50 border border-slate-800 p-1.5 rounded-xl">
             <button 
              onClick={() => updateConfig({ modifier: config.modifier - 1 })}
              className="w-7 h-7 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-white transition-colors"
             >
               <Minus size={14} />
             </button>
             <span className={`text-sm font-black italic ${config.modifier > 0 ? 'text-primary-400' : config.modifier < 0 ? 'text-rose-400' : 'text-slate-200'}`}>
               {config.modifier > 0 ? `+${config.modifier}` : config.modifier}
             </span>
             <button 
              onClick={() => updateConfig({ modifier: config.modifier + 1 })}
              className="w-7 h-7 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-white transition-colors"
             >
               <Plus size={14} />
             </button>
           </div>
        </div>
      </div>
    </div>
  )
}

export default DiceControls
