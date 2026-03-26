import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { markAllAsRead, clearNotifications } from '../../features/notifications/notificationsSlice';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, 
  CheckCheck, 
  ChevronDown, 
  ChevronUp, 
  RotateCcw,
  Zap,
  Sword,
  ShieldCheck,
  History,
  Info as InfoIcon,
  Wifi,
  WifiOff
} from 'lucide-react';

const ActivityFeed = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const notifications = useSelector(state => state.notifications.notifications);
  const session = useSelector(state => state.session.currentSession);
  const activeParticipantId = useSelector(state => state.session.activeParticipantId);
  const participants = useSelector(state => state.session.participants);

  const [isMinimized, setIsMinimized] = useState(false);

  if (!session) return null;

  const currentUser = participants.find(p => p.id === activeParticipantId);
  const isPrivileged = currentUser?.role === 'admin' || currentUser?.role === 'gm';

  // Only GM and Admins see the activity feed
  if (!isPrivileged) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'roll': return <Zap size={14} />;
      case 'turn_started': return <Sword size={14} />;
      case 'round_started': return <RotateCcw size={14} />;
      case 'combatant_added': return <ShieldCheck size={14} />;
      default: return <InfoIcon size={14} />;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'roll': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'turn_started': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'round_started': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'combatant_added': return 'text-primary-500 bg-primary-500/10 border-primary-500/20';
      default: return 'text-slate-400 bg-slate-800/10 border-slate-700/20';
    }
  };

  const hasUnread = notifications.some(n => !n.read);

  return (
    <div className={`flex flex-col w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 ${isMinimized ? 'h-14' : 'h-[300px]'}`}>
      <div className="p-4 bg-slate-950/50 border-b border-slate-800 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Wifi size={16} className={`text-amber-500 ${hasUnread ? 'animate-pulse' : ''}`} />
            {hasUnread && <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full animate-ping" />}
          </div>
          <h3 className="text-[11px] font-black text-white italic tracking-[0.2em] uppercase flex items-center gap-2">
            Activity Sensor
          </h3>
        </div>
        
        <div className="flex items-center gap-4">
          {!isMinimized && (
            <div className="flex gap-4">
              <button 
                onClick={() => dispatch(markAllAsRead())}
                className="text-[9px] text-slate-500 hover:text-slate-300 uppercase font-black tracking-widest transition-colors flex items-center gap-1"
                title={t('session.mark_read')}
              >
                <CheckCheck size={12} />
                {t('common.read', 'Read')}
              </button>
              <button 
                onClick={() => dispatch(clearNotifications())}
                className="text-[9px] text-rose-500/50 hover:text-rose-400 uppercase font-black tracking-widest transition-colors flex items-center gap-1"
                title={t('session.clear')}
              >
                <Trash2 size={12} />
                {t('common.clear', 'Clear')}
              </button>
            </div>
          )}
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 bg-slate-800/50 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-all"
          >
            {isMinimized ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {!isMinimized && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex-1 overflow-y-auto p-4 space-y-3 thin-scrollbar flex flex-col"
          >
            {notifications.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-700 space-y-3 py-10 opacity-30 grayscale italic">
                <WifiOff size={32} />
                <p className="text-[10px] uppercase font-black tracking-widest leading-none">{t('session.no_activity', 'Quiet for now...')}</p>
              </div>
            ) : (
              notifications.map((notif, idx) => (
                <motion.div 
                  key={notif.id} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`flex gap-3 relative group transition-all p-2 rounded-xl border border-transparent hover:bg-slate-950/30 hover:border-slate-800/50 ${notif.read ? 'opacity-40 saturate-[0.5]' : 'opacity-100'}`}
                >
                  <div className={`mt-0.5 h-7 w-7 rounded-lg flex items-center justify-center shrink-0 border shadow-inner ${getColor(notif.type)}`}>
                    {getIcon(notif.type)}
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest leading-none mb-0.5">
                          {notif.actorName}
                        </p>
                        <span className="text-[8px] text-amber-500/70 font-black uppercase tracking-[0.2em] italic opacity-60">
                          {notif.actorRole}
                        </span>
                      </div>
                      <span className="text-[9px] text-slate-600 font-bold italic">
                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                      {notif.message}
                    </p>
                  </div>
                  
                  {!notif.read && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                  )}
                </motion.div>
              ))
            )}
            <div className="sticky bottom-0 left-0 right-0 py-2 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none mt-auto">
                <p className="text-[8px] text-slate-600 font-black uppercase tracking-[0.3em] text-center italic opacity-50">
                   Recent Activity Logs
                </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ActivityFeed;
