import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Volume2,
  Share2,
  Film,
  Camera,
  Layers,
  Palette,
  ExternalLink,
  ShieldCheck,
  SlidersHorizontal,
  Image as ImageIcon,
} from 'lucide-react';
import { GeneratedDirectorResponse, PromptModeId } from '../types/director';
import { GoogleUserProfile } from '../types/auth';
import { StoryboardPromptsView } from './StoryboardPromptsView';

interface PromptOutputViewProps {
  data: GeneratedDirectorResponse;
  onReset: () => void;
  onSwitchMode: (mode: PromptModeId) => void;
  hasApiKey?: boolean;
  activeApiKey?: string | null;
  onOpenAuthModal?: () => void;
  googleUser?: GoogleUserProfile | null;
}

export const PromptOutputView: React.FC<PromptOutputViewProps> = ({
  data,
  onReset,
  onSwitchMode,
  hasApiKey = false,
  activeApiKey,
  onOpenAuthModal,
  googleUser,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeOutputTab, setActiveOutputTab] = useState<PromptModeId>(data.selectedMode);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadMarkdown = () => {
    const content = `# AI Director & Google Flow Prompt Architecture
Generated at: ${new Date(data.timestamp).toLocaleString('th-TH')}
Location: ${data.location.nameTh} (${data.location.nameEn})
Style: ${data.style.nameTh}
Condition: ${data.condition.nameTh}

## 1. CONCEPT OVERVIEW
- สไตล์ภาพรวม: ${data.conceptOverview.overallStyle}
- บรรยากาศ: ${data.conceptOverview.cozyAtmosphere}
- พื้นผิวผนังและพื้น: ${data.conceptOverview.texturesWallFloor}
- ตัวละคร: ${data.conceptOverview.characterStyling}
- การออกแบบเสียง: ${data.conceptOverview.audioDesign}

## 2. GOOGLE FLOW GENERATION PROMPTS (Mode ${activeOutputTab})
${
  activeOutputTab === 1 && data.mode1Output
    ? `### Scene 1: The Raw & Structural Foundation (0-10s)
Prompt:
${data.mode1Output.scene1.prompt}

Negative Prompt:
${data.mode1Output.scene1.negativePrompt}

Audio AI Target:
${data.mode1Output.scene1.audioASMRTarget}

### Scene 2: The Styling & Final Reveal (10-20s)
${data.mode1Output.scene2.continuityWarning}

Prompt:
${data.mode1Output.scene2.prompt}

Negative Prompt:
${data.mode1Output.scene2.negativePrompt}

Audio AI Target:
${data.mode1Output.scene2.audioASMRTarget}`
    : activeOutputTab === 2 && data.mode2Output
    ? data.mode2Output.shots
        .map(
          (s) => `### Shot ${s.shotNumber}: ${s.shotName} (${s.cameraType} - ${s.timeRange})
Prompt:
${s.prompt}

Negative Prompt:
${s.negativePrompt}

Audio AI Target:
${s.audioASMRTarget}`
        )
        .join('\n\n')
    : `### Scene 1: The Foundation & Build (0:00 - 0:10)
Prompt:
${data.mode3Output?.scene1.fullPrompt}

Negative Prompt:
${data.mode3Output?.scene1.negativePrompt}

Audio AI Target:
${data.mode3Output?.scene1.audioASMRTarget}

### Scene 2: The Styling & Final Reveal (0:10 - 0:20)
${data.mode3Output?.scene2.continuityNotice}

Prompt:
${data.mode3Output?.scene2.fullPrompt}

Negative Prompt:
${data.mode3Output?.scene2.negativePrompt}

Audio AI Target:
${data.mode3Output?.scene2.audioASMRTarget}`
}

## 3. STEP-BY-STEP WORKFLOW IN GOOGLE FLOW
${data.workflowInGoogleFlow.steps
  .map(
    (step) => `${step.stepNumber}. **${step.title}**
- ${step.instruction}
- Settings: ${step.toolSettings}
${step.criticalCallout ? `- **${step.criticalCallout}**` : ''}`
  )
  .join('\n\n')}

## 4. EDITING & ENGAGEMENT TIPS
- **Beat Sync**: ${data.editingAndEngagementTips.beatSyncTricks}
- **Lighting Contrast**: ${data.editingAndEngagementTips.lightingContrastTricks}
- **Viewer Retention**: ${data.editingAndEngagementTips.retentionTricks}

## 5. CAPTIONS & HASHTAGS ภาษาไทย
- **Hook**: ${data.thaiSocialCaptions.hook}
- **Caption**: ${data.thaiSocialCaptions.caption}
- **Hashtags**: ${data.thaiSocialCaptions.hashtags.join(' ')}

## 6. REFERENCE ASSETS (ภาพอ้างอิงเฟอร์นิเจอร์และของตกแต่ง)
${
  data.referenceImages && data.referenceImages.length > 0
    ? data.referenceImages
        .map(
          (img, idx) => `- **Asset #${idx + 1}**: ${img.name} (ขนาด ${img.size ? Math.round(img.size / 1024) + ' KB' : 'N/A'})`
        )
        .join('\n')
    : data.referenceImageName
    ? `- **Asset #1**: ${data.referenceImageName}`
    : 'ไม่มีภาพอ้างอิงแนบมา (No reference images uploaded)'
}

## 7. STORYBOARD IMAGE PROMPTS (พรอมต์รูปภาพสตอรี่บอร์ด 9:16)
${
  data.storyboardPrompts
    ? [data.storyboardPrompts.mode1, data.storyboardPrompts.mode2, data.storyboardPrompts.mode3]
        .map(
          (m) => `### ${m.modeTitleTh} (${m.totalImagesCount} ภาพ 9:16)
${m.items
  .map(
    (item) => `#### [ภาพที่ ${item.imageIndex}/${m.totalImagesCount}] ${item.titleTh}
- **Timecode**: \`${item.timeCodeRange}\`
- **Camera Angle**: ${item.cameraDirection}
- **Motion Command**: ${item.motionCommand}
- **ASMR Sound Target**: \`${item.asmrTarget}\`
${item.continuityNotice ? `- **Continuity Anchor**: ${item.continuityNotice}\n` : ''}
- **Master 9:16 Image Prompt (Google Imagen 3 / Midjourney / Veo3)**:
\`\`\`text
${item.imagePrompt9x16}
\`\`\`
`
  )
  .join('\n')}`
        )
        .join('\n\n')
    : 'No storyboard image prompts generated.'
}
`;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `google-flow-director-${data.location.nameEn.toLowerCase().replace(/\s+/g, '-')}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner & Reset Control */}
      <div className="bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-slate-900 border border-amber-500/30 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <Check className="w-3.5 h-3.5" /> สถาปัตยกรรมพรอมต์ถูกสร้างเสร็จสมบูรณ์
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Director Script: {data.location.nameTh}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            สไตล์: <span className="text-amber-400 font-medium">{data.style.nameTh}</span> | สภาพเดิม: <span className="text-slate-300 font-medium">{data.condition.nameTh}</span> | สัดส่วน: <span className="text-slate-300 font-mono">9:16</span>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleDownloadMarkdown}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>ส่งออก Markdown (.md)</span>
          </button>

          {/* Rule: เมื่อสร้างพรอมท์เสร็จแล้ว ให้กลับไปเริ่มต้นใหม่ทุกครั้ง */}
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition cursor-pointer"
            title="ตามกฎ: เมื่อสร้างเสร็จแล้วให้กลับไปเริ่มต้นใหม่ทุกครั้ง"
          >
            <RotateCcw className="w-4 h-4" />
            <span>🔄 เริ่มต้นสร้างโจทย์ใหม่ (Start New)</span>
          </button>
        </div>
      </div>

      {/* Mode Switcher Tabs for Generation Prompts */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-bold text-white">เลือกดูพรอมต์แต่ละรูปแบบ (Prompt Mode):</span>
        </div>
        <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          {[1, 2, 3].map((modeNum) => (
            <button
              key={modeNum}
              type="button"
              onClick={() => {
                setActiveOutputTab(modeNum as PromptModeId);
                onSwitchMode(modeNum as PromptModeId);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeOutputTab === modeNum
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              รูปแบบที่ {modeNum}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================
          1. CONCEPT OVERVIEW & 5 RESPONSE SECTIONS
         ======================================================== */}
      <section className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xs">
              1
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">1. CONCEPT OVERVIEW</h3>
          </div>
          <button
            type="button"
            onClick={() =>
              handleCopy(
                JSON.stringify(data.conceptOverview, null, 2),
                'concept-overview'
              )
            }
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 cursor-pointer"
          >
            {copiedKey === 'concept-overview' ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>คัดลอกส่วนนี้</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-850 space-y-1.5">
            <span className="text-[11px] font-semibold text-amber-400 block uppercase tracking-wider">
              สไตล์ภาพรวม (Loft + Minimalist + Japandi)
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {data.conceptOverview.overallStyle}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-850 space-y-1.5">
            <span className="text-[11px] font-semibold text-amber-400 block uppercase tracking-wider">
              บรรยากาศและความอบอุ่น (Cozy Atmosphere)
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {data.conceptOverview.cozyAtmosphere}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-850 space-y-1.5">
            <span className="text-[11px] font-semibold text-amber-400 block uppercase tracking-wider">
              ผิวสัมผัสผนังและพื้น (Textures & Materials)
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {data.conceptOverview.texturesWallFloor}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-850 space-y-1.5">
            <span className="text-[11px] font-semibold text-amber-400 block uppercase tracking-wider">
              การแต่งกายและการกระทำตัวละคร (Character Styling)
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {data.conceptOverview.characterStyling}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-850 space-y-1.5">
          <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
            <Volume2 className="w-3.5 h-3.5" /> การออกแบบเสียงประกอบ (Audio AI / ASMR Target)
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            {data.conceptOverview.audioDesign}
          </p>
        </div>

        {/* Uploaded Reference Assets Showcase (Multi-image) */}
        {((data.referenceImages && data.referenceImages.length > 0) || data.referenceImagePreview) && (
          <div className="pt-3 border-t border-slate-800/80 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
              <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>ภาพอ้างอิงเฟอร์นิเจอร์ & ของตกแต่งในโปรเจกต์ ({data.referenceImages?.length || 1} ภาพ)</span>
              </span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                <Check className="w-3 h-3" /> เชื่อมโยงเข้าสู่คำสั่งกล้อง Veo3 Close-up / Macro tracking ในช็อตเปิดเผย (Final Reveal)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
              {(data.referenceImages && data.referenceImages.length > 0
                ? data.referenceImages
                : [
                    {
                      id: 'legacy-1',
                      name: data.referenceImageName || 'reference-asset.jpg',
                      previewUrl: data.referenceImagePreview!,
                    },
                  ]
              ).map((img, idx) => (
                <div
                  key={img.id || idx}
                  className="group relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 hover:border-amber-400/50 transition shadow-sm"
                >
                  <div className="aspect-square overflow-hidden bg-slate-900">
                    <img
                      src={img.previewUrl}
                      alt={img.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[9px] font-bold text-amber-300 border border-white/10">
                      #{idx + 1}
                    </span>
                  </div>
                  <div className="p-1.5 bg-slate-950 text-left border-t border-slate-850">
                    <div className="text-[10px] font-medium text-slate-300 truncate" title={img.name}>
                      {img.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ========================================================
          2. GOOGLE FLOW GENERATION PROMPTS
         ======================================================== */}
      <section className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xs">
              2
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                2. GOOGLE FLOW GENERATION PROMPTS
              </h3>
              <p className="text-xs text-slate-400">
                พรอมต์ภาษาอังกฤษ พร้อมกล่อง Negative Prompt บังคับ และเป้าหมายเสียง Veo3
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
            กำลังแสดง: รูปแบบที่ {activeOutputTab}
          </span>
        </div>

        {/* ----------------- MODE 1 OUTPUT ----------------- */}
        {activeOutputTab === 1 && data.mode1Output && (
          <div className="space-y-6">
            {/* Scene 1 */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-amber-400">
                    {data.mode1Output.scene1.title}
                  </h4>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {data.mode1Output.scene1.timeRange}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleCopy(data.mode1Output!.scene1.prompt, 'mode1-scene1')
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-750 text-xs text-amber-300 font-medium cursor-pointer"
                >
                  {copiedKey === 'mode1-scene1' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>คัดลอกพรอมต์หลัก</span>
                </button>
              </div>

              {/* Prompt Text Box */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap selection:bg-amber-500/30">
                {data.mode1Output.scene1.prompt}
              </div>

              {/* Negative Prompt Callout */}
              <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Mandatory Negative Prompt (กล่องข้อความบังคับใส่คู่กันเสมอ)
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(data.mode1Output!.scene1.negativePrompt, 'mode1-neg1')
                    }
                    className="text-[11px] text-rose-300 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'mode1-neg1' ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>คัดลอก</span>
                  </button>
                </div>
                <p className="text-[11px] text-rose-200/80 font-mono">
                  {data.mode1Output.scene1.negativePrompt}
                </p>
              </div>

              {/* Audio AI Target */}
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-start gap-2 text-xs text-emerald-300 font-mono">
                <Volume2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                <span>{data.mode1Output.scene1.audioASMRTarget}</span>
              </div>
            </div>

            {/* MANDATORY CONTINUITY WARNING BEFORE SCENE 2 */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/50 shadow-lg shadow-amber-500/10">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-sm font-black text-amber-300">
                    ⚠️ กฎเหล็กการล็อกความต่อเนื่องขั้นสูงสุด (Continuity Rule):
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">
                    ก่อนสั่งรันซีนที่ 2 ให้เปิดฟังก์ชัน <strong className="text-amber-400 font-extrabold underline">"Use last frame"</strong> จากวินาทีที่ 10 ของซีนแรกเสมอ เพื่อล็อกไม่ให้ตำแหน่งห้อง หน้าต่างปูนเปลือย วิวทุ่งนาด้านนอก และโครงสร้างบิดเบี้ยวหรือสลับตำแหน่งเด็ดขาด!
                  </p>
                </div>
              </div>
            </div>

            {/* Scene 2 */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-amber-400">
                    {data.mode1Output.scene2.title}
                  </h4>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {data.mode1Output.scene2.timeRange}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleCopy(data.mode1Output!.scene2.prompt, 'mode1-scene2')
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-750 text-xs text-amber-300 font-medium cursor-pointer"
                >
                  {copiedKey === 'mode1-scene2' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>คัดลอกพรอมต์หลัก</span>
                </button>
              </div>

              {/* Prompt Text Box */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap selection:bg-amber-500/30">
                {data.mode1Output.scene2.prompt}
              </div>

              {/* Negative Prompt Callout */}
              <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Mandatory Negative Prompt
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(data.mode1Output!.scene2.negativePrompt, 'mode1-neg2')
                    }
                    className="text-[11px] text-rose-300 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'mode1-neg2' ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>คัดลอก</span>
                  </button>
                </div>
                <p className="text-[11px] text-rose-200/80 font-mono">
                  {data.mode1Output.scene2.negativePrompt}
                </p>
              </div>

              {/* Audio AI Target */}
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-start gap-2 text-xs text-emerald-300 font-mono">
                <Volume2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                <span>{data.mode1Output.scene2.audioASMRTarget}</span>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- MODE 2 OUTPUT ----------------- */}
        {activeOutputTab === 2 && data.mode2Output && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
              💡 <span className="text-white font-semibold">โครงสร้าง Shot-by-Shot:</span> เหมาะสำหรับทำวิดีโอ Jump Cut สั้นกระชับ 7 ช็อต สำหรับแพลตฟอร์ม Shorts / Reels
            </div>

            {data.mode2Output.shots.map((shot) => (
              <div
                key={shot.shotNumber}
                className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono text-xs font-bold">
                      {shot.timeRange} Shot {shot.shotNumber}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-white">
                      {shot.shotName} ({shot.cameraType})
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(shot.prompt, `mode2-shot-${shot.shotNumber}`)
                    }
                    className="flex items-center gap-1 text-xs text-amber-300 hover:text-amber-200 cursor-pointer self-start sm:self-auto"
                  >
                    {copiedKey === `mode2-shot-${shot.shotNumber}` ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>คัดลอกช็อตนี้</span>
                  </button>
                </div>

                <div className="bg-slate-900 p-3 rounded-lg border border-slate-850 font-mono text-xs text-slate-200 leading-relaxed">
                  {shot.prompt}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/20 text-rose-300/80 font-mono truncate">
                    <span className="text-rose-400 font-bold block mb-0.5">Negative Prompt:</span>
                    {shot.negativePrompt}
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-emerald-300 font-mono">
                    <span className="text-emerald-400 font-bold block mb-0.5">Audio AI:</span>
                    {shot.audioASMRTarget}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ----------------- MODE 3 OUTPUT (พรีเมียม 20 ฉาก) ----------------- */}
        {activeOutputTab === 3 && data.mode3Output && (
          <div className="space-y-6">
            {/* Scene 1 (0:00 - 0:10) */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
                <div>
                  <h4 className="text-sm font-bold text-amber-400">
                    {data.mode3Output.scene1.title}
                  </h4>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {data.mode3Output.scene1.duration}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleCopy(data.mode3Output!.scene1.fullPrompt, 'mode3-scene1')
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-750 text-xs text-amber-300 font-medium cursor-pointer"
                >
                  {copiedKey === 'mode3-scene1' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>คัดลอก Full Scene 1 Prompt</span>
                </button>
              </div>

              {/* 10 Detailed Segments Accordion/List */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300 block">
                  รายละเอียด 10 ฉากย่อย วินาทีต่อวินาที (Scenes 1-10):
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {data.mode3Output.scene1.steps.map((st) => (
                    <div
                      key={st.sceneNumber}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-850 flex flex-col sm:flex-row sm:items-start justify-between gap-2"
                    >
                      <div className="flex items-start gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                          {st.timeCode} Scene {st.sceneNumber}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-white">{st.titleTh}</div>
                          <div className="text-xs text-slate-400 font-mono mt-0.5">
                            {st.actionEn}
                          </div>
                        </div>
                      </div>

                      <div className="text-[11px] text-emerald-400 font-mono sm:text-right shrink-0">
                        🔊 {st.asmrCue}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Full Veo3 Master Prompt Box */}
              <div>
                <span className="text-xs font-bold text-white block mb-1">
                  Prompt เต็มรูปแบบสำหรับสั่งรันใน Google Flow / Veo3:
                </span>
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {data.mode3Output.scene1.fullPrompt}
                </div>
              </div>

              {/* Negative Prompt */}
              <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Mandatory Negative Prompt
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(data.mode3Output!.scene1.negativePrompt, 'mode3-neg1')
                    }
                    className="text-[11px] text-rose-300 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'mode3-neg1' ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>คัดลอก</span>
                  </button>
                </div>
                <p className="text-[11px] text-rose-200/80 font-mono">
                  {data.mode3Output.scene1.negativePrompt}
                </p>
              </div>

              {/* Audio AI Target */}
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-start gap-2 text-xs text-emerald-300 font-mono">
                <Volume2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                <span>{data.mode3Output.scene1.audioASMRTarget}</span>
              </div>
            </div>

            {/* MANDATORY CONTINUITY WARNING BEFORE SCENE 2 */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/50 shadow-lg shadow-amber-500/10">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-sm font-black text-amber-300">
                    ⚠️ กฎเหล็กการล็อกความต่อเนื่องขั้นสูงสุด (Continuity Rule):
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">
                    ก่อนสั่งรันซีนที่ 2 ให้เปิดฟังก์ชัน <strong className="text-amber-400 font-extrabold underline">"Use last frame"</strong> จากวินาทีที่ 10 ของซีนแรกเสมอ เพื่อล็อกไม่ให้ตำแหน่งห้อง หน้าต่างปูนเปลือย วิวทุ่งนาด้านนอก และโครงสร้างบิดเบี้ยวหรือสลับตำแหน่งเด็ดขาด!
                  </p>
                </div>
              </div>
            </div>

            {/* Scene 2 (0:10 - 0:20) */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
                <div>
                  <h4 className="text-sm font-bold text-amber-400">
                    {data.mode3Output.scene2.title}
                  </h4>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {data.mode3Output.scene2.duration}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleCopy(data.mode3Output!.scene2.fullPrompt, 'mode3-scene2')
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-750 text-xs text-amber-300 font-medium cursor-pointer"
                >
                  {copiedKey === 'mode3-scene2' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>คัดลอก Full Scene 2 Prompt</span>
                </button>
              </div>

              {/* 10 Detailed Segments Accordion/List (Scenes 11-20) */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300 block">
                  รายละเอียด 10 ฉากย่อย การตกแต่งและเปิดตัว (Scenes 11-20):
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {data.mode3Output.scene2.steps.map((st) => (
                    <div
                      key={st.sceneNumber}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-855 flex flex-col sm:flex-row sm:items-start justify-between gap-2"
                    >
                      <div className="flex items-start gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 shrink-0">
                          {st.timeCode} Scene {st.sceneNumber}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-white">{st.titleTh}</div>
                          <div className="text-xs text-slate-400 font-mono mt-0.5">
                            {st.actionEn}
                          </div>
                        </div>
                      </div>

                      <div className="text-[11px] text-emerald-400 font-mono sm:text-right shrink-0">
                        🔊 {st.asmrCue}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Full Veo3 Master Prompt Box */}
              <div>
                <span className="text-xs font-bold text-white block mb-1">
                  Prompt เต็มรูปแบบสำหรับสั่งรัน Scene 2 ใน Google Flow:
                </span>
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {data.mode3Output.scene2.fullPrompt}
                </div>
              </div>

              {/* Negative Prompt */}
              <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Mandatory Negative Prompt
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(data.mode3Output!.scene2.negativePrompt, 'mode3-neg2')
                    }
                    className="text-[11px] text-rose-300 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'mode3-neg2' ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>คัดลอก</span>
                  </button>
                </div>
                <p className="text-[11px] text-rose-200/80 font-mono">
                  {data.mode3Output.scene2.negativePrompt}
                </p>
              </div>

              {/* Audio AI Target */}
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-start gap-2 text-xs text-emerald-300 font-mono">
                <Volume2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                <span>{data.mode3Output.scene2.audioASMRTarget}</span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ========================================================
          3. STEP-BY-STEP WORKFLOW IN GOOGLE FLOW
         ======================================================== */}
      <section className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xs">
            3
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              3. STEP-BY-STEP WORKFLOW IN GOOGLE FLOW
            </h3>
            <p className="text-xs text-slate-400">
              คู่มือปฏิบัติการทีละขั้นตอนบนเครื่องมือ Google Flow / Veo3 อย่างละเอียด
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.workflowInGoogleFlow.steps.map((step) => (
            <div
              key={step.stepNumber}
              className="p-5 rounded-xl bg-slate-950/70 border border-slate-850 space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center justify-center">
                    {step.stepNumber}
                  </span>
                  <h4 className="text-sm font-bold text-white">{step.title}</h4>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {step.instruction}
                </p>

                {step.criticalCallout && (
                  <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-300 mb-2">
                    {step.criticalCallout}
                  </div>
                )}
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400">
                <span className="text-amber-400 font-semibold block mb-0.5">Settings:</span>
                {step.toolSettings}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          4. EDITING & ENGAGEMENT TIPS
         ======================================================== */}
      <section className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xs">
            4
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              4. EDITING & ENGAGEMENT TIPS
            </h3>
            <p className="text-xs text-slate-400">
              เทคนิคการตัดต่อให้ฟุตเทจปัง ล็อกจังหวะเสียงบีท และดึงดูดสายตาคนดูจนกลายเป็นไวรัล
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-850 space-y-2">
            <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase">
              <Volume2 className="w-3.5 h-3.5" /> Beat-Sync & Sound Design
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {data.editingAndEngagementTips.beatSyncTricks}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-850 space-y-2">
            <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase">
              <Sparkles className="w-3.5 h-3.5" /> Window Contrast & Lighting
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {data.editingAndEngagementTips.lightingContrastTricks}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-850 space-y-2">
            <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase">
              <Film className="w-3.5 h-3.5" /> Retention & Speed Dynamics
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {data.editingAndEngagementTips.retentionTricks}
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. CAPTIONS & HASHTAGS ภาษาไทย
         ======================================================== */}
      <section className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xs">
              5
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                5. Captions & Hashtags ภาษาไทย
              </h3>
              <p className="text-xs text-slate-400">
                พร้อมโพสต์ลง TikTok, Instagram Reels และ YouTube Shorts ทันที
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const fullCaption = `${data.thaiSocialCaptions.hook}\n\n${data.thaiSocialCaptions.caption}\n\n${data.thaiSocialCaptions.hashtags.join(' ')}`;
              handleCopy(fullCaption, 'thai-captions');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-amber-300 font-medium cursor-pointer"
          >
            {copiedKey === 'thai-captions' ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>คัดลอกแคปชันทั้งหมด</span>
          </button>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-1">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
              • Hook (ข้อความเปิดหัวเรื่องที่ดึงดูด):
            </span>
            <div className="text-sm font-semibold text-white">
              {data.thaiSocialCaptions.hook}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-1">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
              • Caption (แคปชันสั้นกระชับ):
            </span>
            <div className="text-xs text-slate-300 leading-relaxed">
              {data.thaiSocialCaptions.caption}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-2">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
              • Hashtags (5-7 แฮชแท็กที่เกี่ยวข้อง):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {data.thaiSocialCaptions.hashtags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs text-amber-400 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Sticky Reset & Re-architecture Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-rose-950/40 border border-amber-500/40 text-center space-y-3">
        <h4 className="text-base font-bold text-white">
          🎉 สถาปัตยกรรมพรอมต์ถูกบันทึกแล้ว! ต้องการเริ่มสร้างโปรเจกต์ใหม่หรือไม่?
        </h4>
        <p className="text-xs text-slate-400 max-w-xl mx-auto">
          ตามกฎข้อกำหนด: &quot;เมื่อสร้างพรอมท์เสร็จแล้ว ให้กลับไปเริ่มต้นใหม่ทุกครั้ง&quot; คลิกปุ่มด้านล่างเพื่อรีเซ็ตกลับสู่ขั้นตอนที่ 1 โดยข้อมูลนี้จะยังคงอยู่ในประวัติส่วนตัวของท่าน
        </p>
        <div>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/30 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>🔄 เริ่มต้นสร้างโจทย์ใหม่ (Start New Architecture)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
