import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { endSession } from "../../features/session/sessionSlice";
import { useTranslation } from "react-i18next";
import ActiveParticipantSelector from "./ActiveParticipantSelector";
import ManageSessionModal from "./ManageSessionModal";
import {
  Settings,
  LogOut,
  Users,
  Sparkles,
  LayoutDashboard,
} from "lucide-react";

const CurrentSessionCard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const session = useSelector((state) => state.session.currentSession);
  const participants = useSelector((state) => state.session.participants);
  const activeParticipantId = useSelector(
    (state) => state.session.activeParticipantId,
  );
  const gameConfigs = useSelector((state) => state.gameConfig.configs);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  if (!session) return null;

  const activeParticipant = participants.find(
    (p) => p.id === activeParticipantId,
  );
  const gameSystemLabel =
    gameConfigs[session.gameSystem]?.label || session.gameSystem;

  const sessionPath = activeParticipant?.role === 'gm' || activeParticipant?.role === 'admin' 
    ? '/session/gm' 
    : '/session/player';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl relative">
      <div className="bg-amber-500/10 border-b border-slate-800 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center text-slate-900 shadow-lg shadow-amber-500/20">
             <Sparkles size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-lg leading-tight">
              {session.name}
            </h3>
            <p className="text-xs text-amber-500 uppercase font-black tracking-widest">
              {gameSystemLabel}
            </p>
          </div>
        </div>
        <button
          onClick={() => dispatch(endSession())}
          className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
          title={t("session.end_session", "End Session")}
        >
          <LogOut size={18} />
        </button>
      </div>

      <div className="p-4 grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest leading-none">
            {t("session.participants", "Participants")}
          </p>
          <p className="text-xl font-bold text-slate-200">
            {participants.length}{" "}
            <span className="text-slate-600 font-medium text-sm">
              / {session.maxParticipants}
            </span>
          </p>
        </div>

        <div className="space-y-1 flex flex-col items-end">
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest leading-none mb-1">
            {t("session.active_hero", "Active Hero")}
          </p>
          <ActiveParticipantSelector />
        </div>
      </div>

      <div className="px-4 pb-4 flex gap-2">
        <div className="flex -space-x-2">
          {participants.map((p) => (
            <div
              key={p.id}
              className={`w-8 h-8 rounded-full border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold ${
                p.role === "admin"
                  ? "bg-amber-500 text-slate-900"
                  : p.role === "gm"
                    ? "bg-purple-500 text-white"
                    : "bg-slate-700 text-slate-300"
              }`}
              title={p.name}
            >
              {p.name.charAt(0).toUpperCase()}
            </div>
          ))}
        </div>
        <div className="flex-1"></div>
         <div className="flex items-center gap-2">
            {(activeParticipant?.role === 'gm' || activeParticipant?.role === 'admin') && (
              <Link
                to="/session/gm"
                className="text-[10px] font-black uppercase tracking-widest text-purple-400 hover:text-purple-300 px-3 py-2 rounded-xl border border-purple-500/20 hover:bg-purple-500/10 transition-all flex items-center gap-2 italic"
                title="DJ Panel"
              >
                <Users size={14} />
                DJ Panel
              </Link>
            )}
            <Link
              to={sessionPath}
              className="text-xs font-black uppercase tracking-widest bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-3 rounded-2xl transition-all flex items-center gap-2 italic shadow-lg shadow-amber-500/20 active:scale-95"
            >
              <LayoutDashboard size={16} />
              {t("session.start_adventure", "Iniciar Aventura")}
            </Link>
            <button
              onClick={() => setIsManageModalOpen(true)}
              className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white px-3 py-3 rounded-xl border border-slate-800 hover:bg-slate-800 transition-all flex items-center gap-2 italic"
              title={t("session.manage", "Manage")}
            >
              <Settings size={16} />
            </button>
         </div>
      </div>

      <ManageSessionModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
      />
    </div>
  );
};

export default CurrentSessionCard;
