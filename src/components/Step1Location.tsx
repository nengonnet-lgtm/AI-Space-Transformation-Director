import React, { useState } from 'react';
import {
  Briefcase,
  Sofa,
  BedDouble,
  UtensilsCrossed,
  CookingPot,
  Bath,
  Shirt,
  Trees,
  SunDim,
  Warehouse,
  PlusCircle,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { LocationItem, LocationCategory } from '../types/director';
import { LOCATION_PRESETS } from '../data/presets';

interface Step1LocationProps {
  selectedLocation: LocationItem | null;
  customLocation: {
    nameTh: string;
    nameEn: string;
    keyElementsTh: string[];
    description: string;
  };
  onSelectPreset: (loc: LocationItem) => void;
  onUpdateCustom: (custom: any) => void;
  onNext: () => void;
}

export const Step1Location: React.FC<Step1LocationProps> = ({
  selectedLocation,
  customLocation,
  onSelectPreset,
  onUpdateCustom,
  onNext,
}) => {
  const [activeTab, setActiveTab] = useState<LocationCategory>('interior_living');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(selectedLocation?.category === 'custom');
  const [customElemInput, setCustomElemInput] = useState<string>('');

  const iconsMap: Record<string, any> = {
    Briefcase,
    Sofa,
    BedDouble,
    UtensilsCrossed,
    CookingPot,
    Bath,
    Shirt,
    Trees,
    SunDim,
    Warehouse,
  };

  const categories = [
    {
      id: 'interior_living' as LocationCategory,
      title: '1. ห้องหลักภายในบ้าน',
      sub: 'Interior Living Areas',
      count: 4,
    },
    {
      id: 'interior_utility' as LocationCategory,
      title: '2. ห้องใช้งานเฉพาะทาง',
      sub: 'Interior Utility Areas',
      count: 3,
    },
    {
      id: 'exterior_outdoor' as LocationCategory,
      title: '3. พื้นที่ภายนอกและรอบบ้าน',
      sub: 'Exterior & Outdoor Areas',
      count: 3,
    },
    {
      id: 'custom' as LocationCategory,
      title: '4. ระบุสถานที่เอง (กำหนดเอง)',
      sub: 'Custom Specific Location',
      count: 1,
    },
  ];

  const filteredPresets = LOCATION_PRESETS.filter((p) => p.category === activeTab);

  const handleAddCustomElem = () => {
    if (!customElemInput.trim()) return;
    onUpdateCustom({
      ...customLocation,
      keyElementsTh: [...customLocation.keyElementsTh, customElemInput.trim()],
    });
    setCustomElemInput('');
  };

  const handleRemoveCustomElem = (index: number) => {
    onUpdateCustom({
      ...customLocation,
      keyElementsTh: customLocation.keyElementsTh.filter((_, i) => i !== index),
    });
  };

  const isCurrentSelectionValid = isCustomMode
    ? Boolean(customLocation.nameTh.trim() && customLocation.keyElementsTh.length > 0)
    : Boolean(selectedLocation);

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              ขั้นตอนที่ 1 จาก 4
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              1. เลือกหรือระบุสถานที่ที่ต้องการรีโนเวท / จัดห้อง
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              เลือกจาก 3 หมวดหมู่มาตรฐานที่มีการระบุรายละเอียดสิ่งของจำเป็นอย่างแม่นยำ หรือพิมพ์ระบุสถานที่ของท่านเอง
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs text-slate-400">สถานะ:</span>
            {isCurrentSelectionValid ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> พร้อมไปขั้นตอนที่ 2
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs">
                โปรดเลือกสถานที่
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => {
              setActiveTab(cat.id);
              if (cat.id === 'custom') {
                setIsCustomMode(true);
              } else {
                setIsCustomMode(false);
              }
            }}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              activeTab === cat.id
                ? 'bg-amber-500/10 border-amber-500/50 text-white ring-1 ring-amber-500/30 shadow-md'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <div className="text-xs font-semibold text-slate-300">{cat.title}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{cat.sub}</div>
          </button>
        ))}
      </div>

      {/* Preset Cards Selection */}
      {!isCustomMode ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPresets.map((loc) => {
            const IconComponent = iconsMap[loc.icon] || Briefcase;
            const isSelected = selectedLocation?.id === loc.id && !isCustomMode;

            return (
              <div
                key={loc.id}
                onClick={() => onSelectPreset(loc)}
                className={`relative p-5 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/20 border-amber-500 ring-2 ring-amber-500/30 shadow-xl shadow-amber-950/30'
                    : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80'
                }`}
              >
                {/* Selection Radio / Badge */}
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`p-2.5 rounded-xl transition ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
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

                {/* Location Title & Sub */}
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition">
                    {loc.nameTh}
                  </h3>
                  <div className="text-xs text-slate-400 font-medium mb-3">{loc.nameEn}</div>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                    {loc.description}
                  </p>

                  {/* Required Key Elements List (from specification) */}
                  <div className="space-y-1.5 pt-3 border-t border-slate-800/80">
                    <span className="text-[11px] font-semibold text-amber-400/90 block">
                      ของสำคัญที่ต้องมีในพรอมต์ (Strict Elements):
                    </span>
                    <ul className="space-y-1">
                      {loc.keyElementsTh.map((elem, idx) => (
                        <li key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                          <span className="text-amber-400 text-sm leading-none">•</span>
                          <span>{elem}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {isSelected && (
                  <div className="mt-4 pt-2 flex items-center justify-end text-xs font-semibold text-amber-400 gap-1">
                    <span>เลือกสถานที่นี้แล้ว</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Custom Location Mode */
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
            <PlusCircle className="w-4 h-4" />
            <span>ระบุสถานที่และสิ่งของจำเป็นด้วยตนเอง (Custom Space Formulation)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                ชื่อสถานที่ภาษาไทย <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="เช่น ห้องสตูดิโอดนตรี, โถงทางเดินแกลเลอรี, ห้องแต่งตัว Walk-in"
                value={customLocation.nameTh}
                onChange={(e) =>
                  onUpdateCustom({
                    ...customLocation,
                    nameTh: e.target.value,
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-400 focus:outline-none text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                ชื่อภาษาอังกฤษ (English Name)
              </label>
              <input
                type="text"
                placeholder="e.g. Acoustic Music Studio, Minimalist Dressing Walk-in"
                value={customLocation.nameEn}
                onChange={(e) =>
                  onUpdateCustom({
                    ...customLocation,
                    nameEn: e.target.value,
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-400 focus:outline-none text-sm text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              สิ่งของที่ต้องปรากฏในฉาก (Key Required Elements - กด Enter หรือคลิกเพิ่ม) <span className="text-rose-400">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="เช่น กีตาร์โปร่งบนขาตั้งไม้, แผงดูดซับเสียงสีเบจ, พรมทอลายเรขาคณิต"
                value={customElemInput}
                onChange={(e) => setCustomElemInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomElem();
                  }
                }}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-400 focus:outline-none text-sm text-white"
              />
              <button
                type="button"
                onClick={handleAddCustomElem}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition cursor-pointer"
              >
                เพิ่ม
              </button>
            </div>

            {/* Elements Chips */}
            <div className="flex flex-wrap gap-2 mt-2.5">
              {customLocation.keyElementsTh.map((elem, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 text-xs text-amber-300 border border-slate-700"
                >
                  {elem}
                  <button
                    type="button"
                    onClick={() => handleRemoveCustomElem(idx)}
                    className="text-slate-400 hover:text-rose-400 text-sm ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
              {customLocation.keyElementsTh.length === 0 && (
                <span className="text-xs text-slate-400 italic">
                  ยังไม่มีสิ่งของที่ระบุ (กรุณาระบุอย่างน้อย 1 รายการ)
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              คำอธิบายภาพรวมบรรยากาศ (Optional Description)
            </label>
            <textarea
              rows={2}
              placeholder="ระบุความต้องการเพิ่มเติม เช่น ต้องการแสงแดดยามเช้าส่องผ่านม่านลินิน..."
              value={customLocation.description}
              onChange={(e) =>
                onUpdateCustom({
                  ...customLocation,
                  description: e.target.value,
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-400 focus:outline-none text-sm text-white"
            />
          </div>
        </div>
      )}

      {/* Step Footer Navigation (Rule: เสร็จขั้นตอนที่ 1 ไปทำขั้นตอนที่ 2) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <div className="text-xs text-slate-400">
          <span className="font-semibold text-slate-300">กฎระบบ:</span> เสร็จขั้นตอนที่ 1 แล้วระบบจะปลดล็อกขั้นตอนที่ 2 (ห้ามข้ามขั้นตอน)
        </div>

        <button
          type="button"
          disabled={!isCurrentSelectionValid}
          onClick={onNext}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
            isCurrentSelectionValid
              ? 'bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-70'
          }`}
        >
          <span>ไปขั้นตอนที่ 2: เลือกสไตล์ภาพรวม</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
