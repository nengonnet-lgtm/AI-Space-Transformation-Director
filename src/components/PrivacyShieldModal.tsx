import React from 'react';
import { ShieldCheck, Lock, Trash2, X, AlertTriangle, EyeOff, CheckCircle2 } from 'lucide-react';

interface PrivacyShieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNuclearWipe: () => void;
  scrubData: boolean;
  onToggleScrubData: (val: boolean) => void;
}

export const PrivacyShieldModal: React.FC<PrivacyShieldModalProps> = ({
  isOpen,
  onClose,
  onNuclearWipe,
  scrubData,
  onToggleScrubData,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                มาตรการรักษาความปลอดภัยของข้อมูลผู้ใช้งาน (Privacy Shield)
              </h3>
              <p className="text-[11px] text-emerald-400">
                🔒 ระดับความลับสูงสุด: Client-Side Sandbox & Zero-Leak Architecture
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto text-xs text-slate-300">
          <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-emerald-400 text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>การประมวลผลภายในอุปกรณ์ของผู้ใช้ 100% (Zero-Telemetry)</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              ข้อมูลสถานที่ สไตล์ สภาพห้อง รูปภาพอ้างอิง และข้อความบันทึกของท่านจะถูกประมวลผลอยู่ภายในหน่วยความจำของเบราว์เซอร์เท่านั้น ไม่มีการเก็บบันทึกบนเซิร์ฟเวอร์ภายนอก ไม่มีการส่งต่อไปยังบุคคลที่สาม หรือระบบโฆษณาใดๆ ทั้งสิ้น
            </p>
          </div>

          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-xs">ระบบคัดกรองข้อมูลความลับอัตโนมัติ (Data Scrubber)</h4>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="space-y-0.5 pr-2">
                <div className="font-semibold text-white">Scrub Sensitive Data อัตโนมัติ</div>
                <div className="text-[11px] text-slate-400">
                  ตรวจจับและมาสก์เบอร์โทรศัพท์, อีเมล, ที่อยู่, ซอย/หมู่, และงบประมาณเป็น [CONFIDENTIAL_*]
                </div>
              </div>
              <input
                type="checkbox"
                checked={scrubData}
                onChange={(e) => onToggleScrubData(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs">การลบข้อมูลฉุกเฉิน (Nuclear Wipe)</h4>
            <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2">
              <p className="text-[11px] text-rose-200/90 leading-relaxed">
                หากท่านทำงานบนคอมพิวเตอร์สาธารณะ หรือต้องการล้างประวัติการออกแบบทั้งหมดทันที สามารถคลิกปุ่มด้านล่างเพื่อล้าง Local Storage และหน่วยความจำทั้งหมดให้เป็นศูนย์
              </p>
              <button
                type="button"
                onClick={() => {
                  if (confirm('ยืนยันที่จะลบข้อมูลและประวัติการออกแบบทั้งหมดออกจากเบราว์เซอร์นี้?')) {
                    onNuclearWipe();
                    onClose();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>ลบข้อมูลและประวัติทั้งหมดถาวร (Wipe All Data)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
