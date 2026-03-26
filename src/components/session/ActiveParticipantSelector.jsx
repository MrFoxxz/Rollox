import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveParticipant } from '../../features/session/sessionSlice';
import { useTranslation } from 'react-i18next';

const ActiveParticipantSelector = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const participants = useSelector(state => state.session.participants);
  const activeParticipantId = useSelector(state => state.session.activeParticipantId);

  const activeParticipant = participants.find(p => p.id === activeParticipantId);

  return (
    <div className="relative group">
      <div className="flex items-center gap-3 bg-slate-800/80 hover:bg-slate-800 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-700 transition-all cursor-pointer">
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
        <span className="material-icons-round text-slate-500 text-lg group-hover:text-amber-500 transition-colors">
          expand_more
        </span>
      </div>

      {/* Dropdown */}
      <div className="absolute top-full right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden transform origin-top translate-y-2 group-hover:translate-y-0">
        <div className="p-2 space-y-1">
          {participants.map(p => (
            <button
              key={p.id}
              onClick={() => dispatch(setActiveParticipant(p.id))}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${
                p.id === activeParticipantId ? 'bg-amber-500/10 text-amber-500' : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                p.role === 'admin' ? 'bg-amber-500 text-slate-900' : 
                p.role === 'gm' ? 'bg-purple-500 text-white' : 'bg-slate-700 text-slate-300'
              }`}>
                {p.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium">{p.name}</span>
              {p.id === activeParticipantId && (
                <span className="material-icons-round text-sm ml-auto">check_circle</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActiveParticipantSelector;
