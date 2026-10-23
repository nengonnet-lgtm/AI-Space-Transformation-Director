import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  ShieldCheck,
  Zap,
  Info,
  Clock,
  Layers,
  Camera,
  Volume2,
  Trash2,
  Plus,
  Loader2,
  X,
} from 'lucide-react';
import { PromptModeId, ReferenceImageItem } from '../types/director';
import { PROMPT_MODES } from '../data/presets';
import { processImageFile, formatFileSize } from '../utils/imageUtils';

interface Step4ModeProps {
  selectedMode: PromptModeId;
  onSelectMode: (mode: PromptModeId) => void;
  customNotes: string;
  onUpdateNotes: (notes: string) => void;
  referenceImages?: ReferenceImageItem[];
  onAddImages?: (images: ReferenceImageItem[]) => void;
  onRemoveImageItem?: (id: string) => void;
  onClearAllImages?: () => void;
  referenceImageName?: string;
  referenceImagePreview?: string;
  onImageUpload?: (name: string, dataUrl: string) => void;
  onRemoveImage?: () => void;
  scrubData: boolean;
  onToggleScrubData: (scrub: boolean) => void;
  onBack: () => void;
  onGenerate: () => void;
  isGeneratingAI: boolean;
  onGenerateWithAI: () => void;
  hasApiKey: boolean;
  activeApiKey?: string | null;
  onOpenAuthModal?: () => void;
  googleUser?: any;
}

export const Step4Mode: React.FC<Step4ModeProps> = ({
  selectedMode,
  onSelectMode,
  customNotes,
  onUpdateNotes,
  referenceImages = [],
  onAddImages,
  onRemoveImageItem,
  onClearAllImages,
  referenceImageName,
  referenceImagePreview,
  onImageUpload,
  onRemoveImage,
  scrubData,
  onToggleScrubData,
  onBack,
  onGenerate,
  isGeneratingAI,
  onGenerateWithAI,
  hasApiKey,
  activeApiKey,
  onOpenAuthModal,
  googleUser,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fallback combined list
  const activeImages: ReferenceImageItem[] =
    referenceImages.length > 0
      ? referenceImages
      : referenceImagePreview
      ? [
          {
            id: 'legacy-single',
            name: referenceImageName || 'reference-image.jpg',
            previewUrl: referenceImagePreview,
          },
        ]
      : [];

  const handleProcessFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (fileArray.length === 0) return;

    setIsProcessing(true);
    try {
      const processed = await Promise.all(fileArray.map((f) => processImageFile(f)));
      if (onAddImages) {
        onAddImages(processed);
      } else if (onImageUpload && processed[0]) {
        onImageUpload(processed[0].name, processed[0].previewUrl);
      }
    } catch (err) {
      console.error('Failed to process image files', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleProcessFiles(e.target.files);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              ขั้นตอนที่ 4 จาก 4 (ขั้นตอนสุดท้าย)
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              4. เลือกรูปแบบการเขียนพรอมต์ (Core Prompting Modes)
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              เลือก 1 ใน 3 โหมดสถาปัตยกรรมพรอมต์เพื่อสร้างคำสั่งวิดีโอ Veo3 บน Google Flow ได้ตรงเป้าหมายที่สุด
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs text-slate-400">สถานะ:</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> เลือกรูปแบบที่ {selectedMode}
            </span>
          </div>
        </div>
      </div>

      {/* Mode Selection Cards (3 Modes from Prompt Spec) */}
      <div className="space-y-4">
        {PROMPT_MODES.map((mode) => {
          const isSelected = selectedMode === mode.id;

          return (
            <div
              key={mode.id}
              onClick={() => onSelectMode(mode.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 border-amber-500 ring-2 ring-amber-500/40 shadow-xl'
                  : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/70'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-black ${
                        isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {mode.id}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      {mode.titleTh}
                    </h3>
                  </div>

                  <div className="text-xs text-amber-400 font-semibold">{mode.tagline}</div>
                  <div className="text-xs text-slate-400">{mode.durationText}</div>

                  <div className="text-xs text-slate-400 whitespace-pre-line leading-relaxed bg-slate-950/50 p-3 rounded-xl border border-slate-850">
                    {mode.descriptionTh}
                  </div>
                </div>

                {/* Selection Radio / Visual Icon */}
                <div className="flex md:flex-col items-center justify-between md:items-end gap-3 shrink-0">
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center transition ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500 text-slate-950'
                        : 'border-slate-700 bg-slate-950'
                    }`}
                  >
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-slate-950" />}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    {mode.id === 1 && <Layers className="w-4 h-4 text-amber-400" />}
                    {mode.id === 2 && <Camera className="w-4 h-4 text-rose-400" />}
                    {mode.id === 3 && <Volume2 className="w-4 h-4 text-emerald-400" />}
                    <span>{mode.scenesCount} ฉาก/เฟส</span>
                  </div>
                </div>
              </div>

              {isSelected && (
                <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-amber-400">
                  <span className="font-semibold">✓ เลือกโหมดนี้สำหรับสถาปัตยกรรมพรอมต์</span>
                  <span className="text-[11px] text-slate-400">
                    (หลังจากสร้างเสร็จ สามารถสลับดูผลลัพธ์ของโหมดอื่นได้ตลอดเวลา)
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Additional Options: Image Reference & Data Scrubber */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Upload Reference Images (Multi-image support, Client-side only) */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              handleProcessFiles(e.dataTransfer.files);
            }
          }}
          className={`bg-slate-900/50 p-5 rounded-2xl border transition space-y-3 ${
            dragOver ? 'border-amber-400 bg-amber-500/10' : 'border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-amber-400" />
              <span>ภาพอ้างอิงเฟอร์นิเจอร์ / ของตกแต่ง (Reference Assets)</span>
            </label>
            {activeImages.length > 0 ? (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                แนบแล้ว {activeImages.length} ภาพ
              </span>
            ) : (
              <span className="text-[10px] text-slate-400">ไม่บังคับ (อัปโหลดได้หลายภาพ)</span>
            )}
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            ตามกฎข้อที่ 4 (Image Reference Focus): สามารถอัปโหลดภาพถ่ายของโต๊ะ เก้าอี้ โคมไฟ หรือของตกแต่งได้มากกว่า 1 รูป เพื่อให้ระบบสั่งการกล้อง Veo3 ทำ Close-up / Macro tracking shot เจาะลึกดีเทลในวินาทีท้ายๆ
          </p>

          {isProcessing && (
            <div className="flex items-center justify-center gap-2 py-6 bg-slate-950/80 rounded-xl border border-amber-500/30 text-amber-400 text-xs font-medium">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>กำลังประมวลผลรูปภาพ กรุณารอสักครู่...</span>
            </div>
          )}

          {!isProcessing && activeImages.length === 0 && (
            <div className="border-2 border-dashed rounded-xl p-5 text-center transition cursor-pointer border-slate-800 hover:border-amber-400/50 bg-slate-950/60">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="ref-upload-input"
              />
              <label htmlFor="ref-upload-input" className="cursor-pointer block">
                <Upload className="w-7 h-7 text-amber-400 mx-auto mb-2" />
                <span className="text-xs font-semibold text-amber-400 hover:text-amber-300 block">
                  คลิกเพื่อเลือกรูปภาพ (เลือกได้หลายรูปพร้อมกัน) หรือลากมาวาง
                </span>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  รองรับภาพถ่ายโต๊ะ เก้าอี้ โคมไฟ พรม หรือของตกแต่งมุมต่างๆ
                </span>
                <span className="text-[10px] text-slate-500 mt-2 block">
                  🔒 ภาพเก็บไว้ในเบราว์เซอร์ของท่านเท่านั้น ไม่มีการส่งออกภายนอก
                </span>
              </label>
            </div>
          )}

          {!isProcessing && activeImages.length > 0 && (
            <div className="space-y-3">
              {/* Image Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto pr-1">
                {activeImages.map((img, index) => (
                  <div
                    key={img.id || index}
                    className="relative group rounded-xl overflow-hidden bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex flex-col"
                  >
                    <div className="relative aspect-video sm:aspect-square bg-slate-900 overflow-hidden">
                      <img
                        src={img.previewUrl}
                        alt={img.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-bold text-amber-300 border border-white/10">
                        #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onRemoveImageItem && img.id) {
                            onRemoveImageItem(img.id);
                          } else if (onRemoveImage) {
                            onRemoveImage();
                          }
                        }}
                        className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/70 hover:bg-rose-500 text-slate-300 hover:text-white transition shadow cursor-pointer opacity-90 group-hover:opacity-100"
                        title="ลบรูปภาพนี้"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="p-2 text-left bg-slate-950/95 border-t border-slate-800/80">
                      <div className="text-[11px] font-medium text-slate-200 truncate" title={img.name}>
                        {img.name}
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center justify-between mt-0.5">
                        <span>{formatFileSize(img.size)}</span>
                        <span className="text-emerald-400 text-[9px]">พร้อมใช้งาน</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="ref-add-more-input"
                  />
                  <label
                    htmlFor="ref-add-more-input"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold cursor-pointer transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>เพิ่มรูปภาพอีก</span>
                  </label>

                  {activeImages.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (onClearAllImages) {
                          onClearAllImages();
                        } else if (onRemoveImage) {
                          onRemoveImage();
                        }
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-rose-400 hover:text-rose-300 rounded-lg bg-slate-900 border border-slate-800 transition cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>ล้างทั้งหมด</span>
                    </button>
                  )}
                </div>

                <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>แนบภาพสำเร็จ ({activeImages.length} ภาพ)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Confidentiality & Custom Notes */}
        <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>การรักษาความลับ & บันทึกเพิ่มเติม</span>
            </label>
            {/* Scrubber Toggle */}
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={scrubData}
                onChange={(e) => onToggleScrubData(e.target.checked)}
                className="w-3.5 h-3.5 accent-emerald-500 rounded cursor-pointer"
              />
              <span className="text-[11px] text-slate-300 font-medium">Scrub ข้อมูลส่วนบุคคล</span>
            </label>
          </div>

          <textarea
            rows={3}
            placeholder="ใส่รายละเอียดเสริม เช่น ต้องการเน้นงานไม้สีอ่อน, หน้าต่างมีม่านลินิน, บรรยากาศแสงยามเย็น..."
            value={customNotes}
            onChange={(e) => onUpdateNotes(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
          />

          <div className="text-[11px] text-slate-400 leading-relaxed flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>
              ระบบจะคัดกรองเบอร์โทรศัพท์ อีเมล งบประมาณ และที่อยู่ออกจากข้อความก่อนประมวลผลอัตโนมัติ
            </span>
          </div>
        </div>
      </div>

      {/* Step Footer Navigation & Generation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ย้อนกลับ: ขั้นตอนที่ 3 (สภาพสถานที่)</span>
        </button>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
          {/* Quick API Key / Google Status Pill */}
          <button
            type="button"
            onClick={onOpenAuthModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-750 text-slate-300 hover:text-white text-xs font-medium transition cursor-pointer"
            title="ตั้งค่า API Key หรือเข้าใช้งานด้วยบัญชี Google Gmail"
          >
            <span className={`w-2 h-2 rounded-full ${hasApiKey || activeApiKey ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            <span className="hidden sm:inline">
              {googleUser ? googleUser.email : activeApiKey ? 'API Key (ส่วนตัว)' : 'API Key / Google'}
            </span>
          </button>

          {/* AI Polish Button (if backend Gemini API is available) */}
          {hasApiKey && (
            <button
              type="button"
              disabled={isGeneratingAI}
              onClick={onGenerateWithAI}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-purple-950/70 hover:bg-purple-900/80 border border-purple-500/40 text-purple-200 text-xs font-bold transition shadow cursor-pointer disabled:opacity-50"
              title="ใช้ Gemini 3.8 Flash ช่วยขัดเกลาพรอมต์ภาษาอังกฤษแบบไฮเปอร์คัสตอม"
            >
              <Zap className="w-4 h-4 text-purple-400" />
              <span>{isGeneratingAI ? 'กำลังประมวลผล AI...' : 'AI Director Polish (Gemini)'}</span>
            </button>
          )}

          {/* Primary Generation Button (Deterministic Engine) */}
          <button
            type="button"
            onClick={onGenerate}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2.5 px-7 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-amber-400 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 transition-all transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>สร้างสถาปัตยกรรมพรอมต์ (Generate Veo3 Prompts)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
