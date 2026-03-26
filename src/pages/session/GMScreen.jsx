import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { setViewMode } from "../../features/initiative/initiativeSlice";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Swords,
  Clock,
  MessageSquare,
  Edit3,
  Settings,
  AlertCircle,
  LayoutDashboard,
  Users,
  Eye,
  EyeOff,
  Zap,
} from "lucide-react";
import InitiativeTracker from "../../components/initiative/InitiativeTracker";
import SessionNotesPanel from "../../components/session/SessionNotesPanel";
import ActivityFeed from "../../components/notifications/ActivityFeed";
import LastRollResult from "../../components/dice/LastRollResult";
import ParticipantList from "../../components/session/ParticipantList";
import SessionToolkit from "../../components/session/SessionToolkit";
import Card from "../../components/ui/Card";

const GMScreen = () => {
  const { t } = useTranslation();
  const session = useSelector((state) => state.session.currentSession);
  const participants = useSelector((state) => state.session.participants);
  const [activeTab, setActiveTab] = useState("combat"); // combat, notes, participants

  useEffect(() => {
    dispatch(setViewMode("gm"));
  }, [dispatch]);

  if (!session)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center opacity-40">
        <LayoutDashboard size={80} className="mb-4 text-slate-700" />
        <h1 className="text-2xl font-black uppercase text-slate-500">
          {t("session.no_active_session")}
        </h1>
      </div>
    );

  return (
    <div className="flex flex-col gap-6 lg:gap-8 min-h-screen pb-32">
      {/* Session Header Controls */}
      <header className="flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-slate-800/50 shrink-0">
        <div className="flex flex-col">
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none flex items-center gap-3">
            <ShieldCheck className="text-purple-500" size={32} />
            {t("toolkit.gm_dashboard")}
          </h1>
          <p className="text-[10px] text-purple-400 font-black uppercase tracking-[0.2em] mt-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
            DJ Control - {session.name}
          </p>
        </div>

        <div className="flex items-center gap-2 p-1 bg-slate-900/80 rounded-2xl border border-slate-800">
          {[
            { id: "combat", label: t("common.combat"), icon: Swords },
            { id: "notes", label: t("toolkit.notes"), icon: MessageSquare },
            {
              id: "participants",
              label: t("session.participants", "Partners"),
              icon: Users,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id
                  ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20"
                  : "text-slate-500 hover:text-slate-200"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Main Work Area */}
        <div className="lg:col-span-8 space-y-8">
          <AnimatePresence mode="wait">
            {activeTab === "combat" && (
              <motion.div
                key="combat"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                <div className="bg-slate-900/50 rounded-[32px] border border-slate-800/80 p-1 min-h-[500px] overflow-hidden">
                  <InitiativeTracker />
                </div>
              </motion.div>
            )}

            {activeTab === "notes" && (
              <motion.div
                key="notes"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="min-h-[500px]"
              >
                <SessionNotesPanel />
              </motion.div>
            )}

            {activeTab === "participants" && (
              <motion.div
                key="participants"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="min-h-[500px]"
              >
                <ParticipantList />
              </motion.div>
            )}
          </AnimatePresence>

          {/* GM Sensor / Activity Feed below the main view */}
          <div className="pt-4">
            <ActivityFeed />
          </div>
        </div>

        {/* Side Control Area */}
        <div className="lg:col-span-4 space-y-6 flex flex-col h-full lg:sticky lg:top-24">
          <LastRollResult />

          <Card className="p-6 border-purple-500/20 bg-purple-500/5 relative overflow-hidden group/actions">
            <div className="absolute top-[-20%] right-[-20%] w-[50%] h-[50%] bg-purple-500/10 blur-[40px] rounded-full pointer-events-none group-hover/actions:bg-purple-500/20 transition-all duration-700" />

            <div className="flex items-center gap-2 mb-5 relative z-10">
              <div className="p-1.5 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <Zap size={16} className="text-purple-400" />
              </div>
              <h3 className="text-[11px] font-black text-purple-200 uppercase tracking-[0.2em] italic">
                {t("session.gm_quick_actions", "DJ Quick Toolkit")}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 relative z-10">
              <button className="flex flex-col items-center justify-center p-4 bg-slate-900 border border-slate-800 rounded-3xl hover:border-purple-500/50 hover:bg-slate-800/80 transition-all active:scale-95 group/tool">
                <div className="w-10 h-10 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-3 group-hover/tool:border-purple-500/30 transition-colors">
                  <EyeOff
                    size={18}
                    className="text-slate-600 group-hover:text-purple-400"
                  />
                </div>
                <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest italic group-hover:text-white leading-none">
                  Secret Roll
                </span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-slate-900 border border-slate-800 rounded-3xl hover:border-purple-500/50 hover:bg-slate-800/80 transition-all active:scale-95 group/tool">
                <div className="w-10 h-10 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-3 group-hover/tool:border-purple-500/30 transition-colors">
                  <AlertCircle
                    size={18}
                    className="text-slate-600 group-hover:text-purple-400"
                  />
                </div>
                <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest italic group-hover:text-white leading-none">
                  Announce
                </span>
              </button>
            </div>
          </Card>

          {/* Sensor Area (Embedded) */}
          <div className="flex-1">
            <ActivityFeed />
          </div>
        </div>
      </div>

      {/* Floating Session Toolkit */}
      <SessionToolkit mode="gm" />
    </div>
  );
};

export default GMScreen;
