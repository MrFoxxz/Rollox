import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  StickyNote, 
  Eye, 
  EyeOff, 
  Users, 
  Lock, 
  Filter,
  MoreVertical,
  Edit2,
  Trash2
} from 'lucide-react';
import Card from '../ui/Card';
import NoteEditorModal from './NoteEditorModal';
import { deleteNote } from '../../features/notes/notesSlice';

const SessionNotesPanel = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const session = useSelector(state => state.session.currentSession);
  const activeParticipantId = useSelector(state => state.session.activeParticipantId);
  const participants = useSelector(state => state.session.participants);
  const allNotes = useSelector(state => state.notes.notes);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVisibility, setFilterVisibility] = useState('all'); // all, shared, private
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const currentUser = participants.find(p => p.id === activeParticipantId);
  const isGM = currentUser?.role === 'gm' || currentUser?.role === 'admin';

  // Filter notes belonging to this session AND that the user can see
  const sessionNotes = allNotes.filter(note => {
    // Must belong to current session
    if (note.sessionId !== session?.id) return false;
    
    // Visibility rules:
    // 1. Shared notes are visible to everyone
    // 2. gm-private visible only to GM
    // 3. player-private visible only to authors or GM (if we want GM to oversee everything)
    
    if (note.visibility === 'shared') return true;
    if (note.visibility === 'gm-private' && isGM) return true;
    if (note.visibility === 'player-private' && (note.authorId === activeParticipantId || isGM)) return true;
    
    return false;
  }).filter(note => {
    // Search term check
    if (!searchTerm) return true;
    return note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
           note.content.toLowerCase().includes(searchTerm.toLowerCase());
  }).filter(note => {
    // Visibility filter check
    if (filterVisibility === 'all') return true;
    if (filterVisibility === 'shared') return note.visibility === 'shared';
    if (filterVisibility === 'private') return note.visibility !== 'shared';
    return true;
  });

  const handleOpenNewNote = () => {
    setEditingNote(null);
    setIsEditorOpen(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  };

  const handleDeleteNote = (id) => {
    if (confirm(t('notes.delete_confirm', 'Are you sure you want to delete this note?'))) {
      dispatch(deleteNote(id));
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500">
             <StickyNote size={18} />
          </div>
          <div>
            <h2 className="text-lg font-black text-white italic tracking-tighter uppercase leading-none">
              {t('session.notes_linked')}
            </h2>
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1">
              {sessionNotes.length} {t('notes.count', 'Notes')}
            </p>
          </div>
        </div>

        <button 
          onClick={handleOpenNewNote}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-amber-500/10 active:scale-95"
        >
          <Plus size={14} />
          {t('notes.new')}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 shrink-0">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
          <input 
            type="text" 
            placeholder={t('common.search', 'Search notes...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 outline-none focus:border-amber-500/50 transition-all"
          />
        </div>
        <div className="flex items-center p-1 bg-slate-900/50 rounded-xl border border-slate-800">
           {['all', 'shared', 'private'].map(v => (
             <button
               key={v}
               onClick={() => setFilterVisibility(v)}
               className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                 filterVisibility === v ? 'bg-slate-800 text-slate-200' : 'text-slate-600 hover:text-slate-400'
               }`}
             >
               {t(`session.visibility.${v === 'all' ? 'shared' : v === 'shared' ? 'shared' : 'player-private'}`, v)}
             </button>
           ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 min-h-0 space-y-3 thin-scrollbar">
        {sessionNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center opacity-40 grayscale">
            <Filter size={40} className="text-slate-700 mb-3" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{t('notes.empty')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3">
            <AnimatePresence mode="popLayout">
              {sessionNotes.map(note => (
                <motion.div
                  key={note.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card className={`p-4 group hover:border-amber-500/40 transition-all ${note.visibility !== 'shared' ? 'bg-slate-900/40' : 'bg-slate-900/20'}`}>
                    <div className="flex items-start justify-between mb-2">
                       <div className="flex items-center gap-2">
                          {note.visibility === 'shared' ? (
                            <Users size={12} className="text-primary-500" />
                          ) : note.visibility === 'gm-private' ? (
                            <Lock size={12} className="text-purple-500" />
                          ) : (
                            <EyeOff size={12} className="text-amber-500" />
                          )}
                          <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] italic">
                             {t(`session.visibility.${note.visibility}`)}
                          </span>
                       </div>
                       <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => handleEditNote(note)} className="p-1 text-slate-600 hover:text-white transition-colors">
                           <Edit2 size={12} />
                         </button>
                         <button onClick={() => handleDeleteNote(note.id)} className="p-1 text-slate-600 hover:text-rose-500 transition-colors">
                           <Trash2 size={12} />
                         </button>
                       </div>
                    </div>
                    
                    <h3 className="font-black text-white italic uppercase tracking-tight mb-2 truncate group-hover:text-amber-500 transition-colors">
                       {note.title || t('notes.untitled', 'Untitled')}
                    </h3>
                    
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                       {note.content}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-800/50 text-[8px] font-black text-slate-600 uppercase tracking-widest italic">
                       <span>{note.authorName}</span>
                       <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <NoteEditorModal 
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        editingNote={editingNote}
        sessionId={session?.id}
      />
    </div>
  );
};

export default SessionNotesPanel;
