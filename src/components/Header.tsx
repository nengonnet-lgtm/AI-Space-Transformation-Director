import React from 'react';
import {
  ShieldCheck,
  RotateCcw,
  History,
  Lock,
  Film,
  Key,
  User,
} from 'lucide-react';
import { GoogleUserProfile } from '../types/auth';

interface HeaderProps {
  onReset: () => void;
  onOpenPrivacy: () => void;
  onOpenHistory: () => void;
  historyCount: number;
  onOpenAuthModal: () => void;
  googleUser: GoogleUserProfile | null;
  hasActiveKey: boolean;
  isCustomKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onReset,
  onOpenPrivacy,
  onOpenHistory,
  historyCount,
  onOpenAuthModal,
  googleUser,
  hasActiveKey,
  isCustomKey,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-amber-300 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Film className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                AI Space Transformation Director
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Veo3-Quality
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              สถาปัตยกรรมพรอมต์วิดีโอสั้นแปลงโฉมพื้นที่ (Space Transformation Time-lapse & ASMR Storyboard)
            </p>
          </div>
        </div>

        {/* Action Controls & Google / Key Settings */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Google Gmail & Gemini API Key Button */}
          <button
            type="button"
            onClick={onOpenAuthModal}
            className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer shadow-sm ${
              googleUser
                ? 'bg-slate-900/90 hover:bg-slate-850 border-emerald-500/40 text-emerald-300'
                : hasActiveKey
                ? 'bg-slate-900/90 hover:bg-slate-850 border-amber-500/30 text-amber-300'
                : 'bg-gradient-to-r from-amber-500/10 to-rose-500/10 hover:from-amber-500/20 hover:to-rose-500/20 border-amber-500/40 text-amber-300'
            }`}
            title="ตั้งค่า Gemini API Key หรือเข้าใช้งานผ่านบัญชี Google Gmail"
          >
            {googleUser ? (
              <div className="flex items-center gap-2">
                {googleUser.picture ? (
                  <img
                    src={googleUser.picture}
                    alt={googleUser.name}
                    className="w-5 h-5 rounded-full object-cover border border-emerald-400/50"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-emerald-800 flex items-center justify-center text-[10px] font-bold text-white">
                    {googleUser.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden md:inline max-w-[130px] truncate text-slate-200">
                  {googleUser.email}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                {/* Google G icon */}
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">
                  {isCustomKey ? 'API Key (ส่วนตัว)' : 'API Key / Google'}
                </span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    hasActiveKey ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                  title={hasActiveKey ? 'พร้อมใช้งาน' : 'ยังไม่ได้ใส่คีย์'}
                />
              </div>
            )}
          </button>

          {/* Privacy Shield Pill */}
          <button
            onClick={onOpenPrivacy}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs font-medium transition cursor-pointer"
            title="คลิกเพื่อดูมาตรฐานการรักษาความปลอดภัยของข้อมูลผู้ใช้งาน"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="hidden lg:inline">Privacy Shield</span>
            <Lock className="w-3 h-3 text-emerald-400/80 hidden sm:inline" />
          </button>

          {/* History Button */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/70 text-slate-300 text-xs font-medium transition cursor-pointer"
            title="ประวัติพรอมต์ที่บันทึกไว้"
          >
            <History className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">ประวัติ</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold">
                {historyCount}
              </span>
            )}
          </button>

          {/* Start Over / Reset Button */}
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition cursor-pointer"
            title="เริ่มสร้างโจทย์ใหม่ตั้งแต่ขั้นตอนที่ 1"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">เริ่มใหม่</span>
          </button>
        </div>
      </div>
    </header>
  );
};
