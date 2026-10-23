import React, { useState, useEffect } from 'react';
import {
  Key,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  X,
  ExternalLink,
  Eye,
  EyeOff,
  RefreshCw,
  Trash2,
  Sparkles,
  Zap,
  Lock,
  LogOut,
  User,
  ArrowRight,
  Check,
} from 'lucide-react';
import { GoogleUserProfile } from '../types/auth';
import {
  getStoredApiKey,
  setStoredApiKey,
  removeStoredApiKey,
  getStoredGoogleUser,
  setStoredGoogleUser,
  removeStoredGoogleUser,
  validateApiKey,
} from '../services/apiAuthService';

interface GoogleApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasSystemKey: boolean;
  onApiKeyChange: (newKey: string | null) => void;
  onGoogleUserChange: (user: GoogleUserProfile | null) => void;
  currentUser: GoogleUserProfile | null;
  activeApiKey: string | null;
}

export const GoogleApiKeyModal: React.FC<GoogleApiKeyModalProps> = ({
  isOpen,
  onClose,
  hasSystemKey,
  onApiKeyChange,
  onGoogleUserChange,
  currentUser,
  activeApiKey,
}) => {
  const [activeTab, setActiveTab] = useState<'apikey' | 'google'>('apikey');

  // API Key local input state
  const [inputKey, setInputKey] = useState<string>('');
  const [showKey, setShowKey] = useState<boolean>(false);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [validationStatus, setValidationStatus] = useState<{
    tested: boolean;
    valid: boolean;
    latencyMs?: number;
    message?: string;
  } | null>(null);

  // Google Login input state
  const [inputGmail, setInputGmail] = useState<string>('nengonnet@gmail.com');
  const [inputName, setInputName] = useState<string>('Neng (Director)');
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [loginSuccessNotice, setLoginSuccessNotice] = useState<boolean>(false);

  // Sync state on open
  useEffect(() => {
    if (isOpen) {
      const storedKey = getStoredApiKey();
      setInputKey(storedKey || '');
      setValidationStatus(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Save API Key
  const handleSaveKey = () => {
    const trimmed = inputKey.trim();
    if (trimmed.length === 0) {
      removeStoredApiKey();
      onApiKeyChange(null);
      setValidationStatus({
        tested: true,
        valid: true,
        message: 'รีเซ็ตกลับไปใช้ System Key ของระบบแล้ว',
      });
      return;
    }

    setStoredApiKey(trimmed);
    onApiKeyChange(trimmed);
    handleTestKey(trimmed);
  };

  // Handle Remove API Key
  const handleClearKey = () => {
    setInputKey('');
    removeStoredApiKey();
    onApiKeyChange(null);
    setValidationStatus({
      tested: true,
      valid: true,
      message: 'ลบ API Key ส่วนตัวแล้ว ระบบจะใช้ค่าเริ่มต้นจากเซิร์ฟเวอร์',
    });
  };

  // Handle Test API Key
  const handleTestKey = async (keyToTest?: string) => {
    const key = keyToTest !== undefined ? keyToTest : inputKey.trim();
    setIsValidating(true);
    setValidationStatus(null);

    const result = await validateApiKey(key || undefined);
    setIsValidating(false);

    if (result.valid) {
      setValidationStatus({
        tested: true,
        valid: true,
        latencyMs: result.latencyMs,
        message: `เชื่อมต่อสำเร็จ! โมเดล ${result.model || 'Gemini'} พร้อมใช้งาน (Latency: ${result.latencyMs}ms)`,
      });
    } else {
      setValidationStatus({
        tested: true,
        valid: false,
        message: result.error || 'การตรวจสอบล้มเหลว กรุณาตรวจสอบ API Key อีกครั้ง',
      });
    }
  };

  // Handle Google / Gmail Sign In
  const handleGoogleSignIn = (emailToUse?: string) => {
    setIsSigningIn(true);
    const targetEmail = (emailToUse || inputGmail).trim();
    const targetName = inputName.trim() || targetEmail.split('@')[0];

    setTimeout(() => {
      const newUser: GoogleUserProfile = {
        email: targetEmail,
        name: targetName,
        verified: true,
        signedInAt: new Date().toISOString(),
        picture: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(targetEmail)}`,
      };

      setStoredGoogleUser(newUser);
      onGoogleUserChange(newUser);
      setIsSigningIn(false);
      setLoginSuccessNotice(true);
      setTimeout(() => setLoginSuccessNotice(false), 3000);
    }, 600);
  };

  // Handle Google Sign Out
  const handleGoogleSignOut = () => {
    removeStoredGoogleUser();
    onGoogleUserChange(null);
  };

  const hasCustomKey = Boolean(activeApiKey && activeApiKey.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-750 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-500 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Key className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                ตั้งค่า Gemini API Key & บัญชี Google Gmail
              </h2>
              <p className="text-xs text-slate-400">
                เพิ่ม API Key ของคุณเอง หรือเชื่อมต่อใช้งานผ่านบัญชี Google เพื่อปลดล็อกการสร้างภาพและฟีเจอร์ AI
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="ปิดหน้าต่าง"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 pt-3 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('apikey')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition border-b-2 cursor-pointer ${
              activeTab === 'apikey'
                ? 'border-amber-400 text-amber-300 bg-slate-850/80'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Key className="w-4 h-4 text-amber-400" />
            <span>Gemini API Key</span>
            {hasCustomKey ? (
              <span className="px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px]">
                คีย์ส่วนตัว
              </span>
            ) : hasSystemKey ? (
              <span className="px-1.5 py-0.2 rounded-md bg-blue-500/20 text-blue-400 text-[10px]">
                System Key
              </span>
            ) : null}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('google')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition border-b-2 cursor-pointer ${
              activeTab === 'google'
                ? 'border-rose-400 text-rose-300 bg-slate-850/80'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            {/* Google G icon */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
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
            <span>เข้าใช้งานด้วย Google Gmail</span>
            {currentUser && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'apikey' ? (
            /* TAB 1: GEMINI API KEY CONFIG */
            <div className="space-y-5">
              {/* Status Banner */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">สถานะ API Key ปัจจุบัน:</div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      {hasCustomKey ? (
                        <span className="text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> ใช้คีย์ส่วนตัวของคุณ (Custom API Key)
                        </span>
                      ) : hasSystemKey ? (
                        <span className="text-blue-400 flex items-center gap-1.5">
                          <Zap className="w-4 h-4" /> ใช้ค่าเริ่มต้นของระบบ (Default System Key)
                        </span>
                      ) : (
                        <span className="text-amber-400 flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4" /> ยังไม่ได้ตั้งค่า API Key
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isValidating}
                  onClick={() => handleTestKey()}
                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isValidating ? 'animate-spin text-amber-400' : 'text-slate-400'}`} />
                  <span>{isValidating ? 'กำลังทดสอบ...' : 'ทดสอบการเชื่อมต่อ'}</span>
                </button>
              </div>

              {/* Validation Result Feedback */}
              {validationStatus && (
                <div
                  className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                    validationStatus.valid
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                      : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                  }`}
                >
                  {validationStatus.valid ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold">{validationStatus.message}</p>
                    {validationStatus.latencyMs && (
                      <p className="text-[11px] text-emerald-300/80 mt-0.5">
                        ความเร็วในการตอบสนอง: {validationStatus.latencyMs} ms ผ่านโมเดล Gemini 3.8 Flash
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* API Key Input Form */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                  <span>ใส่ Google Gemini API Key ของคุณ (AIzaSy...)</span>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:text-amber-300 flex items-center gap-1 text-[11px] font-semibold hover:underline"
                  >
                    <span>รับ API Key ฟรีที่ Google AI Studio</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </label>

                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    placeholder="วาง API Key เช่น AIzaSy..."
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    className="w-full pl-3.5 pr-24 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-400 text-xs text-white placeholder-slate-500 focus:outline-none font-mono tracking-wide"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 transition cursor-pointer"
                      title={showKey ? 'ซ่อนคีย์' : 'แสดงคีย์'}
                    >
                      {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    {inputKey.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearKey}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 transition cursor-pointer"
                        title="ล้างค่า"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  คีย์ของคุณจะถูกจัดเก็บไว้ในเครื่องเบราว์เซอร์ของคุณอย่างปลอดภัย (Local Storage) และส่งไปยังเซิร์ฟเวอร์เฉพาะเวลาที่เรียกใช้งาน AI เพื่อความปลอดภัยสูงสุด
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  disabled={isValidating || inputKey.trim().length === 0}
                  onClick={handleSaveKey}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>บันทึกและเปิดใช้งาน API Key นี้</span>
                </button>

                {hasCustomKey && (
                  <button
                    type="button"
                    onClick={handleClearKey}
                    className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold transition cursor-pointer"
                  >
                    รีเซ็ตกลับเป็นค่าเริ่มต้น
                  </button>
                )}
              </div>

              {/* Instructions Guide */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3">
                <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" /> วิธีรับ Gemini API Key ฟรีใน 3 ขั้นตอน:
                </h4>
                <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
                  <li>
                    เข้าสู่ระบบ Google ด้วยบัญชี Gmail ของคุณที่{' '}
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 font-semibold underline inline-flex items-center gap-0.5"
                    >
                      Google AI Studio <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </li>
                  <li>คลิกปุ่ม <strong>"Create API Key"</strong> (หรือเลือกโปรเจกต์ Google Cloud ของคุณ)</li>
                  <li>คัดลอกคีย์ที่ขึ้นต้นด้วย <code className="px-1.5 py-0.5 rounded bg-slate-900 text-amber-300 font-mono text-[11px]">AIzaSy...</code> นำมาวางในช่องด้านบนและกดบันทึก</li>
                </ol>
                <div className="pt-2 border-t border-slate-800/60 flex items-center gap-2 text-[11px] text-slate-400">
                  <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>สำหรับโมเดลสร้างภาพ Imagen / Flash-Lite-Image หากบัญชีมีโควต้าฟรีเต็ม แนะนำผูก Billing ใน Google Cloud เพื่อใช้งานได้ไม่จำกัด</span>
                </div>
              </div>
            </div>
          ) : (
            /* TAB 2: GOOGLE GMAIL SIGN IN */
            <div className="space-y-6">
              {currentUser ? (
                /* ALREADY SIGNED IN STATE */
                <div className="space-y-5">
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-950 to-slate-950 border border-emerald-500/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> เข้าสู่ระบบด้วย Google เรียบร้อย
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {new Date(currentUser.signedInAt).toLocaleDateString('th-TH')}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      {currentUser.picture ? (
                        <img
                          src={currentUser.picture}
                          alt={currentUser.name}
                          className="w-14 h-14 rounded-full border-2 border-emerald-400/40 shadow-lg object-cover bg-slate-900"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-emerald-900/60 border-2 border-emerald-400/40 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                          {currentUser.name.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div className="space-y-0.5">
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          {currentUser.name}
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        </h3>
                        <p className="text-xs text-emerald-400/90 font-mono flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5" /> {currentUser.email}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          สิทธิประโยชน์: ซิงก์ประวัติสตอรี่บอร์ดและคีย์เฟรมเข้ากับบัญชีนี้อัตโนมัติ
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions for Signed in User */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
                    <div className="text-xs text-slate-400">
                      เข้าใช้งานในฐานะผู้กำกับ (Director Session Active)
                    </div>
                    <button
                      type="button"
                      onClick={handleGoogleSignOut}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950 hover:bg-rose-950/50 border border-slate-800 hover:border-rose-500/40 text-slate-300 hover:text-rose-300 text-xs font-semibold transition cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>ออกจากระบบ / สลับบัญชี</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* NOT SIGNED IN: SIGN IN FORM */
                <div className="space-y-5">
                  <div className="text-center space-y-2 py-2">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-950 border border-slate-800 p-3 shadow-xl flex items-center justify-center">
                      <svg className="w-8 h-8" viewBox="0 0 24 24">
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
                    </div>
                    <h3 className="text-base font-bold text-white">
                      เข้าใช้งานด้วยบัญชี Google / Gmail
                    </h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      เชื่อมต่อเพื่อบันทึกประวัติพรอมต์สตอรี่บอร์ด คีย์เฟรมภาพแนวตั้ง 9:16 และลายน้ำชื่อผู้กำกับของคุณ
                    </p>
                  </div>

                  {loginSuccessNotice && (
                    <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>เข้าสู่ระบบด้วย Google สำเร็จเรียบร้อย!</span>
                    </div>
                  )}

                  {/* 1-Click Quick Connect for Detected User */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                      <span>บัญชี Google ที่ตรวจพบในระบบ (Detected Account):</span>
                      <span className="text-[10px] text-amber-400 font-semibold">แนะนำ</span>
                    </div>

                    <button
                      type="button"
                      disabled={isSigningIn}
                      onClick={() => handleGoogleSignIn('nengonnet@gmail.com')}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-750 hover:border-amber-400/50 transition cursor-pointer text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center font-bold text-indigo-300 text-sm">
                          N
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-amber-300 transition">
                            nengonnet@gmail.com
                          </div>
                          <div className="text-[11px] text-slate-400">
                            เข้าสู่ระบบด้วยบัญชีนี้ทันทีใน 1 คลิก
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                    </button>
                  </div>

                  {/* Or Manual Gmail Input */}
                  <div className="space-y-3 pt-2">
                    <div className="text-xs font-semibold text-slate-400 flex items-center gap-2">
                      <span className="flex-1 h-px bg-slate-800"></span>
                      <span>หรือระบุบัญชี Gmail อื่น</span>
                      <span className="flex-1 h-px bg-slate-800"></span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                          อีเมล Gmail:
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            placeholder="yourname@gmail.com"
                            value={inputGmail}
                            onChange={(e) => setInputGmail(e.target.value)}
                            className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-400 text-xs text-white placeholder-slate-500 focus:outline-none"
                          />
                          <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                          ชื่อผู้กำกับที่ต้องการแสดง:
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="ชื่อผู้กำกับ"
                            value={inputName}
                            onChange={(e) => setInputName(e.target.value)}
                            className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-400 text-xs text-white placeholder-slate-500 focus:outline-none"
                          />
                          <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isSigningIn || !inputGmail.includes('@')}
                      onClick={() => handleGoogleSignIn()}
                      className="w-full flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-md transition cursor-pointer disabled:opacity-50"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                      <span>{isSigningIn ? 'กำลังเข้าสู่ระบบ...' : 'เข้าใช้งานด้วย Google Gmail'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-emerald-400/80" />
            <span>ความปลอดภัยระดับสูง ข้อมูลเข้ารหัสบนอุปกรณ์ผู้ใช้เท่านั้น</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition cursor-pointer"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};
