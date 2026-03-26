import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { createSession } from '../../features/session/sessionSlice'
import { useTranslation } from 'react-i18next'
import { Play, Calendar, Trophy, ChevronRight, LayoutGrid } from 'lucide-react'

const DJSummarySessions = () => {
  const { t } = useTranslation()
  const sessions = useSelector(state => state.session.sessions || [])
  const currentSession = useSelector(state => state.session.currentSession)
  
  if (sessions.length <= 1 && !currentSession) return null

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500 italic flex items-center gap-2">
           <LayoutGrid size={16} className="text-amber-500" />
           {t('session.all_sessions', 'Mis Sesiones')}
        </h3>
        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{sessions.length} Registradas</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sessions.map(s => (
          <div 
            key={s.id}
            className={`bg-slate-900/50 border rounded-2xl p-4 transition-all group hover:border-amber-500/30 ${currentSession?.id === s.id ? 'border-amber-500/50 bg-amber-500/5' : 'border-slate-800'}`}
          >
            <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                    <span className="text-base font-black text-slate-100 italic tracking-tight truncate max-w-[150px]">{s.name}</span>
                    <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">{s.gameSystem}</span>
                </div>
                {currentSession?.id === s.id && (
                  <span className="px-2 py-0.5 bg-amber-500 text-slate-950 text-[8px] font-black uppercase tracking-widest rounded-full">Activa</span>
                )}
            </div>

            <div className="flex items-center gap-4 text-slate-500 mb-6">
                <div className="flex items-center gap-1.5 grayscale opacity-50">
                    <Calendar size={12} />
                    <span className="text-[10px] font-bold">{new Date(s.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1.5 grayscale opacity-50">
                    <Trophy size={12} />
                    <span className="text-[10px] font-bold uppercase tracking-tight">{s.maxParticipants} slots</span>
                </div>
            </div>

            <Link 
              to={currentSession?.id === s.id ? '/session/gm' : '/dice'} 
              className="w-full py-2.5 rounded-xl bg-slate-800 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest italic"
            >
                {currentSession?.id === s.id ? 'Reanudar Aventura' : 'Ver Detalles'}
                <ChevronRight size={14} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DJSummarySessions
