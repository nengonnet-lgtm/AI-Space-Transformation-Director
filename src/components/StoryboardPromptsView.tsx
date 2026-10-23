import React, { useState } from 'react';
import {
  Copy,
  Check,
  Film,
  Camera,
  Volume2,
  AlertTriangle,
  Layers,
  Sparkles,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import {
  StoryboardPromptsGroup,
  StoryboardImagePromptItem,
  PromptModeId,
} from '../types/director';

interface StoryboardPromptsViewProps {
  storyboardPrompts: StoryboardPromptsGroup;
  initialMode: PromptModeId;
  onSwitchMode?: (mode: PromptModeId) => void;
}

export const StoryboardPromptsView: React.FC<StoryboardPromptsViewProps> = ({
  storyboardPrompts,
  initialMode,
  onSwitchMode,
}) => {
  const [activeTab, setActiveTab] = useState<PromptModeId>(initialMode || 3);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [expandedBreakdown, setExpandedBreakdown] = useState<Record<string, boolean>>({
    'mode1-scene1': true,
    'mode1-scene2': true,
    'mode2-7shots': true,
    'mode3-scene1-10': true,
    'mode3-scene11-20': true,
  });

  const activeModeData =
    activeTab === 1
      ? storyboardPrompts.mode1
      : activeTab === 2
      ? storyboardPrompts.mode2
      : storyboardPrompts.mode3;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2500);
  };

  const handleCopyAllForCurrentMode = () => {
    const formatted = activeModeData.items
      .map(
        (item) => `========================================================
[STORYBOARD 9:16 IMAGE PROMPT ${item.imageIndex}/${activeModeData.totalImagesCount}]
TITLE: ${item.titleTh} (${item.titleEn})
TIMECODE: ${item.timeCodeRange}
CAMERA ANGLE: ${item.cameraDirection}
MOTION COMMAND: ${item.motionCommand}
ASMR SOUND TARGET: ${item.asmrTarget}
${item.continuityNotice ? `CONTINUITY: ${item.continuityNotice}\n` : ''}
SUB-PHASES / DETAILED STEPS:
${item.subPhases.map((s) => `  - ${s.subIndex || ''} ${s.labelTh} [${s.timeCode}] (${s.camera}): ${s.action} (ASMR: ${s.asmrTarget})`).join('\n')}

--- MASTER 9:16 IMAGE PROMPT (IMAGEN 3 / MIDJOURNEY / VEO3 REFERENCE) ---
${item.imagePrompt9x16}

--- MANDATORY NEGATIVE PROMPT ---
${item.negativePrompt}
`
      )
      .join('\n\n');

    handleCopy(formatted, `all-storyboard-mode-${activeTab}`);
  };

  const toggleBreakdown = (id: string) => {
    setExpandedBreakdown((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section className="bg-slate-900/70 p-5 sm:p-6 rounded-2xl border border-amber-500/25 space-y-6 shadow-xl shadow-black/40">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-rose-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                พรอมต์รูปภาพสตอรี่บอร์ด ขนาด 9:16
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                อัตราส่วน 9:16 Portrait
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              สร้างพรอมต์สำหรับเจนเนอเรทภาพสตอรี่บอร์ด 9:16 ด้วย Google Imagen 3, Midjourney หรือใช้เป็น Reference Image ใน Google Flow / Veo3 พร้อมป้ายกำกับ Timecode, กล้อง, โมชั่น, เสียง ASMR และจุดล็อกความต่อเนื่อง
            </p>
          </div>
        </div>

        {/* Copy All Button */}
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <button
            type="button"
            onClick={handleCopyAllForCurrentMode}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-rose-500/20 hover:from-amber-500/30 hover:to-rose-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition shadow-sm cursor-pointer"
          >
            {copiedKey === `all-storyboard-mode-${activeTab}` ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">คัดลอกสตอรี่บอร์ดทั้งหมดแล้ว!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>คัดลอกพรอมต์ภาพทั้งหมด (รูปแบบที่ {activeTab})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
          <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
          <span>เลือกรูปแบบสตอรี่บอร์ด:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 w-full sm:w-auto">
          {[
            { id: 1, name: 'รูปแบบที่ 1', note: '2 รูป (ตามเฟสก่อสร้าง & จัดวาง)' },
            { id: 2, name: 'รูปแบบที่ 2', note: '1 รูป (7 ช็อต Jump Cut)' },
            { id: 3, name: 'รูปแบบที่ 3', note: '2 รูป (20 คีย์เฟรม ASMR)' },
          ].map((tab) => {
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as PromptModeId);
                  if (onSwitchMode) onSwitchMode(tab.id as PromptModeId);
                }}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition cursor-pointer text-left sm:text-center ${
                  isCurrent
                    ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div>{tab.name}</div>
                <div
                  className={`text-[10px] font-normal ${
                    isCurrent ? 'text-slate-900 font-medium' : 'text-slate-500'
                  }`}
                >
                  {tab.note}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Description Banner for Selected Mode */}
      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="font-semibold text-white">{activeModeData.modeTitleTh}:</span>
          <span className="text-slate-400">{activeModeData.descriptionTh}</span>
        </div>
        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-400 font-mono">
          จำนวนภาพ 9:16: {activeModeData.totalImagesCount} รูป
        </span>
      </div>

      {/* List of Storyboard 9:16 Image Items */}
      <div className="space-y-6">
        {activeModeData.items.map((item) => {
          const isExpanded = expandedBreakdown[item.id] ?? true;

          return (
            <div
              key={item.id}
              className="bg-slate-950 rounded-2xl border border-slate-800 hover:border-slate-750 transition overflow-hidden shadow-lg"
            >
              {/* Item Card Header */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border-b border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold font-mono">
                      ภาพที่ {item.imageIndex} / {activeModeData.totalImagesCount} (9:16)
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[11px] font-mono">
                      ⏱️ {item.timeCodeRange}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      โมเดลแนะนำ: {item.recommendedModel}
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    {item.titleTh}
                  </h4>
                  <p className="text-xs text-slate-400">{item.titleEn}</p>
                </div>

                <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopy(item.imagePrompt9x16, `prompt-${item.id}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-semibold transition cursor-pointer"
                  >
                    {copiedKey === `prompt-${item.id}` ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300">คัดลอกพรอมต์ภาพแล้ว!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>คัดลอกพรอมต์ภาพนี้ (Imagen 3 / Veo3)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Continuity Lock Anchor (if applicable) */}
              {item.isContinuityAnchor && (
                <div className="mx-4 sm:mx-5 mt-4 p-3.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-amber-500/10 border border-amber-500/40 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-300 uppercase tracking-wide">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>⚠️ CONTINUITY LOCK ANCHOR (จุดล็อกความต่อเนื่องของโครงสร้างห้อง)</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    {item.continuityNotice}
                  </p>
                </div>
              )}

              {/* Precise Labels (ป้ายกำกับแม่นยำ) */}
              <div className="p-4 sm:p-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Camera Angle */}
                  <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                      <Camera className="w-3.5 h-3.5" />
                      <span>ทิศทางมุมกล้อง (Camera Angle)</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.cameraDirection}
                    </p>
                  </div>

                  {/* Motion Command */}
                  <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>คำสั่งการเคลื่อนไหว (Motion / Action)</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.motionCommand}
                    </p>
                  </div>

                  {/* ASMR Sound Target */}
                  <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>เป้าหมายเสียง ASMR (Audio AI Target)</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.asmrTarget}
                    </p>
                  </div>
                </div>

                {/* Sub-Phases / Detailed Breakdown Table/Accordion */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleBreakdown(item.id)}
                    className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-bold text-slate-300 hover:text-white bg-slate-900/90 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-amber-400" />
                      <span>
                        รายละเอียดขั้นตอนย่อยในภาพนี้ ({item.subPhases.length} ขั้นตอนย่อย)
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <span>{isExpanded ? 'ย่อรายละเอียด' : 'ดูรายละเอียด'}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-3 divide-y divide-slate-850 space-y-2">
                      {item.subPhases.map((sp, idx) => (
                        <div key={idx} className="pt-2 first:pt-0 space-y-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-bold">
                                {sp.subIndex || `#${idx + 1}`}
                              </span>
                              <span className="font-semibold text-white">{sp.labelTh}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400">
                              <span className="font-mono text-amber-400">{sp.timeCode}</span>
                              <span>•</span>
                              <span className="text-slate-300">{sp.camera}</span>
                            </div>
                          </div>
                          <div className="text-[11px] text-slate-300 pl-2 border-l border-slate-800 ml-1">
                            {sp.action}
                          </div>
                          <div className="text-[10px] text-emerald-400/90 pl-2 border-l border-emerald-900/50 ml-1 flex items-center gap-1">
                            <Volume2 className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span>ASMR: {sp.asmrTarget}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Master 9:16 Image Generation Prompt Box */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>
                        พรอมต์ภาพขนาด 9:16 พร้อมใช้งาน (Google Imagen 3 / Midjourney / Veo3 Asset)
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleCopy(item.imagePrompt9x16, `master-${item.id}`)}
                      className="text-xs text-slate-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition"
                    >
                      {copiedKey === `master-${item.id}` ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400 font-semibold">คัดลอกแล้ว</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>คัดลอก</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Code block with 9:16 prompt */}
                  <div className="relative group">
                    <div className="bg-slate-900/90 rounded-xl p-3.5 text-xs font-mono text-slate-200 border border-slate-800 leading-relaxed break-words whitespace-pre-wrap select-all">
                      {item.imagePrompt9x16}
                    </div>
                  </div>

                  {/* Negative Prompt note */}
                  <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-900/40 text-[11px] text-rose-300/90 flex items-start gap-1.5">
                    <span className="font-bold text-rose-400 shrink-0">Negative Prompt บังคับ:</span>
                    <span className="text-slate-400 truncate">
                      {item.negativePrompt}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
