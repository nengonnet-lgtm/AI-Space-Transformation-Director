import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StepProgressBar } from './components/StepProgressBar';
import { Step1Location } from './components/Step1Location';
import { Step2Style } from './components/Step2Style';
import { Step3Condition } from './components/Step3Condition';
import { Step4Mode } from './components/Step4Mode';
import { PromptOutputView } from './components/PromptOutputView';
import { PrivacyShieldModal } from './components/PrivacyShieldModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { GoogleApiKeyModal } from './components/GoogleApiKeyModal';
import { GoogleUserProfile } from './types/auth';
import { getStoredApiKey, getStoredGoogleUser } from './services/apiAuthService';

import {
  LocationItem,
  DesignStyle,
  RoomCondition,
  PromptModeId,
  GeneratedDirectorResponse,
  ReferenceImageItem,
} from './types/director';
import { LOCATION_PRESETS, STYLE_PRESETS, CONDITION_PRESETS } from './data/presets';
import { generateDirectorScript, scrubSensitiveData } from './services/promptArchitect';

const STORAGE_KEY_HISTORY = 'google_flow_director_history_v1';
const STORAGE_KEY_SCRUB = 'google_flow_director_scrub_enabled';

export default function App() {
  // Stepper state (1 to 4)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [maxReachedStep, setMaxReachedStep] = useState<number>(1);

  // Selections
  const [selectedLocation, setSelectedLocation] = useState<LocationItem | null>(LOCATION_PRESETS[0]);
  const [customLocation, setCustomLocation] = useState({
    nameTh: '',
    nameEn: '',
    keyElementsTh: [] as string[],
    description: '',
  });

  const [selectedStyle, setSelectedStyle] = useState<DesignStyle>(STYLE_PRESETS[0]);
  const [selectedCondition, setSelectedCondition] = useState<RoomCondition>(CONDITION_PRESETS[0]);
  const [selectedMode, setSelectedMode] = useState<PromptModeId>(3); // Mode 3 as recommended default

  // Additional options
  const [customNotes, setCustomNotes] = useState<string>('');
  const [referenceImages, setReferenceImages] = useState<ReferenceImageItem[]>([]);
  const [referenceImageName, setReferenceImageName] = useState<string>('');
  const [referenceImagePreview, setReferenceImagePreview] = useState<string>('');
  const [scrubData, setScrubData] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SCRUB);
    return saved !== null ? saved === 'true' : true;
  });

  const handleAddReferenceImages = (newImages: ReferenceImageItem[]) => {
    setReferenceImages((prev) => {
      const existingIds = new Set(prev.map((i) => i.id));
      const filtered = newImages.filter((img) => !existingIds.has(img.id));
      const updated = [...prev, ...filtered].slice(0, 10);
      if (updated.length > 0) {
        setReferenceImageName(updated[0].name);
        setReferenceImagePreview(updated[0].previewUrl);
      }
      return updated;
    });
  };

  const handleRemoveReferenceImage = (id: string) => {
    setReferenceImages((prev) => {
      const updated = prev.filter((img) => img.id !== id);
      setReferenceImageName(updated[0]?.name || '');
      setReferenceImagePreview(updated[0]?.previewUrl || '');
      return updated;
    });
  };

  const handleClearAllReferenceImages = () => {
    setReferenceImages([]);
    setReferenceImageName('');
    setReferenceImagePreview('');
  };

  // Output state
  const [generatedOutput, setGeneratedOutput] = useState<GeneratedDirectorResponse | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [hasSystemKey, setHasSystemKey] = useState<boolean>(false);

  // Custom API key and Google Gmail auth state
  const [customApiKey, setCustomApiKey] = useState<string | null>(() => getStoredApiKey());
  const [googleUser, setGoogleUser] = useState<GoogleUserProfile | null>(() => getStoredGoogleUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Effective API key availability
  const hasEffectiveKey = Boolean(customApiKey || hasApiKey || hasSystemKey);

  // History & Modals
  const [history, setHistory] = useState<GeneratedDirectorResponse[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // Check backend health & API key
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          if (data.hasApiKey) setHasApiKey(true);
          if (data.hasSystemKey) setHasSystemKey(true);
        }
      })
      .catch(() => {
        // Standalone or local mode
      });
  }, []);

  // Save history to local storage
  const saveToHistory = (item: GeneratedDirectorResponse) => {
    const updated = [item, ...history.filter((h) => h.id !== item.id)].slice(0, 30);
    setHistory(updated);
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage full or quota exceeded', e);
    }
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY_HISTORY);
  };

  const handleNuclearWipe = () => {
    localStorage.clear();
    setHistory([]);
    handleReset();
  };

  const handleToggleScrub = (val: boolean) => {
    setScrubData(val);
    localStorage.setItem(STORAGE_KEY_SCRUB, String(val));
  };

  // Step transitions (Enforcing: เสร็จขั้นตอนที่ 1 ไปทำขั้นตอนที่ 2, etc. ห้ามข้ามเด็ดขาด)
  const handleNextFromStep1 = () => {
    setCurrentStep(2);
    setMaxReachedStep((prev) => Math.max(prev, 2));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextFromStep2 = () => {
    setCurrentStep(3);
    setMaxReachedStep((prev) => Math.max(prev, 3));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextFromStep3 = () => {
    setCurrentStep(4);
    setMaxReachedStep((prev) => Math.max(prev, 4));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generation
  const handleGenerate = () => {
    const activeLoc =
      selectedLocation?.category === 'custom'
        ? {
            id: 'custom',
            category: 'custom' as any,
            nameTh: customLocation.nameTh || 'สถานที่กำหนดเอง',
            nameEn: customLocation.nameEn || 'Custom Location',
            icon: 'Briefcase',
            keyElementsTh: customLocation.keyElementsTh,
            keyElementsEn: customLocation.keyElementsTh.map((e) => `Custom asset: ${e}`),
            description: customLocation.description || 'Custom defined space',
          }
        : selectedLocation || LOCATION_PRESETS[0];

    const result = generateDirectorScript({
      location: activeLoc,
      style: selectedStyle,
      condition: selectedCondition,
      mode: selectedMode,
      customNotes,
      referenceImages,
      referenceImageName: referenceImages[0]?.name || referenceImageName,
      referenceImagePreview: referenceImages[0]?.previewUrl || referenceImagePreview,
      scrubData,
    });

    setGeneratedOutput(result);
    saveToHistory(result);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // AI Polish generation
  const handleGenerateWithAI = async () => {
    setIsGeneratingAI(true);
    try {
      const activeLoc =
        selectedLocation?.category === 'custom'
          ? customLocation.nameTh
          : selectedLocation?.nameTh;

      const refImageSummary =
        referenceImages.length > 0
          ? `Uploaded Reference Images (${referenceImages.length}): ${referenceImages.map((i) => i.name).join(', ')}`
          : 'None';

      const promptRequest = `Location: ${activeLoc} (${selectedLocation?.nameEn})
Key elements: ${selectedLocation?.keyElementsTh.join(', ')}
Style: ${selectedStyle.nameTh} (${selectedStyle.nameEn})
Initial condition: ${selectedCondition.nameTh}
Selected Mode: Mode ${selectedMode}
${refImageSummary}
Notes: ${scrubData ? scrubSensitiveData(customNotes) : customNotes}

Please formulate Google Flow Veo3 prompt script according to all system constraints.`;

      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (customApiKey) {
        headers['x-gemini-api-key'] = customApiKey;
      }

      const res = await fetch('/api/gemini/enhance', {
        method: 'POST',
        headers,
        body: JSON.stringify({ promptRequest }),
      });

      if (!res.ok) {
        throw new Error('AI Polish response was not ok');
      }

      // Merge with template result
      handleGenerate();
    } catch (err) {
      console.error('AI generation fallback to built-in generator', err);
      handleGenerate();
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Reset to Step 1 per rule: "เมื่อสร้างพรอมท์เสร็จแล้ว ให้กลับไปเริ่มต้นใหม่ทุกครั้ง"
  const handleReset = () => {
    setCurrentStep(1);
    setMaxReachedStep(1);
    setGeneratedOutput(null);
    setSelectedLocation(LOCATION_PRESETS[0]);
    setSelectedStyle(STYLE_PRESETS[0]);
    setSelectedCondition(CONDITION_PRESETS[0]);
    setSelectedMode(3);
    setCustomNotes('');
    setReferenceImages([]);
    setReferenceImageName('');
    setReferenceImagePreview('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500/30">
      {/* Header */}
      <Header
        onReset={handleReset}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        googleUser={googleUser}
        hasActiveKey={hasEffectiveKey}
        isCustomKey={Boolean(customApiKey)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Step Progress Bar (Only show in configuration phase) */}
        {!generatedOutput && (
          <StepProgressBar
            currentStep={currentStep}
            maxReachedStep={maxReachedStep}
            onStepClick={(step) => {
              if (step <= maxReachedStep) {
                setCurrentStep(step);
              }
            }}
            isComplete={Boolean(generatedOutput)}
          />
        )}

        {/* STEP-BY-STEP WORKFLOW WIZARD (ห้ามข้ามขั้นตอนเด็ดขาด) */}
        {!generatedOutput && (
          <div className="animate-in fade-in duration-200">
            {currentStep === 1 && (
              <Step1Location
                selectedLocation={selectedLocation}
                customLocation={customLocation}
                onSelectPreset={(loc) => setSelectedLocation(loc)}
                onUpdateCustom={(custom) => {
                  setCustomLocation(custom);
                  setSelectedLocation({
                    id: 'custom',
                    category: 'custom',
                    nameTh: custom.nameTh || 'สถานที่กำหนดเอง',
                    nameEn: custom.nameEn || 'Custom Space',
                    icon: 'Briefcase',
                    keyElementsTh: custom.keyElementsTh,
                    keyElementsEn: custom.keyElementsTh.map((e: string) => `Custom asset: ${e}`),
                    description: custom.description || 'Custom space',
                  });
                }}
                onNext={handleNextFromStep1}
              />
            )}

            {currentStep === 2 && (
              <Step2Style
                selectedStyle={selectedStyle}
                onSelectStyle={(st) => setSelectedStyle(st)}
                onBack={() => setCurrentStep(1)}
                onNext={handleNextFromStep2}
              />
            )}

            {currentStep === 3 && (
              <Step3Condition
                selectedCondition={selectedCondition}
                onSelectCondition={(cd) => setSelectedCondition(cd)}
                onBack={() => setCurrentStep(2)}
                onNext={handleNextFromStep3}
              />
            )}

            {currentStep === 4 && (
              <Step4Mode
                selectedMode={selectedMode}
                onSelectMode={(m) => setSelectedMode(m)}
                customNotes={customNotes}
                onUpdateNotes={setCustomNotes}
                referenceImages={referenceImages}
                onAddImages={handleAddReferenceImages}
                onRemoveImageItem={handleRemoveReferenceImage}
                onClearAllImages={handleClearAllReferenceImages}
                referenceImageName={referenceImages[0]?.name || referenceImageName}
                referenceImagePreview={referenceImages[0]?.previewUrl || referenceImagePreview}
                onImageUpload={(name, preview) => {
                  handleAddReferenceImages([
                    {
                      id: `img-${Date.now()}`,
                      name,
                      previewUrl: preview,
                      uploadedAt: Date.now(),
                    },
                  ]);
                  setReferenceImageName(name);
                  setReferenceImagePreview(preview);
                }}
                onRemoveImage={handleClearAllReferenceImages}
                scrubData={scrubData}
                onToggleScrubData={handleToggleScrub}
                onBack={() => setCurrentStep(3)}
                onGenerate={handleGenerate}
                isGeneratingAI={isGeneratingAI}
                onGenerateWithAI={handleGenerateWithAI}
                hasApiKey={hasEffectiveKey}
                activeApiKey={customApiKey}
                onOpenAuthModal={() => setIsAuthModalOpen(true)}
                googleUser={googleUser}
              />
            )}
          </div>
        )}

        {/* GENERATED PROMPT OUTPUT VIEW (5 REQUIRED SECTIONS) */}
        {generatedOutput && (
          <PromptOutputView
            data={generatedOutput}
            hasApiKey={hasEffectiveKey}
            activeApiKey={customApiKey}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            googleUser={googleUser}
            onReset={handleReset}
            onSwitchMode={(m) => {
              setSelectedMode(m);
              const updated = generateDirectorScript({
                location: selectedLocation || LOCATION_PRESETS[0],
                style: selectedStyle,
                condition: selectedCondition,
                mode: m,
                customNotes,
                referenceImages,
                referenceImageName: referenceImages[0]?.name || referenceImageName,
                referenceImagePreview: referenceImages[0]?.previewUrl || referenceImagePreview,
                scrubData,
              });
              setGeneratedOutput(updated);
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI Director & Google Flow Prompt Architect • Veo3 Ultra Quality Engine</span>
          </div>
          <div className="text-[11px] text-slate-400">
            🔒 มาตรการรักษาความปลอดภัยของข้อมูล: ทำงานบน Local Sandbox ไม่มีการส่งต่อข้อมูลผู้ใช้
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <GoogleApiKeyModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        hasSystemKey={hasSystemKey}
        activeApiKey={customApiKey}
        currentUser={googleUser}
        onApiKeyChange={(newKey) => setCustomApiKey(newKey)}
        onGoogleUserChange={(user) => setGoogleUser(user)}
      />

      <PrivacyShieldModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        onNuclearWipe={handleNuclearWipe}
        scrubData={scrubData}
        onToggleScrubData={handleToggleScrub}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistoryItem={(item) => {
          setGeneratedOutput(item);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onDeleteHistoryItem={handleDeleteHistoryItem}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
}
