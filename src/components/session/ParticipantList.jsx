import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateParticipantRole, addParticipant } from '../../features/session/sessionSlice';
import { useTranslation } from 'react-i18next';
import { Crown, Wand2, User, UserPlus, ShieldPlus } from 'lucide-react';

const ParticipantList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const participants = useSelector(state => state.session.participants);
  const currentSession = useSelector(state => state.session.currentSession);
  const activeParticipantId = useSelector(state => state.session.activeParticipantId);
  
  const [newPlayerName, setNewPlayerName] = useState('');

  const isAdmin = participants.find(p => p.id === activeParticipantId)?.role === 'admin';

  const handleAddPlayer = (e) => {
    e.preventDefault();
    if (!newPlayerName.trim()) return;
    dispatch(addParticipant({ name: newPlayerName.trim(), role: 'player' }));
    setNewPlayerName('');
  };

  const roles = [
    { id: 'admin', label: t('roles.admin', 'Admin') },
    { id: 'gm', label: t('roles.gm', 'GM') },
    { id: 'player', label: t('roles.player', 'Player') },
  ];

  return (
    <div className="bg-slate-900 shadow-xl rounded-xl border border-slate-800 overflow-hidden">
      <div className="p-4 bg-slate-800/50 border-b border-slate-700 flex justify-between items-center">
        <h3 className="font-bold text-slate-200 flex items-center gap-2">
          <span className="material-icons-round text-amber-500">People</span>
          {t('session.participants', 'Participants')}
        </h3>
        <span className="text-xs bg-slate-700 px-2 py-1 rounded-full text-slate-400">
          {participants.length} / {currentSession?.maxParticipants}
        </span>
      </div>

      <div className="divide-y divide-slate-800/50 max-h-[300px] overflow-y-auto thin-scrollbar">
        {participants.map(participant => {
          const isGM = participant.role === 'gm';
          const isOwner = participant.role === 'admin';
          const isActive = participant.id === activeParticipantId;

          return (
            <div key={participant.id} className={`p-4 flex items-center justify-between group transition-colors ${isActive ? 'bg-primary-500/5' : 'hover:bg-slate-800/30'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-bold relative transition-transform group-hover:scale-105 ${
                  isOwner ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/20' : 
                  isGM ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-slate-900 shadow-lg shadow-amber-500/20' : 
                  'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  {isOwner ? <Crown size={18} /> : isGM ? <Wand2 size={18} /> : <User size={18} />}
                  
                  {isActive && (
                    <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900 shadow-sm" />
                  )}
                </div>
                
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white italic uppercase tracking-tight leading-none">
                      {participant.name}
                    </span>
                    {isActive && (
                      <span className="text-[8px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-full uppercase tracking-widest italic">
                        {t('common.you', 'You')}
                      </span>
                    )}
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-[0.2em] mt-1.5 italic ${
                    isOwner ? 'text-purple-400' : isGM ? 'text-amber-500' : 'text-slate-500'
                  }`}>
                    {participant.role}
                  </span>
                </div>
              </div>

              {isAdmin && participant.id !== activeParticipantId && (
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <select
                    className="bg-slate-950 text-[10px] border border-slate-800 text-slate-400 rounded-xl px-2 py-1 focus:outline-none focus:border-primary-500 transition-all cursor-pointer font-black uppercase tracking-widest"
                    value={participant.role}
                    onChange={(e) => dispatch(updateParticipantRole({ id: participant.id, role: e.target.value }))}
                  >
                    {roles.map(role => (
                      <option key={role.id} value={role.id}>{role.label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isAdmin && participants.length < currentSession?.maxParticipants && (
        <form onSubmit={handleAddPlayer} className="p-4 bg-slate-950/30 border-t border-slate-800/50 flex gap-2">
          <div className="relative flex-1">
             <UserPlus size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
             <input
               type="text"
               className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 transition-all font-bold italic"
               placeholder={t('session.add_player', 'New player...')}
               value={newPlayerName}
               onChange={e => setNewPlayerName(e.target.value)}
             />
          </div>
          <button
            type="submit"
            className="bg-primary-500 hover:bg-primary-400 text-slate-900 p-2 rounded-xl transition-all shadow-lg shadow-primary-500/20 active:scale-95"
          >
            <ShieldPlus size={18} />
          </button>
        </form>
      )}
    </div>
  );
};

export default ParticipantList;
