import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSession } from '../../features/session/sessionSlice';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { useTranslation } from 'react-i18next';
import { Settings, Users, Sword } from 'lucide-react';

const ManageSessionModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const session = useSelector(state => state.session.currentSession);
  const configs = useSelector(state => state.gameConfig.configs);

  const [formData, setFormData] = useState({
    name: session?.name || '',
    gameSystem: session?.gameSystem || 'pathfinder_2e',
    maxParticipants: session?.maxParticipants || 6,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    dispatch(updateSession(formData));
    onClose();
  };

  const footer = (
    <>
      <button onClick={onClose} className="px-6 py-2 text-sm font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest italic">
        {t('common.cancel', 'Cancel')}
      </button>
      <Button onClick={handleSubmit} disabled={!formData.name.trim()}>
        {t('common.save', 'Save Changes')}
      </Button>
    </>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={t('session.manage_title', 'Session Settings')} 
      footer={footer}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic ml-1 flex items-center gap-2">
            <Settings size={12} className="text-amber-500" />
            {t('session.name', 'Session Name')}
          </label>
          <input
            type="text"
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-amber-500 outline-none transition-all placeholder:text-slate-700 font-bold italic"
            placeholder={t('session.placeholder_name', 'Campaign name...')}
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic ml-1 flex items-center gap-2">
              <Sword size={12} className="text-amber-500" />
              {t('session.game_system', 'Game System')}
            </label>
            <select
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-amber-500 outline-none transition-all font-bold appearance-none cursor-pointer"
              value={formData.gameSystem}
              onChange={e => setFormData({ ...formData, gameSystem: e.target.value })}
            >
              {Object.entries(configs).map(([id, config]) => (
                <option key={id} value={id}>{config.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic ml-1 flex items-center gap-2">
              <Users size={12} className="text-amber-500" />
              {t('session.max_participants', 'Max Participants')}
            </label>
            <div className="relative">
              <input
                type="number"
                min="2"
                max="12"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-amber-500 outline-none transition-all font-bold text-center"
                value={formData.maxParticipants}
                onChange={e => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) || 2 })}
              />
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
           <p className="text-[9px] text-amber-500/60 uppercase font-black italic tracking-widest text-center">
             Only the session administrator can modify these values. Changes will be reflected immediately for all local widgets.
           </p>
        </div>
      </form>
    </Modal>
  );
};

export default ManageSessionModal;
