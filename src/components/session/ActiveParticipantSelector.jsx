import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveParticipant } from '../../features/session/sessionSlice';
import { useTranslation } from 'react-i18next';
import { ChevronDown, CheckCircle } from 'lucide-react';

const ActiveParticipantSelector = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const participants = useSelector(state => state.session.participants);
  const activeParticipantId = useSelector(state => state.session.activeParticipantId);
  const [isOpen, setIsOpen] = useState(false);

  const activeParticipant = participants.find(p => p.id === activeParticipantId);

  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 bg-slate-800/80 hover:bg-slate-800 backdrop-blur-sm px-4 py-2 rounded-full border transition-all cursor-pointer ${isOpen ? 'border-amber-500 shadow-lg shadow-amber-500/10' : 'border-slate-700'}`}
      >
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${
          activeParticipant?.role === 'admin' ? 'bg-amber-500 text-slate-900' : 
          activeParticipant?.role === 'gm' ? 'bg-purple-500 text-white' : 'bg-slate-700 text-slate-300'
        }`}>
          {activeParticipant?.name.charAt(0).toUpperCase() || '?'}
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest leading-none mb-0.5">
            {t('session.playing_as', 'Playing as')}
          </span>
          <span className="text-sm font-bold text-slate-200 leading-none">
            {activeParticipant?.name || t('session.select_player', 'Select Player')}
          </span>
        </div>
        <ChevronDown size={18} className={`text-slate-500 transition-transform ${isOpen ? 'rotate-180 text-amber-500' : ''}`} />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[40]" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full right-0 mt-2 w-56 bg-slate-900 border-2 border-slate-800 rounded-2xl shadow-2xl z-[50] overflow-hidden transform origin-top animate-in fade-in zoom-in-95 duration-200">
            <div className="p-2 space-y-1">
              <div className="px-3 py-2 border-b border-slate-800/50 mb-1">
                 <p className="text-[8px] font-black uppercase text-slate-600 tracking-widest italic">{t('session.select_player')}</p>
              </div>
              {participants.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    dispatch(setActiveParticipant(p.id));
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    p.id === activeParticipantId ? 'bg-amber-500/20 text-amber-500' : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                    p.role === 'admin' ? 'bg-amber-500 text-slate-900' : 
                    p.role === 'gm' ? 'bg-purple-500 text-white' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold leading-tight">{p.name}</span>
                    <span className="text-[8px] font-black uppercase tracking-widest opacity-50">{p.role === 'admin' ? 'Master FOX' : p.role}</span>
                  </div>
                  {p.id === activeParticipantId && (
                    <CheckCircle size={16} className="ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ActiveParticipantSelector;
