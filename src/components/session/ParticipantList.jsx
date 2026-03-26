import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateParticipantRole, addParticipant } from '../../features/session/sessionSlice';
import { useTranslation } from 'react-i18next';

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

      <div className="divide-y divide-slate-800 max-h-60 overflow-y-auto">
        {participants.map(participant => (
          <div key={participant.id} className={`p-3 flex items-center justify-between group ${participant.id === activeParticipantId ? 'bg-amber-500/5' : ''}`}>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                participant.role === 'admin' ? 'bg-amber-500 text-slate-900' : 
                participant.role === 'gm' ? 'bg-purple-500 text-white' : 'bg-slate-700 text-slate-300'
              }`}>
                {participant.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200 flex items-center gap-2">
                  {participant.name}
                  {participant.id === activeParticipantId && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded uppercase font-bold tracking-tighter">
                      {t('common.you', 'You')}
                    </span>
                  )}
                </p>
                <p className="text-[11px] text-slate-500 uppercase tracking-wider">{participant.role}</p>
              </div>
            </div>

            {isAdmin && participant.id !== activeParticipantId && (
              <select
                className="bg-slate-800 text-[11px] border border-slate-700 text-slate-400 rounded px-1 py-0.5 focus:outline-none focus:border-amber-500"
                value={participant.role}
                onChange={(e) => dispatch(updateParticipantRole({ id: participant.id, role: e.target.value }))}
              >
                {roles.map(role => (
                  <option key={role.id} value={role.id}>{role.label}</option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>

      {isAdmin && participants.length < currentSession?.maxParticipants && (
        <form onSubmit={handleAddPlayer} className="p-3 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg py-1.5 px-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
            placeholder={t('session.add_player', 'New player...')}
            value={newPlayerName}
            onChange={e => setNewPlayerName(e.target.value)}
          />
          <button
            type="submit"
            className="bg-slate-700 hover:bg-slate-600 text-slate-200 p-1.5 rounded-lg transition-colors"
          >
            <span className="material-icons-round text-sm">person_add</span>
          </button>
        </form>
      )}
    </div>
  );
};

export default ParticipantList;
