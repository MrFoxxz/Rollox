import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Save, 
  Users, 
  Lock, 
  EyeOff, 
  Info,
  ChevronDown
} from 'lucide-react';
import { addNote, editNote } from '../../features/notes/notesSlice';

const NoteEditorModal = ({ isOpen, onClose, editingNote, sessionId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const activeParticipantId = useSelector(state => state.session.activeParticipantId);
  const participants = useSelector(state => state.session.participants);

  const [form, setForm] = useState({
    title: '',
    content: '',
    visibility: 'shared',
    tags: []
  });

  const currentUser = participants.find(p => p.id === activeParticipantId);
  const isGM = currentUser?.role === 'gm' || currentUser?.role === 'admin';

  useEffect(() => {
    if (editingNote) {
      setForm({
        title: editingNote.title,
        content: editingNote.content,
        visibility: editingNote.visibility,
        tags: editingNote.tags || []
      });
    } else {
      setForm({
        title: '',
        content: '',
        visibility: isGM ? 'gm-private' : 'player-private',
        tags: []
      });
    }
  }, [editingNote, isGM, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.content.trim()) return;

    const noteData = {
      ...form,
      sessionId,
      authorId: activeParticipantId,
      authorName: currentUser?.name || 'Local User',
    };

    if (editingNote) {
      dispatch(editNote({ ...noteData, id: editingNote.id }));
    } else {
      dispatch(addNote(noteData));
    }
    onClose();
  };

  if (!isOpen) return null;

  const visibilityOptions = [
    { id: 'shared', icon: Users, label: t('session.visibility.shared'), color: 'text-primary-500' },
    { id: 'gm-private', icon: Lock, label: t('session.visibility.gm-private'), color: 'text-purple-500', disabled: !isGM },
    { id: 'player-private', icon: EyeOff, label: t('session.visibility.player-private'), color: 'text-amber-500' },
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-xl bg-slate-900 border-2 border-slate-800 rounded-[32px] overflow-hidden shadow-2xl"
      >
        <div className="p-6 sm:p-8">
           <div className="flex items-center justify-between mb-8">
              <div className="flex flex-col">
                 <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">
                   {editingNote ? t('notes.edit') : t('notes.new')}
                 </h2>
                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-2 flex items-center gap-1.5">
                   {sessionId ? `Sesión: ${sessionId}` : 'Global Note'}
                 </p>
              </div>
              <button 
                onClick={onClose}
                className="p-3 bg-slate-950 hover:bg-slate-800 text-slate-500 hover:text-white rounded-2xl transition-all border border-slate-800/50"
              >
                <X size={20} />
              </button>
           </div>

           <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic ml-1">
                    {t('notes.title_placeholder')}
                 </label>
                 <input 
                   type="text" 
                   value={form.title}
                   onChange={(e) => setForm({...form, title: e.target.value})}
                   placeholder="Ej: El misterio del pantano"
                   className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white font-bold italic placeholder:text-slate-700 outline-none focus:border-amber-500/50 transition-all shadow-inner"
                 />
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic ml-1 flex items-center justify-between">
                    <span>{t('notes.content_placeholder')}</span>
                    <span className="opacity-40">{form.content.length} {t('common.chars', 'chars')}</span>
                 </label>
                 <textarea 
                   value={form.content}
                   onChange={(e) => setForm({...form, content: e.target.value})}
                   placeholder="..."
                   rows={6}
                   className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-slate-200 leading-relaxed placeholder:text-slate-700 outline-none focus:border-amber-500/50 transition-all resize-none shadow-inner"
                   required
                 />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic ml-1">
                       {t('session.visibility', 'Visibility')}
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                       {visibilityOptions.map(opt => (
                         <button
                           key={opt.id}
                           type="button"
                           disabled={opt.disabled}
                           onClick={() => setForm({...form, visibility: opt.id})}
                           className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-xs font-black uppercase tracking-widest ${
                             form.visibility === opt.id 
                               ? 'bg-slate-950 border-amber-500/50 text-white shadow-lg' 
                               : opt.disabled 
                                 ? 'bg-slate-900 border-slate-800/30 text-slate-800 cursor-not-allowed grayscale' 
                                 : 'bg-slate-950 border-slate-800/80 text-slate-600 hover:border-slate-700'
                           }`}
                         >
                           <opt.icon size={16} className={form.visibility === opt.id ? opt.color : 'text-slate-700'} />
                           {opt.label}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="flex flex-col justify-end">
                    <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl mb-4 flex items-start gap-3">
                       <div className="mt-0.5 text-amber-500">
                          <Info size={14} />
                       </div>
                       <p className="text-[9px] text-slate-600 font-bold leading-relaxed uppercase tracking-widest italic">
                          {form.visibility === 'shared' 
                            ? 'Esta nota será visible para TODOS los participantes en tiempo real.' 
                            : form.visibility === 'gm-private'
                              ? 'Solo TÚ puedes ver esta nota. Úsala para tus planes secretos.'
                              : 'Solo TÚ y el Director de Juego pueden ver esta nota.'}
                       </p>
                    </div>

                    <button 
                      type="submit"
                      disabled={!form.content.trim()}
                      className="w-full h-14 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-700 text-slate-950 rounded-2xl text-sm font-black uppercase italic tracking-tighter transition-all shadow-xl shadow-amber-500/10 active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <Save size={20} />
                      {editingNote ? t('common.save') : t('notes.save')}
                    </button>
                 </div>
              </div>
           </form>
        </div>
      </motion.div>
    </div>
  );
};

export default NoteEditorModal;
