import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { updateSystemPreset } from "../../features/presets/presetsSlice";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

const DIE_OPTIONS = [4, 6, 8, 10, 12, 20, 100];

const SystemPresetsEditorModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const defaultPresets = useSelector((s) => s.presets.defaultPresets);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setRows(defaultPresets.map((p) => ({ ...p })));
    }
  }, [isOpen, defaultPresets]);

  const patchRow = (id, field, raw) => {
    const num = field === "type" ? parseInt(raw, 10) : parseInt(raw, 10) || 0;
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              [field]:
                field === "dice"
                  ? Math.min(99, Math.max(1, num || 1))
                  : field === "type"
                    ? DIE_OPTIONS.includes(num)
                      ? num
                      : r.type
                    : num,
            }
          : r,
      ),
    );
  };

  const handleSave = () => {
    rows.forEach((r) => {
      dispatch(
        updateSystemPreset({
          id: r.id,
          updates: { dice: r.dice, type: r.type, modifier: r.modifier },
        }),
      );
    });
    onClose();
  };

  const footer = (
    <>
      <button
        type="button"
        onClick={onClose}
        className="px-6 py-2 text-sm font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest italic"
      >
        {t("common.back")}
      </button>
      <Button type="button" onClick={handleSave}>
        {t("presets.save_all_system")}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("presets.edit_system_presets")}
      footer={footer}
    >
      <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto">
        <p className="text-xs text-slate-500 italic leading-relaxed">
          {t("presets.edit_system_hint")}
        </p>
        {rows.map((p) => (
          <div
            key={p.id}
            className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto] gap-3 items-end p-4 rounded-2xl bg-slate-950/60 border border-slate-800"
          >
            <div>
              <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">
                {t(p.label)}
              </div>
              <div className="text-[10px] text-slate-600 font-mono">
                {p.dice}d{p.type}
                {p.modifier >= 0 ? "+" : ""}
                {p.modifier}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-black text-slate-600 uppercase">
                {t("presets.fields.dice")}
              </label>
              <input
                type="number"
                min={1}
                max={99}
                value={p.dice}
                onChange={(e) => patchRow(p.id, "dice", e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm font-bold w-full sm:w-20 text-center"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-black text-slate-600 uppercase">
                {t("presets.fields.type")}
              </label>
              <select
                value={p.type}
                onChange={(e) => patchRow(p.id, "type", e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm font-bold appearance-none text-center"
              >
                {DIE_OPTIONS.map((d) => (
                  <option key={d} value={d}>
                    d{d}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-black text-slate-600 uppercase">
                {t("presets.fields.mod")}
              </label>
              <input
                type="number"
                value={p.modifier}
                onChange={(e) => patchRow(p.id, "modifier", e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm font-bold w-full sm:w-24 text-center"
              />
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default SystemPresetsEditorModal;
