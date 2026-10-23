import React from 'react';
import { MapPin, Palette, Hammer, Sparkles, Check, Lock } from 'lucide-react';

interface StepProgressBarProps {
  currentStep: number;
  maxReachedStep: number;
  onStepClick: (step: number) => void;
  isComplete: boolean;
}

export const StepProgressBar: React.FC<StepProgressBarProps> = ({
  currentStep,
  maxReachedStep,
  onStepClick,
  isComplete,
}) => {
  const steps = [
    { number: 1, label: 'ขั้นตอนที่ 1: สถานที่', shortLabel: 'สถานที่', icon: MapPin },
    { number: 2, label: 'ขั้นตอนที่ 2: สไตล์ภาพรวม', shortLabel: 'สไตล์', icon: Palette },
    { number: 3, label: 'ขั้นตอนที่ 3: สภาพของสถานที่', shortLabel: 'สภาพเดิม', icon: Hammer },
    { number: 4, label: 'ขั้นตอนที่ 4: รูปแบบพรอมต์', shortLabel: 'รูปแบบพรอมต์', icon: Sparkles },
  ];

  return (
    <div className="w-full bg-slate-900/60 border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between relative">
          {/* Background Connecting Line */}
          <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 h-1 bg-slate-800 rounded z-0" />
          <div
            className="absolute top-1/2 left-0 -translate-y-1/2 h-1 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-400 rounded transition-all duration-300 z-0"
            style={{
              width: `${((Math.min(currentStep, 4) - 1) / 3) * 100}%`,
            }}
          />

          {steps.map((step) => {
            const Icon = step.icon;
            const isCurrent = currentStep === step.number;
            const isPassed = currentStep > step.number || isComplete;
            const isClickable = step.number <= maxReachedStep;

            return (
              <div key={step.number} className="relative z-10 flex flex-col items-center">
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && onStepClick(step.number)}
                  className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 transition-all duration-200 ${
                    isPassed
                      ? 'bg-amber-500 border-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/30'
                      : isCurrent
                      ? 'bg-slate-950 border-amber-400 text-amber-400 ring-4 ring-amber-500/20 shadow-lg'
                      : isClickable
                      ? 'bg-slate-900 border-slate-600 text-slate-400 hover:border-slate-400 cursor-pointer'
                      : 'bg-slate-950 border-slate-800 text-slate-600 cursor-not-allowed opacity-80'
                  }`}
                  title={
                    !isClickable
                      ? 'ห้ามข้ามขั้นตอน: กรุณาทำขั้นตอนก่อนหน้าให้เสร็จสิ้น'
                      : step.label
                  }
                >
                  {isPassed ? (
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                  ) : !isClickable ? (
                    <Lock className="w-3.5 h-3.5 text-slate-600" />
                  ) : (
                    <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  )}
                </button>

                <div className="mt-1.5 text-center">
                  <span
                    className={`block text-[11px] sm:text-xs font-medium tracking-tight ${
                      isCurrent
                        ? 'text-amber-400 font-semibold'
                        : isPassed
                        ? 'text-slate-300'
                        : 'text-slate-500'
                    }`}
                  >
                    <span className="hidden sm:inline">{step.label}</span>
                    <span className="sm:hidden">{step.shortLabel}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Warning label reinforcing rule */}
        <div className="mt-2 text-center">
          <p className="text-[11px] text-slate-400">
            ⚠️ กฎสถาปัตยกรรม: ต้องเลือกทีละขั้นตอน <span className="text-amber-400 font-semibold">ห้ามข้ามขั้นตอนเด็ดขาด</span> เพื่อความสมบูรณ์แบบของคำสั่ง Veo3
          </p>
        </div>
      </div>
    </div>
  );
};
