import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MessageSquare, ChevronDown, CheckCircle } from 'lucide-react'
import { addNote } from '../../features/notes/notesSlice'
import Button from '../ui/Button'

const FloatingNotesPanel = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const location = useLocation()
  
  const [isOpen, setIsOpen] = useState(false)
  const [quickNote, setQuickNote] = useState('')
  const [saveStatus, setSaveStatus] = useState(false)
  
  const session = useSelector(state => state.session.currentSession)
  const activeParticipantId = useSelector(state => state.session.activeParticipantId)
  const participants = useSelector(state => state.session.participants)
  const activeParticipant = participants.find(p => p.id === activeParticipantId)
  const hideOnHome = useSelector(state => state.settings.hideFloatingDiceOnHome ?? true)

  const isHomePage = location.pathname === '/'
  if (isHomePage && hideOnHome) return null

  const handleQuickSaveToNotes = () => {
    if (!quickNote.trim()) return

    dispatch(addNote({
      id: Date.now().toString(),
      sessionId: session?.id || 'local',
      title: t('notes.quick_note', 'Quick Note'),
      content: quickNote,
      authorId: activeParticipantId || 'local-user',
      authorName: activeParticipant?.name || 'Local User',
      visibility: 'player-private',
      createdAt: new Date().toISOString()
    }))

    setQuickNote('')
    setSaveStatus(true)
    setTimeout(() => setSaveStatus(false), 2000)
  }

  return (
    <div className="fixed bottom-6 left-6 z-[100] flex flex-col items-start gap-4 pointer-events-none sticky-floating-panel">
      {/* Backdrop for click-outside */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[-1] pointer-events-auto cursor-default" 
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <AnimatePresence>
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 bg-slate-900 border-2 border-slate-800 rounded-22px flex items-center justify-center text-slate-400 hover:text-primary-500 hover:border-primary-500/50 hover:bg-slate-800 transition-all pointer-events-auto shadow-[0_0_20px_rgba(0,0,0,0.5)] active:scale-90 group relative"
          >
            <div className="absolute inset-0 bg-primary-500/10 rounded-22px animate-pulse pointer-events-none" />
            <MessageSquare size={24} className="group-hover:scale-110 transition-transform relative z-10" />
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, x: -20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.9, y: 20, x: -20, filter: 'blur(10px)' }}
            className="w-80 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-32px shadow-2xl p-6 pointer-events-auto flex flex-col gap-4 overflow-hidden relative group"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-primary-500/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-primary-500/20 transition-all duration-500" />

            <header className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-500/10 rounded-lg flex items-center justify-center">
                  <MessageSquare size={18} className="text-primary-500" />
                </div>
                <h3 className="text-sm font-black italic uppercase tracking-tighter text-white leading-none">
                  {t('home.preview.notes')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-colors"
              >
                <ChevronDown size={20} />
              </button>
            </header>

            <div className="relative z-10 flex flex-col gap-4">
              <textarea
                value={quickNote}
                onChange={(e) => setQuickNote(e.target.value)}
                placeholder={t("dice.quick_notes_placeholder")}
                rows={6}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-4 text-xs text-slate-200 placeholder:text-slate-600 focus:border-primary-500/50 outline-none resize-none transition-all shadow-inner"
              />
              <Button
                type="button"
                className="w-full h-12 text-xs uppercase italic tracking-widest relative"
                onClick={handleQuickSaveToNotes}
                disabled={!quickNote.trim()}
              >
                {saveStatus ? (
                  <span className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle size={14} />
                    {t('session.saved', 'Guardado')}
                  </span>
                ) : (
                  <span>{t("dice.save_to_notes")}</span>
                )}
              </Button>
            </div>

            <footer className="text-[9px] font-black text-slate-600 uppercase tracking-widest text-center italic relative z-10 pt-2 border-t border-slate-800/50">
               {t('floating.footer_tagline')}
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FloatingNotesPanel
