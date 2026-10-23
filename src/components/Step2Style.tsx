import React, { useState } from 'react';
import { Palette, CheckCircle2, ArrowRight, ArrowLeft, Sparkles, Sliders } from 'lucide-react';
import { DesignStyle, DesignStyleId } from '../types/director';
import { STYLE_PRESETS } from '../data/presets';

interface Step2StyleProps {
  selectedStyle: DesignStyle;
  onSelectStyle: (style: DesignStyle) => void;
  onBack: () => void;
  onNext: () => void;
}

export const Step2Style: React.FC<Step2StyleProps> = ({
  selectedStyle,
  onSelectStyle,
  onBack,
  onNext,
}) => {
  const [isCustom, setIsCustom] = useState<boolean>(selectedStyle.id === 'custom');
  const [customStyleState, setCustomStyleState] = useState<DesignStyle>({
    id: 'custom',
    nameTh: 'สไตล์กำหนดเอง (Custom Style)',
    nameEn: 'Bespoke Custom Fusion',
    descriptionTh: 'กำหนดส่วนผสมของพื้นผิวและคู่สีตามโจทย์ของท่าน',
    descriptionEn: 'Custom tailored palette, textures, and atmospheric design.',
    wallTexture: 'Custom finished plaster wall',
    floorTexture: 'Custom architectural flooring',
    woodTone: 'Natural timber accents',
    colorPalette: ['#A09E97', '#D7C4B7', '#F5F2EB', '#685D55'],
    tagline: 'Custom Tailored Aesthetic',
  });

  const handleSelectPreset = (style: DesignStyle) => {
    setIsCustom(false);
    onSelectStyle(style);
  };

  const handleCustomChange = (updated: Partial<DesignStyle>) => {
    const nextStyle: DesignStyle = { ...customStyleState, ...updated };
    setCustomStyleState(nextStyle);
    if (isCustom) {
      onSelectStyle(nextStyle);
    }
  };

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              ขั้นตอนที่ 2 จาก 4
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              2. เลือกหรือระบุสไตล์ภาพรวม (Overall Aesthetic Style)
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              เลือกสไตล์หลักตามข้อกำหนด (Loft, Minimalist, Japandi) หรือใช้สูตรผสมแม่บท Cozy Industrial-Japandi ที่คุมโทนปูนเปลือยและไม้โอ๊คได้เป๊ะที่สุด
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs text-slate-400">สถานะ:</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> เลือก: {selectedStyle.nameTh.split('(')[0]}
            </span>
          </div>
        </div>
      </div>

      {/* Mandatory Mood Constraint Callout */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed">
            <span className="font-bold text-amber-400">กฎเหล็กการคุมมู้ดห้อง (Cozy Industrial-Japandi):</span> ในพรอมต์ของ Veo3 จะถูกกำหนดผิวสัมผัสอย่างละเอียดเสมอ ได้แก่ <span className="text-white font-medium">ผนังปูนเปลือยฉาบขัดมัน (Polished micro-cement)</span>, <span className="text-white font-medium">พื้นไม้ลามิเนตสีโอ๊คอ่อน (Light oak wood floor)</span>, <span className="text-white font-medium">หน้าต่างกระจกสไลด์บานใหญ่ชมวิวทุ่งนา (Rice field view)</span> และ <span className="text-white font-medium">เฟอร์นิเจอร์ไม้ผสมผ้าสีเบจครีม</span> เพื่อความสมจริงสูงสุด
          </div>
        </div>
      </div>

      {/* Style Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {STYLE_PRESETS.map((style) => {
          const isSelected = selectedStyle.id === style.id && !isCustom;
          const isSignature = style.id === 'cozy_industrial_japandi';

          return (
            <div
              key={style.id}
              onClick={() => handleSelectPreset(style)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-b from-slate-900 to-amber-950/30 border-amber-500 ring-2 ring-amber-500/30 shadow-xl'
                  : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80'
              }`}
            >
              {isSignature && (
                <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 text-[10px] font-black tracking-wider uppercase shadow">
                  แนะนำตามกฎเหล็ก
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    {style.nameTh}
                  </h3>
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

                <div className="text-xs text-amber-400/90 font-medium mb-2.5">{style.tagline}</div>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">{style.descriptionTh}</p>

                {/* Color Palette Chips */}
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="text-[11px] text-slate-400 mr-1">ชุดสี (Palette):</span>
                  {style.colorPalette.map((color, idx) => (
                    <span
                      key={idx}
                      className="w-5 h-5 rounded-full border border-slate-700/80 shadow-sm"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>

                {/* Materials Details */}
                <div className="text-[11px] text-slate-400 space-y-1 pt-2 border-t border-slate-800/80">
                  <div>
                    <span className="text-slate-300 font-medium">ผนัง:</span> {style.wallTexture}
                  </div>
                  <div>
                    <span className="text-slate-300 font-medium">พื้น:</span> {style.floorTexture}
                  </div>
                </div>
              </div>

              {isSelected && (
                <div className="mt-4 pt-2 flex items-center justify-end text-xs font-semibold text-amber-400 gap-1">
                  <span>เลือกสไตล์นี้แล้ว</span>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Custom Style Toggle Option */}
      <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-semibold text-white">ต้องการกำหนดสไตล์ผสมผสานเอง?</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsCustom(!isCustom);
              if (!isCustom) {
                onSelectStyle(customStyleState);
              } else {
                onSelectStyle(STYLE_PRESETS[0]);
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">ชื่อสไตล์ที่ต้องการ</label>
                <input
                  type="text"
                  value={customStyleState.nameTh}
                  onChange={(e) => handleCustomChange({ nameTh: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  placeholder="เช่น Minimalist Bohemian, Dark Luxury Loft"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">คำบรรยายผิวสัมผัสผนังและพื้น</label>
                <input
                  type="text"
                  value={customStyleState.descriptionTh}
                  onChange={(e) => handleCustomChange({ descriptionTh: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  placeholder="เช่น ผนังหินอ่อนดำ ผสานพื้นไม้สักทอง"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Step Footer Navigation (Rule: เสร็จขั้นตอนที่ 2 ไปทำขั้นตอนที่ 3) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ย้อนกลับ: ขั้นตอนที่ 1 (สถานที่)</span>
        </button>

        <div className="text-xs text-slate-400">
          <span className="font-semibold text-slate-300">กฎระบบ:</span> เสร็จขั้นตอนที่ 2 แล้วไปขั้นตอนที่ 3
        </div>

        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition cursor-pointer"
        >
          <span>ไปขั้นตอนที่ 3: เลือกสภาพของสถานที่</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
