import React, { useState } from 'react';
import { Hammer, CheckCircle2, ArrowRight, ArrowLeft, Layers, Box, AlertTriangle, PlusCircle } from 'lucide-react';
import { RoomCondition, RoomConditionId } from '../types/director';
import { CONDITION_PRESETS } from '../data/presets';

interface Step3ConditionProps {
  selectedCondition: RoomCondition;
  onSelectCondition: (condition: RoomCondition) => void;
  onBack: () => void;
  onNext: () => void;
}

export const Step3Condition: React.FC<Step3ConditionProps> = ({
  selectedCondition,
  onSelectCondition,
  onBack,
  onNext,
}) => {
  const [isCustom, setIsCustom] = useState<boolean>(selectedCondition.id === 'custom');
  const [customConditionState, setCustomConditionState] = useState<RoomCondition>({
    id: 'custom',
    nameTh: 'สภาพสถานที่แบบกำหนดเอง (Custom State)',
    nameEn: 'Custom Pre-Renovation Condition',
    descriptionTh: 'ระบุสภาพเริ่มต้นของห้องตามภาพถ่ายหรือพื้นที่จริง',
    descriptionEn: 'User defined initial room condition and baseline elements.',
    promptPhrase: 'A custom room setting requiring transformation.',
  });

  const conditionIcons: Record<string, any> = {
    empty: Layers,
    cluttered: Box,
    under_construction: AlertTriangle,
  };

  const handleSelectPreset = (cond: RoomCondition) => {
    setIsCustom(false);
    onSelectCondition(cond);
  };

  const handleCustomChange = (updated: Partial<RoomCondition>) => {
    const nextCond = { ...customConditionState, ...updated };
    setCustomConditionState(nextCond);
    if (isCustom) {
      onSelectCondition(nextCond);
    }
  };

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              ขั้นตอนที่ 3 จาก 4
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              3. เลือกหรือระบุสภาพเริ่มต้นของสถานที่ (Starting Condition)
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              สภาพก่อนเริ่มแปลงโฉมจะกำหนดพฤติกรรมการกวาด ขนย้าย หรือฉาบปูนใน Scene 1 ของ Veo3 อย่างสมจริง
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs text-slate-400">สถานะ:</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> เลือก: {selectedCondition.nameTh.split('(')[0]}
            </span>
          </div>
        </div>
      </div>

      {/* Preset Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CONDITION_PRESETS.map((cond) => {
          const Icon = conditionIcons[cond.id] || Hammer;
          const isSelected = selectedCondition.id === cond.id && !isCustom;

          return (
            <div
              key={cond.id}
              onClick={() => handleSelectPreset(cond)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/30 border-amber-500 ring-2 ring-amber-500/30 shadow-xl'
                  : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`p-2.5 rounded-xl transition ${
                      isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500 text-slate-950'
                        : 'border-slate-700 bg-slate-950'
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-slate-950" />}
                  </div>
                </div>

                <h3 className="text-base font-bold text-white mb-1.5">{cond.nameTh}</h3>
                <div className="text-xs text-amber-400/90 font-medium mb-3">{cond.nameEn}</div>
                <p className="text-xs text-slate-400 leading-relaxed">{cond.descriptionTh}</p>
              </div>

              {isSelected && (
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-end text-xs font-semibold text-amber-400 gap-1">
                  <span>เลือกสภาพนี้แล้ว</span>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Custom Condition Option */}
      <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-semibold text-white">ต้องการระบุสภาพห้องแบบเฉพาะเจาะจง?</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsCustom(!isCustom);
              if (!isCustom) {
                onSelectCondition(customConditionState);
              } else {
                onSelectCondition(CONDITION_PRESETS[0]);
              }
            }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
              isCustom
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {isCustom ? '✓ ใช้งานแบบกำหนดเอง' : 'เปิดโหมดกำหนดเอง'}
          </button>
        </div>

        {isCustom && (
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <div>
              <label className="block text-xs text-slate-300 mb-1">
                รายละเอียดสภาพห้องเริ่มต้น (Initial Condition Detail)
              </label>
              <textarea
                rows={2}
                value={customConditionState.descriptionTh}
                onChange={(e) =>
                  handleCustomChange({
                    descriptionTh: e.target.value,
                    promptPhrase: `A space in custom initial condition: ${e.target.value}`,
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                placeholder="เช่น ห้องที่มีคราบน้ำบนเพดานเล็กน้อย มีกองหนังสือพิมพ์เก่า และแสงแดดลอดผ่านซอกหน้าต่าง..."
              />
            </div>
          </div>
        )}
      </div>

      {/* Step Footer Navigation (Rule: เสร็จขั้นตอนที่ 3 ไปทำขั้นตอนที่ 4) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ย้อนกลับ: ขั้นตอนที่ 2 (สไตล์ภาพรวม)</span>
        </button>

        <div className="text-xs text-slate-400">
          <span className="font-semibold text-slate-300">กฎระบบ:</span> เสร็จขั้นตอนที่ 3 แล้วไปขั้นตอนที่ 4 (เลือกรูปแบบพรอมต์)
        </div>

        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition cursor-pointer"
        >
          <span>ไปขั้นตอนที่ 4: เลือกรูปแบบการเขียนพรอมต์</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
