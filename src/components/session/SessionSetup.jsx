import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSession } from '../../features/session/sessionSlice';
import { addNotification } from '../../features/notifications/notificationsSlice';
import { useTranslation } from 'react-i18next';

const SessionSetup = ({ onComplete }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const availableSystems = useSelector(state => state.session.availableGameSystems);

  const [formData, setFormData] = useState({
    name: '',
    gameSystem: 'pathfinder',
    maxParticipants: 5,
    adminName: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.adminName) return;

    dispatch(createSession(formData));
    dispatch(addNotification({
      type: 'session_created',
      message: `Session "${formData.name}" created by ${formData.adminName}`,
      actorName: formData.adminName,
      actorRole: 'admin'
    }));

    if (onComplete) onComplete();
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-xl border border-amber-500/20 shadow-2xl max-w-md w-full mx-auto">
      <h2 className="text-2xl font-bold text-amber-500 mb-6 flex items-center gap-2">
        <span className="material-icons-round">Groups</span>
        {t('session.create_new', 'Create New Session')}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-slate-400 text-sm mb-1">{t('session.name', 'Session Name')}</label>
          <input
            type="text"
            required
            className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
            placeholder={t('session.placeholder_name', 'e.g. Shadow Campaign')}
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-slate-400 text-sm mb-1">{t('session.game_system', 'Game System')}</label>
          <select
            className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
            value={formData.gameSystem}
            onChange={e => setFormData({ ...formData, gameSystem: e.target.value })}
          >
            {availableSystems.map(system => (
              <option key={system.id} value={system.id}>{system.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-slate-400 text-sm mb-1">{t('session.your_name', 'Your Name (GM/Admin)')}</label>
          <input
            type="text"
            required
            className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
            placeholder={t('session.placeholder_admin', 'e.g. Master Fox')}
            value={formData.adminName}
            onChange={e => setFormData({ ...formData, adminName: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-slate-400 text-sm mb-1">{t('session.max_participants', 'Max Participants')}</label>
          <input
            type="number"
            min="1"
            max="20"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
            value={formData.maxParticipants}
            onChange={e => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-amber-900/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] mt-4"
        >
          {t('session.start_session', 'Start Session')}
        </button>
      </form>
    </div>
  );
};

export default SessionSetup;
