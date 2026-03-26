import React from 'react';
import { useDispatch } from 'react-redux';
import { consumeAction, resetActions } from '../../features/initiative/initiativeSlice';
import { motion } from 'framer-motion';

const ActionCounter = ({ combatant, isActive }) => {
  const dispatch = useDispatch();
  const { current, max } = combatant.actions || { current: 3, max: 3 };

  const handleReset = () => {
    dispatch(resetActions({ id: combatant.id, amount: max }));
  };

  const handleConsume = () => {
    if (current > 0) {
      dispatch(consumeAction({ id: combatant.id, amount: 1 }));
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${isActive ? 'opacity-100' : 'opacity-60 grayscale-[0.5]'} transition-all`}>
      <div className="flex items-center gap-1">
        {Array.from({ length: max }).map((_, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={isActive ? handleConsume : null}
            disabled={!isActive}
            className={`w-4 h-5 rounded-md border-2 transition-all shadow-lg ${
              i < current 
                ? 'bg-amber-500 border-amber-400 shadow-amber-500/20' 
                : 'bg-slate-900 border-slate-800 text-slate-700'
            } flex items-center justify-center`}
          >
            {i < current && (
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-in fade-in zoom-in duration-300" />
            )}
          </motion.button>
        ))}
      </div>
      {isActive && (
        <button 
          onClick={handleReset}
          className="text-[8px] font-black text-amber-500 uppercase tracking-[0.2em] italic hover:text-amber-400 text-left"
        >
          Reset Actions
        </button>
      )}
    </div>
  );
};

export default ActionCounter;
