import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { addRoll, clearHistory } from "../features/dice/diceSlice";
import { removeCustomPreset } from "../features/presets/presetsSlice";
import {
  Dice6,
  Plus,
  Minus,
  Hash,
  Trash2,
  Clock,
  Zap,
  Swords,
  HeartPulse,
  ShieldCheck,
  Activity,
  Timer,
  Wand,
  Edit2,
  Sparkles,
  MessageSquareQuote,
} from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { motion, AnimatePresence } from "framer-motion";
import PresetModal from "../components/presets/PresetModal";
import { getD20Status, getD20Classes } from "../utils/diceUtils";

const DIE_TYPES = [4, 6, 8, 10, 12, 20, 100];

const DiceRoller = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.settings);
  const history = useSelector((state) => state.dice.history);
  const lastRoll = useSelector((state) => state.dice.lastRoll);
  const defaultPresets = useSelector((state) => state.presets.defaultPresets);
  const customPresets = useSelector((state) => state.presets.customPresets);
  const enableCriticalHighlighting = settings.enableCriticalHighlighting;

  const [diceConfig, setDiceConfig] = useState({
    count: settings.preferredQuantity,
    dieType: settings.preferredDie,
    modifier: settings.preferredModifier,
  });

  const [isRolling, setIsRolling] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPreset, setEditingPreset] = useState(null);

  const updateDiceConfig = (updates) => {
    setDiceConfig((prev) => ({ ...prev, ...updates }));
  };

  const handleRoll = (config = diceConfig) => {
    setIsRolling(true);
    setTimeout(() => {
      const individual = Array.from(
        { length: config.count || config.dice || 1 },
        () =>
          Math.floor(Math.random() * (config.dieType || config.type || 20)) + 1,
      );
      const sum = individual.reduce((a, b) => a + b, 0);
      const total = sum + (config.modifier || 0);

      const rollData = {
        id: Date.now(),
        total,
        individual,
        diceConfig: {
          count: config.count || config.dice || 1,
          dieType: config.dieType || config.type || 20,
          modifier: config.modifier || 0,
        },
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      };

      dispatch(addRoll(rollData));
      setIsRolling(false);
    }, 400);
  };

  const openNewPreset = () => {
    setEditingPreset(null);
    setIsModalOpen(true);
  };

  const openEditPreset = (e, preset) => {
    e.stopPropagation();
    setEditingPreset(preset);
    setIsModalOpen(true);
  };

  // Result styling
  const containsCritical =
    lastRoll?.diceConfig.dieType === 20 &&
    lastRoll?.individual.some((v) => v === 20);
  const containsFumble =
    lastRoll?.diceConfig.dieType === 20 &&
    lastRoll?.individual.some((v) => v === 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <PresetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingPreset={editingPreset}
      />

      {/* Configuration & Roll Panel */}
      <div className="lg:col-span-8 space-y-8">
        <header className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">
            {t("dice.title")}
          </h1>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 rounded-2xl border border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
            <Sparkles size={12} className="text-primary-500" />
            Session: Alpha
          </div>
        </header>

        <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
          {DIE_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => updateDiceConfig({ dieType: type })}
              className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all relative overflow-hidden group ${
                diceConfig.dieType === type
                  ? "border-primary-500 bg-primary-500/10 text-primary-500"
                  : "border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700 hover:text-slate-300"
              }`}
            >
              <div
                className={`text-2xl font-black mb-1 italic ${diceConfig.dieType === type ? "scale-110" : "scale-100"} transition-transform`}
              >
                d{type}
              </div>
              <div className="h-1 w-full bg-slate-800 rounded-full mt-auto">
                <div
                  className={`h-full bg-primary-500 transition-all duration-300 ${diceConfig.dieType === type ? "w-full" : "w-0"}`}
                />
              </div>
            </button>
          ))}
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="flex flex-col gap-8 h-full">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Hash size={16} className="text-primary-500" />
                  {t("dice.number_of_dice")}
                </label>
                <div className="flex items-center space-x-4 bg-slate-950/50 p-2 rounded-xl border border-slate-800">
                  <button
                    onClick={() =>
                      updateDiceConfig({
                        count: Math.max(1, diceConfig.count - 1),
                      })
                    }
                    className="w-8 h-8 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-400"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="text-lg font-bold w-8 text-center text-white italic">
                    {diceConfig.count}
                  </span>
                  <button
                    onClick={() =>
                      updateDiceConfig({
                        count: Math.min(99, diceConfig.count + 1),
                      })
                    }
                    className="w-8 h-8 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-400"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <div className="w-4 h-4 rounded-sm border-2 border-primary-500 flex items-center justify-center text-[10px] text-primary-500 font-bold">
                    +
                  </div>
                  {t("dice.modifier")}
                </label>
                <div className="flex items-center space-x-4 bg-slate-950/50 p-2 rounded-xl border border-slate-800">
                  <button
                    onClick={() =>
                      updateDiceConfig({ modifier: diceConfig.modifier - 1 })
                    }
                    className="w-8 h-8 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-400"
                  >
                    <Minus size={18} />
                  </button>
                  <span
                    className={`text-lg font-bold w-12 text-center italic ${diceConfig.modifier > 0 ? "text-primary-400" : diceConfig.modifier < 0 ? "text-rose-400" : "text-white"}`}
                  >
                    {diceConfig.modifier > 0
                      ? `+${diceConfig.modifier}`
                      : diceConfig.modifier}
                  </span>
                  <button
                    onClick={() =>
                      updateDiceConfig({ modifier: diceConfig.modifier + 1 })
                    }
                    className="w-8 h-8 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-400"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full h-20 text-2xl font-black uppercase italic tracking-tighter mt-auto"
              onClick={() => handleRoll()}
              disabled={isRolling}
            >
              {isRolling ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <Dice6 size={32} />
                </motion.div>
              ) : (
                <div className="flex items-center gap-3">
                  <Dice6 size={28} />
                  {t("dice.roll")}
                </div>
              )}
            </Button>
          </Card>

          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 italic">
                <Zap size={14} className="text-amber-500" />
                {t("dice.presets.title")}
              </h3>
              <button
                onClick={openNewPreset}
                className="p-2 bg-primary-500/10 hover:bg-primary-500/20 text-primary-500 rounded-lg transition-colors group"
                title="Nuevo Preset"
              >
                <Plus
                  size={16}
                  className="group-hover:rotate-90 transition-transform"
                />
              </button>
            </div>

            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 thin-scrollbar">
              {/* Default Presets */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] italic ml-1">
                  Sistema
                </label>
                {defaultPresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleRoll(preset)}
                    className="w-full flex items-center justify-between p-4 bg-slate-900/50 border border-slate-800/80 rounded-2xl hover:border-primary-500/40 hover:bg-slate-800/50 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-xl bg-slate-950 flex items-center justify-center text-slate-500 group-hover:text-primary-400 transition-colors">
                        <Swords size={16} />
                      </div>
                      <span className="font-bold text-slate-300 group-hover:text-white transition-colors">
                        {t(preset.label)}
                      </span>
                    </div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      {preset.dice}d{preset.type}
                      {preset.modifier >= 0 ? "+" : ""}
                      {preset.modifier}
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom Presets */}
              {customPresets.length > 0 && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] italic ml-1">
                    Personalizados
                  </label>
                  {customPresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleRoll(preset)}
                      className="w-full flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-amber-500/40 hover:bg-slate-800/50 transition-all group relative"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-xl bg-slate-950 flex items-center justify-center text-amber-500 group-hover:text-amber-400 transition-colors">
                          <Wand size={16} />
                        </div>
                        <span className="font-bold text-slate-300 group-hover:text-white transition-colors">
                          {preset.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          {preset.dice}d{preset.type}
                          {preset.modifier >= 0 ? "+" : ""}
                          {preset.modifier}
                        </div>
                        <button
                          onClick={(e) => openEditPreset(e, preset)}
                          className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-600 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Edit2 size={12} />
                        </button>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Big Result Area */}
        <AnimatePresence mode="wait">
          {lastRoll && (
            <motion.div
              key={lastRoll.id}
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`relative p-1 rounded-[32px] bg-gradient-to-br transition-all duration-700 shadow-2xl ${
                enableCriticalHighlighting &&
                lastRoll.diceConfig.dieType === 20 &&
                lastRoll.individual.some((v) => v === 20)
                  ? "from-emerald-500 to-teal-700 shadow-emerald-500/20"
                  : enableCriticalHighlighting &&
                      lastRoll.diceConfig.dieType === 20 &&
                      lastRoll.individual.some((v) => v === 1)
                    ? "from-rose-500 to-red-800 shadow-rose-500/20"
                    : "from-primary-500 to-amber-600 shadow-primary-500/20"
              }`}
            >
              <div className="bg-slate-950/95 backdrop-blur-xl rounded-[28px] overflow-hidden relative">
                {/* Glow for crit/fumble */}
                {enableCriticalHighlighting &&
                  lastRoll.diceConfig.dieType === 20 && (
                    <div
                      className={`absolute inset-0 opacity-10 pointer-events-none blur-3xl ${lastRoll.individual.includes(20) ? "bg-emerald-500" : lastRoll.individual.includes(1) ? "bg-rose-500" : ""}`}
                    />
                  )}

                <div className="p-10 flex flex-col items-center text-center relative z-10">
                  <div className="text-slate-500 text-xs font-black uppercase tracking-[0.3em] mb-4 italic">
                    {lastRoll.diceConfig.count}d{lastRoll.diceConfig.dieType}
                    {lastRoll.diceConfig.modifier !== 0 &&
                      (lastRoll.diceConfig.modifier > 0
                        ? ` + ${lastRoll.diceConfig.modifier}`
                        : ` - ${Math.abs(lastRoll.diceConfig.modifier)}`)}
                  </div>

                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`text-[130px] font-black italic tracking-tighter leading-none mb-6 transition-colors duration-500 ${
                      enableCriticalHighlighting &&
                      lastRoll.diceConfig.dieType === 20 &&
                      lastRoll.individual.includes(20)
                        ? "text-emerald-500"
                        : enableCriticalHighlighting &&
                            lastRoll.diceConfig.dieType === 20 &&
                            lastRoll.individual.includes(1)
                          ? "text-rose-500"
                          : "text-white"
                    }`}
                  >
                    {lastRoll.total}
                  </motion.div>

                  <div className="flex flex-wrap justify-center gap-3">
                    {lastRoll.individual.map((val, i) => {
                      const status = enableCriticalHighlighting
                        ? getD20Status(val, lastRoll.diceConfig.dieType)
                        : null;
                      const classes = status
                        ? getD20Classes(status)
                        : "bg-slate-900 border-slate-800 text-slate-400";
                      return (
                        <div
                          key={i}
                          className={`w-12 h-12 rounded-xl border flex items-center justify-center font-black text-lg italic transition-all ${classes} shadow-lg`}
                        >
                          {val}
                        </div>
                      );
                    })}
                    {lastRoll.diceConfig.modifier !== 0 && (
                      <div className="w-12 h-12 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-500 font-black text-lg italic">
                        {lastRoll.diceConfig.modifier > 0
                          ? `+${lastRoll.diceConfig.modifier}`
                          : lastRoll.diceConfig.modifier}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* History & Small Notes Panel */}
      <div className="lg:col-span-4 space-y-6">
        <Card className="flex flex-col h-[calc(100vh-250px)] min-h-[600px]">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <h2 className="text-lg font-black text-white italic tracking-tighter uppercase flex items-center gap-2">
              <Clock size={18} className="text-primary-500" />
              {t("dice.history")}
            </h2>
            <button
              onClick={() => dispatch(clearHistory())}
              className="p-2 text-slate-600 hover:text-rose-500 transition-colors"
              title={t("dice.clear_history")}
            >
              <Trash2 size={18} />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto pr-2 space-y-4 thin-scrollbar">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-700 italic opacity-50">
                <Dice6 size={64} className="mb-4" />
                <p className="font-bold uppercase tracking-widest text-[10px]">
                  {t("dice.no_history")}
                </p>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {history.map((roll) => {
                  const hasCrit =
                    enableCriticalHighlighting &&
                    roll.diceConfig.dieType === 20 &&
                    roll.individual.includes(20);
                  const hasFumble =
                    enableCriticalHighlighting &&
                    roll.diceConfig.dieType === 20 &&
                    roll.individual.includes(1);

                  return (
                    <motion.div
                      key={roll.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 bg-slate-900/30 border rounded-2xl transition-all group hover:bg-slate-900/60 ${
                        hasCrit
                          ? "border-emerald-500/20 saturate-[1.2]"
                          : hasFumble
                            ? "border-rose-500/20 saturate-[1.2]"
                            : "border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
                              {roll.diceConfig.count}d{roll.diceConfig.dieType}
                            </div>
                            <span className="w-1 h-1 rounded-full bg-slate-800" />
                            <div className="text-[10px] font-medium text-slate-600">
                              {roll.timestamp}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {roll.individual.map((v, i) => {
                              const status = getD20Status(
                                v,
                                roll.diceConfig.dieType,
                              );
                              return (
                                <span
                                  key={i}
                                  className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                                    status === "critical"
                                      ? "text-emerald-400 bg-emerald-500/10"
                                      : status === "fumble"
                                        ? "text-rose-400 bg-rose-500/10"
                                        : "text-slate-500 bg-slate-950"
                                  }`}
                                >
                                  {v}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                        <div
                          className={`text-3xl font-black italic transition-colors leading-none ${
                            hasCrit
                              ? "text-emerald-500"
                              : hasFumble
                                ? "text-rose-500"
                                : "text-white group-hover:text-primary-500"
                          }`}
                        >
                          {roll.total}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <button className="w-full flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-slate-700 text-slate-500 hover:text-white transition-all text-xs font-bold uppercase italic tracking-widest">
              <div className="flex items-center gap-2">
                <MessageSquareQuote size={14} className="text-primary-500" />
                Quick Session Notes
              </div>
              <Clock size={12} className="opacity-50" />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DiceRoller;
