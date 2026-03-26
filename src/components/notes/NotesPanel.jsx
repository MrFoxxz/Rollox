import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addNote, editNote, deleteNote } from '../../features/notes/notesSlice'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Edit3, Clock, StickyNote, ChevronLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Button from '../ui/Button'

const NotesPanel = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const notes = useSelector(state => state.notes.notes)
  const [isAdding, setIsAdding] = useState(false)
  const [newNote, setNewNote] = useState({ title: '', content: '' })
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({ title: '', content: '' })

  const handleAdd = () => {
    if (newNote.content.trim()) {
      dispatch(addNote(newNote))
      setNewNote({ title: '', content: '' })
      setIsAdding(false)
    }
  }

  const startEdit = (note) => {
    setEditingId(note.id)
    setEditData({ title: note.title || '', content: note.content || '' })
  }

  const handleSaveEdit = () => {
    dispatch(editNote({ id: editingId, ...editData }))
    setEditingId(null)
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase flex items-center gap-3">
          <StickyNote className="text-primary-500" />
          {t('toolkit.notes')}
        </h2>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding} className="h-10 px-4 text-xs">
          <Plus size={16} className="mr-2" />
          {t('notes.new')}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="p-6 bg-slate-900 border-2 border-primary-500/30 rounded-[32px] shadow-2xl flex flex-col gap-4"
            >
              <input 
                type="text" 
                placeholder={t('notes.title_placeholder')} 
                value={newNote.title}
                onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                className="bg-transparent border-b border-slate-800 pb-2 text-white font-bold outline-none focus:border-primary-500 transition-colors"
              />
              <textarea 
                placeholder={t('notes.content_placeholder')} 
                value={newNote.content}
                onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                className="bg-transparent text-slate-400 text-sm h-32 resize-none outline-none"
              />
              <div className="flex items-center gap-2 mt-auto">
                <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-white transition-colors uppercase italic tracking-widest">{t('common.back')}</button>
                <Button onClick={handleAdd} className="h-9 px-4 text-[10px] ml-auto uppercase italic tracking-widest">{t('notes.save')}</Button>
              </div>
            </motion.div>
          )}

          {notes.map(note => (
            <motion.div
              key={note.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`group p-6 rounded-[32px] border transition-all h-full flex flex-col gap-4 ${
                editingId === note.id ? 'bg-slate-900 border-primary-500/50 shadow-xl' : 'bg-slate-900/40 border-slate-800/60 hover:border-slate-700'
              }`}
            >
              {editingId === note.id ? (
                <>
                  <input 
                    type="text" 
                    value={editData.title}
                    onChange={(e) => setEditData({...editData, title: e.target.value})}
                    className="bg-transparent border-b border-slate-800 pb-2 text-white font-bold outline-none focus:border-primary-500 transition-colors"
                  />
                  <textarea 
                    value={editData.content}
                    onChange={(e) => setEditData({...editData, content: e.target.value})}
                    className="bg-transparent text-slate-400 text-sm h-32 resize-none outline-none"
                  />
                  <button onClick={handleSaveEdit} className="mt-auto w-full py-2 bg-primary-500 rounded-xl text-white font-black uppercase italic tracking-widest text-[10px]">{t('notes.save')}</button>
                </>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-bold text-white italic truncate">{note.title || t('notes.empty')}</h3>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => startEdit(note)} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white"><Edit3 size={14} /></button>
                      <button onClick={() => dispatch(deleteNote(note.id))} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-rose-500"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm line-clamp-6 leading-relaxed flex-grow">{note.content}</p>
                  <div className="mt-auto pt-4 border-t border-slate-800/50 flex items-center justify-between text-[10px] text-slate-600 font-bold uppercase tracking-widest italic">
                    <div className="flex items-center gap-1.5">
                      <Clock size={10} />
                      {new Date(note.createdAt).toLocaleDateString()}
                    </div>
                    {note.updatedAt !== note.createdAt && <span className="text-primary-500/50">{t('notes.edited')}</span>}
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default NotesPanel
