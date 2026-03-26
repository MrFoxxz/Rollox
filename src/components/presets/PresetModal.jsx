import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { addCustomPreset, updateCustomPreset, updateSystemPreset } from '../../features/presets/presetsSlice'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { Hash, Swords, Wand, ShieldCheck, Zap, Activity } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const CATEGORIES = [
  { id: 'Attack', icon: Swords },
  { id: 'Damage', icon: Zap },
  { id: 'Skill', icon: Activity },
  { id: 'Save', icon: ShieldCheck },
  { id: 'Custom', icon: Wand },
]

const PresetModal = ({ isOpen, onClose, editingPreset = null }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    name: '',
    dice: 1,
    type: 20,
    modifier: 0,
    category: 'Custom'
  })

  useEffect(() => {
    if (editingPreset) {
      const isSystem = !editingPreset.id.startsWith('custom-')
      setFormData({
        name: isSystem
          ? (editingPreset.label ? t(editingPreset.label) : (editingPreset.name || ''))
          : (editingPreset.name || (editingPreset.label ? t(editingPreset.label) : '')),
        dice: editingPreset.dice || 1,
        type: editingPreset.type || 20,
        modifier: editingPreset.modifier ?? 0,
        category: editingPreset.category || 'Custom'
      })
    } else {
      setFormData({
        name: '',
        dice: 1,
        type: 20,
        modifier: 0,
        category: 'Custom'
      })
    }
  }, [editingPreset, isOpen, t])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingPreset) {
      if (editingPreset.id.startsWith('custom-')) {
        if (!formData.name?.trim()) return
        dispatch(updateCustomPreset({ id: editingPreset.id, updates: formData }))
      } else {
        dispatch(updateSystemPreset({
          id: editingPreset.id,
          updates: { dice: formData.dice, type: formData.type, modifier: formData.modifier },
        }))
      }
    } else {
      if (!formData.name?.trim()) return
      dispatch(addCustomPreset(formData))
    }
    onClose()
  }

  const footer = (
    <>
      <button 
        onClick={onClose}
        className="px-6 py-2 text-sm font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest italic"
      >
        {t('common.back')}
      </button>
      <Button
        onClick={handleSubmit}
        disabled={
          editingPreset && !editingPreset.id.startsWith('custom-')
            ? false
            : !formData.name?.trim()
        }
      >
        {t('presets.save_preset')}
      </Button>
    </>
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingPreset ? t('presets.edit_preset') : t('presets.new_preset')} footer={footer}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Name */}
        <div className="flex flex-col gap-2">
           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{t('presets.fields.name')}</label>
           <input 
            type="text" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder={t('presets.name_placeholder')}
            disabled={Boolean(editingPreset && !editingPreset.id.startsWith('custom-'))}
            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none transition-all italic font-medium disabled:opacity-60 disabled:cursor-not-allowed"
           />
        </div>

        {/* Dice Config */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{t('presets.fields.dice')}</label>
            <input 
              type="number" 
              value={formData.dice}
              min="1"
              max="99"
              onChange={(e) => setFormData({...formData, dice: parseInt(e.target.value) || 1})}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none transition-all text-center font-bold"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{t('presets.fields.type')}</label>
            <select 
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: parseInt(e.target.value)})}
              disabled={Boolean(editingPreset && !editingPreset.id.startsWith('custom-'))}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none transition-all font-bold appearance-none text-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {[4, 6, 8, 10, 12, 20, 100].map(t => <option key={t} value={t}>d{t}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{t('presets.fields.mod')}</label>
            <input 
              type="number" 
              value={formData.modifier}
              onChange={(e) => setFormData({...formData, modifier: parseInt(e.target.value) || 0})}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none transition-all text-center font-bold"
            />
          </div>
        </div>

        {/* Category */}
        <div className="flex flex-col gap-3">
           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{t('presets.fields.category')}</label>
           <div className="flex flex-wrap gap-2">
             {CATEGORIES.map(cat => (
               <button
                key={cat.id}
                type="button"
                onClick={() => setFormData({...formData, category: cat.id})}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                  formData.category === cat.id 
                    ? 'bg-primary-500/20 border-primary-500 text-primary-400' 
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
               >
                 <cat.icon size={14} />
                 <span className="text-xs font-bold uppercase tracking-wider">{cat.id}</span>
               </button>
             ))}
           </div>
        </div>
      </form>
    </Modal>
  )
}

export default PresetModal
