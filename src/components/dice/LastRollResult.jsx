import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { getDiceImageSrc } from '../../utils/diceAssets';
import { Sparkles, AlertCircle } from 'lucide-react';

const LastRollResult = () => {
  const { t } = useTranslation();
  const lastRoll = useSelector((state) => state.history.lastRoll);
  const settings = useSelector((state) => state.settings);

  if (!lastRoll) {
    return (
      <div className="bg-slate-900 shadow-xl rounded-2xl border border-slate-800 p-8 flex flex-col items-center justify-center text-center space-y-4 opacity-50 grayscale">
         <div className="w-16 h-16 rounded-3xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-700">
            <Sparkles size={32} />
         </div>
         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{t('dice.no_history', 'No rolls yet')}</p>
      </div>
    );
  }

  const isCrit = lastRoll.diceType === 20 && lastRoll.rawResults.includes(20);
  const isFumble = lastRoll.diceType === 20 && lastRoll.rawResults.includes(1);
  const diceSum = lastRoll.rawResults.reduce((a, b) => a + b, 0);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={lastRoll.id}
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 1.1, y: -10 }}
        className={`bg-slate-900 shadow-2xl rounded-2xl border-2 overflow-hidden relative group ${
          isCrit ? 'border-emerald-500 shadow-emerald-500/20' : 
          isFumble ? 'border-rose-500 shadow-rose-500/20' : 'border-slate-800'
        }`}
      >
        {/* Background glow for crits */}
        {(isCrit || isFumble) && (
          <div className={`absolute inset-0 blur-3xl opacity-10 animate-pulse pointer-events-none ${isCrit ? 'bg-emerald-500' : 'bg-rose-500'}`} />
        )}

        <div className="p-1.5 bg-slate-950 flex items-center justify-between border-b border-slate-800">
           <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest italic ml-2">
             {t('dice.last_roll', 'Latest Roll')}
           </span>
           <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
             lastRoll.actorRole === 'admin' ? 'bg-amber-500 text-slate-900' : 
             lastRoll.actorRole === 'gm' ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-400'
           }`}>
             {lastRoll.actorName}
           </div>
        </div>

        <div className="p-6 flex flex-col items-center text-center">
            <div className="flex items-end gap-3 mb-6">
                <div className="flex flex-col">
                  <div className="text-6xl font-black text-white italic tracking-tighter drop-shadow-2xl flex items-baseline gap-2">
                     {lastRoll.total}
                      {lastRoll.modifier !== 0 && (
                        <div className="flex flex-col -mb-2 ml-4 border-l-2 border-slate-800/50 pl-4 items-start">
                           <span className="text-2xl text-amber-500 font-black italic leading-none">
                              {diceSum}
                           </span>
                           <span className="text-xl text-slate-500 font-bold italic leading-none mt-1">
                              {lastRoll.modifier > 0 ? '+' : ''}{lastRoll.modifier}
                           </span>
                        </div>
                      )}
                  </div>
                </div>
                {isCrit && <Sparkles className="text-emerald-400 animate-bounce mb-2" size={32} />}
                {isFumble && <AlertCircle className="text-rose-400 animate-bounce mb-2" size={32} />}
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-6">
               {lastRoll.rawResults.map((v, i) => (
                 <div key={i} className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm relative ${
                   lastRoll.diceType === 20 && v === 20 ? 'bg-emerald-500 text-white shadow-lg' :
                   lastRoll.diceType === 20 && v === 1 ? 'bg-rose-500 text-white shadow-lg' :
                   'bg-slate-950 text-slate-400 border border-slate-800'
                 }`}>
                    {v}
                    <img 
                      src={getDiceImageSrc(lastRoll.diceType)} 
                      alt="" 
                      className="absolute inset-0 w-full h-full object-contain opacity-10 pointer-events-none p-1.5"
                    />
                 </div>
               ))}
            </div>

            <div className="flex items-center gap-3 w-full pt-4 border-t border-slate-800/50">
               <div className="flex-1 flex flex-col items-start">
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest italic">{t('dice.formula', 'Formula')}</span>
                  <span className="font-bold text-slate-300 italic">{lastRoll.quantity}d{lastRoll.diceType}{lastRoll.modifier !== 0 ? (lastRoll.modifier > 0 ? ' + ' + lastRoll.modifier : ' - ' + Math.abs(lastRoll.modifier)) : ''}</span>
               </div>
               <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center transform rotate-12 group-hover:rotate-0 transition-transform">
                  <img src={getDiceImageSrc(lastRoll.diceType)} alt="" className="w-6 h-6 object-contain" />
               </div>
            </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LastRollResult;
