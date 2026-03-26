import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCombatant } from '../../features/initiative/initiativeSlice';
import { addNotification } from '../../features/notifications/notificationsSlice';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { useTranslation } from 'react-i18next';

const AddCombatantModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const participants = useSelector(state => state.session.participants);
  const activeSystemId = useSelector(state => state.gameConfig.activeSystemId);
  const configs = useSelector(state => state.gameConfig.configs);
  const activeSystem = configs[activeSystemId];

  const [formData, setFormData] = useState({
    name: '',
    type: 'npc',
    participantId: null,
    initiative: 10,
    isHidden: false,
    notes: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const defaultActions = activeSystem?.turnSystem?.defaultActionsPerTurn || 3;

    const combatantData = {
      ...formData,
      actions: { current: defaultActions, max: defaultActions },
      roleOwner: formData.participantId ? participants.find(p => p.id === formData.participantId)?.role : 'npc'
    };

    dispatch(addCombatant(combatantData));
    dispatch(addNotification({
      type: 'combatant_added',
      message: t('initiative.added_msg', { name: formData.name }),
      actorName: formData.name,
      actorRole: combatantData.roleOwner
    }));

    onClose();
    setFormData({
      name: '',
      type: 'npc',
      participantId: null,
      initiative: 10,
      isHidden: false,
      notes: '',
    });
  };

  const footer = (
    <>
      <button onClick={onClose} className="px-6 py-2 text-sm font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest italic">
        {t('common.cancel', 'Cancel')}
      </button>
      <Button onClick={handleSubmit} disabled={!formData.name.trim()}>
        {t('initiative.add_combatant', 'Add Combatant')}
      </Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('initiative.add_combatant', 'Add Combatant')} footer={footer}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest italic mb-1">{t('common.name', 'Name')}</label>
          <input
            type="text"
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none transition-all italic font-medium"
            placeholder={t('session.placeholder_admin', 'Character Name')}
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest italic mb-1">{t('initiative.type', 'Type')}</label>
            <select
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none transition-all font-bold appearance-none"
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="player-character">{t('initiative.types.player-character', 'Character')}</option>
              <option value="npc">{t('initiative.types.npc', 'NPC')}</option>
              <option value="enemy">{t('initiative.types.enemy', 'Enemy')}</option>
              <option value="summon">{t('initiative.types.summon', 'Summon')}</option>
              <option value="custom">{t('initiative.types.custom', 'Custom')}</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest italic mb-1">{t('initiative.value', 'Initiative')}</label>
            <input
              type="number"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none transition-all text-center font-bold"
              value={formData.initiative}
              onChange={e => setFormData({ ...formData, initiative: parseInt(e.target.value) || 0 })}
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest italic mb-1">{t('session.participants', 'Owner (Participant)')}</label>
          <select
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none transition-all font-bold appearance-none"
            value={formData.participantId || ''}
            onChange={e => setFormData({ ...formData, participantId: e.target.value || null })}
          >
            <option value="">{t('initiative.no_participant', 'No Participant (NPC/Monster)')}</option>
            {participants.map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.role})</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
           <input
            type="checkbox"
            id="isHidden"
            className="w-5 h-5 accent-amber-500 cursor-pointer"
            checked={formData.isHidden}
            onChange={e => setFormData({ ...formData, isHidden: e.target.checked })}
          />
          <label htmlFor="isHidden" className="text-sm font-bold text-slate-300 cursor-pointer flex flex-col">
            {t('initiative.hidden', 'Hidden Combatant')}
            <span className="text-[10px] text-slate-600 uppercase font-black italic">{t('initiative.gm_only_note', 'Only visible to GM mode')}</span>
          </label>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest italic mb-1">{t('common.notes', 'Notes')}</label>
          <textarea
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none transition-all italic font-medium h-24 resize-none"
            placeholder={t('initiative.placeholder_notes', 'Abilities, conditions, etc.')}
            value={formData.notes}
            onChange={e => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>
      </form>
    </Modal>
  );
};

export default AddCombatantModal;
