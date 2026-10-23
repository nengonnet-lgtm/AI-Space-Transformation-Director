import {
  LocationItem,
  DesignStyle,
  RoomCondition,
  PromptModeId,
  ReferenceImageItem,
  StoryboardPromptsGroup,
  StoryboardImagePromptItem,
  ModeStoryboardData,
} from '../types/director';
import { MANDATORY_NEGATIVE_PROMPT } from '../data/presets';

interface BuildStoryboardPromptParams {
  location: LocationItem | { id: string; category: any; nameTh: string; nameEn: string; keyElementsTh: string[]; keyElementsEn: string[]; description: string };
  style: DesignStyle;
  condition: RoomCondition;
  mode: PromptModeId;
  referenceImages?: ReferenceImageItem[];
}

export function buildStoryboardPrompts(params: BuildStoryboardPromptParams): StoryboardPromptsGroup {
  const { location, style, condition, mode, referenceImages = [] } = params;

  // Key elements & reference names
  const keyItemsEn = location.keyElementsEn?.join(', ') || '';
  const refImageNames = referenceImages.map((img) => img.name.replace(/\.[^/.]+$/, '')).filter(Boolean);
  const refAssetsPhrase =
    refImageNames.length > 0
      ? `incorporating uploaded reference asset details (${refImageNames.slice(0, 4).join(', ')})`
      : 'signature oak desk and ambient amber lighting accents';

  // Base texture tokens
  const wallSpec = 'smooth polished micro-cement loft walls with architectural soft sheen';
  const floorSpec = 'light blonde oak herringbone wood planks with natural timber grain';
  const windowSpec = 'large floor-to-ceiling black aluminum sliding glass window revealing panoramic serene green rice fields and lush tropical landscape';
  const characterSpec = 'focused young Asian woman with neat tied-back hair in a minimalist sand-beige linen jumpsuit and clean studio work sneakers';

  // ==========================================
  // MODE 1: Line-by-line Phase Progression
  // 2 Images in 9:16:
  // - Image 1 (Scene 1): Phase 1, Phase 2A, Phase 2B, Phase 3 (Lock frame at sec 10)
  // - Image 2 (Scene 2): Phase 4, Phase 5 (Use last frame transition)
  // ==========================================
  const mode1Item1: StoryboardImagePromptItem = {
    id: 'mode1-scene1',
    imageIndex: 1,
    titleTh: 'ซีนที่ 1: ขั้นตอนงานก่อสร้างและล็อกโครงสร้างห้อง (The Build & Structural Lock)',
    titleEn: 'Scene 1: Construction Phases & Structural Lock (0:00 - 0:10)',
    timeCodeRange: '[0:00 - 0:10]',
    cameraDirection: 'High-Angle Wide Shot to Eye-Level Static Lock-Off (9:16 Vertical)',
    motionCommand:
      'Time-lapse transition from clearing construction dust, troweling micro-cement, laying herringbone floor, to settling into pristine finished architectural lock-off bathed in golden sunlight.',
    asmrTarget:
      'Echoing room tone, brisk broom sweeping bristles, metallic trowel scraping wet cement, crisp wood click interlocking.',
    isContinuityAnchor: true,
    continuityNotice:
      '⚠️ จุดล็อกเฟรมวินาทีที่ 10 (Scene 1 Continuity Anchor): บันทึกมุมกล้อง ตำแหน่งขอบหน้าต่างบานเลื่อน และแนวเสา เพื่อนำไปตั้งค่า "Use last frame" ในซีนที่ 2',
    aspectRatio: '9:16',
    recommendedModel: 'Google Imagen 3 / Midjourney v6 / Veo3 Asset Reference',
    negativePrompt: MANDATORY_NEGATIVE_PROMPT,
    subPhases: [
      {
        subIndex: 'Phase 1',
        labelTh: 'Phase 1: เคลียร์พื้นที่รื้อถอนและกวาดฝุ่น',
        labelEn: 'Phase 1: Clutter clearing & sweeping subfloor dust',
        timeCode: '[0:00 - 0:03]',
        camera: 'High-Angle Wide Static',
        action: `${characterSpec} sweeps fine construction dust and clears raw debris with steady rhythmic motions.`,
        asmrTarget: 'Bristle sweep friction on raw concrete subfloor, folding cardboard boxes.',
      },
      {
        subIndex: 'Phase 2A',
        labelTh: 'Phase 2A: ฉาบปูนเปลือยขัดมันบนผนัง',
        labelEn: 'Phase 2A: Micro-cement skim coat application',
        timeCode: '[0:03 - 0:05]',
        camera: 'Eye-Level Tracking Shot',
        action: `Applying smooth layer of ${wallSpec} across raw brickwork until perfectly leveled.`,
        asmrTarget: 'Wet plaster squelch, rhythmic stainless steel trowel scrape.',
      },
      {
        subIndex: 'Phase 2B',
        labelTh: 'Phase 2B: ปูพื้นไม้โอ๊คแบบ Herringbone ล็อกเข้ามุม',
        labelEn: 'Phase 2B: Interlocking blonde oak herringbone floor assembly',
        timeCode: '[0:05 - 0:07]',
        camera: 'Low-Angle Floor Level',
        action: `Rolling acoustic underlayment and snapping ${floorSpec} across the entire space.`,
        asmrTarget: 'Solid wooden plank clicks, dull rubber mallet tap.',
      },
      {
        subIndex: 'Phase 3',
        labelTh: 'Phase 3: สรุปโครงสร้างห้องเสร็จสมบูรณ์ / จุดล็อกเฟรม',
        labelEn: 'Phase 3: Pristine empty finished shell & 10s continuity lock-off',
        timeCode: '[0:07 - 0:10]',
        camera: 'Architectural Lock-Off Wide (Frame Lock Anchor)',
        action: `Camera settles into pristine finished room lock-off with ${windowSpec} under warm golden afternoon light.`,
        asmrTarget: 'Subtle outdoor breeze through window, clean acoustic room tone.',
      },
    ],
    imagePrompt9x16: `9:16 portrait orientation vertical architectural storyboard keyframe visual sheet, cinematic split-phase progression composition showing Scene 1 (The Build & Structural Lock) of modern ${style.nameEn} ${location.nameEn}. Shows 4 chronological construction phases inside the same space: Phase 1 dust clearing and sweeping, Phase 2A smooth polished micro-cement wall finishing, Phase 2B interlocking blonde oak herringbone floor snapping into place, Phase 3 pristine finished architectural shell bathed in warm afternoon sun streaming through a massive black aluminum floor-to-ceiling sliding glass window looking out at serene green rice fields. Focused young Asian woman character in minimalist earth-tone sand-beige linen jumpsuit working gracefully. Ultra-realistic interior architectural photography, Hasselblad H6D-100c, 35mm lens, soft diffused volumetric lighting, 8k resolution, crisp textures, highly detailed, photorealistic render --ar 9:16`,
  };

  const mode1Item2: StoryboardImagePromptItem = {
    id: 'mode1-scene2',
    imageIndex: 2,
    titleTh: 'ซีนที่ 2: การจัดวางเฟอร์นิเจอร์หลัก & เปิดตัวพร้อมแสงส้มอบอุ่น (Styling & Final Reveal)',
    titleEn: 'Scene 2: Furniture Placement & Cozy Sunset Reveal (0:10 - 0:20)',
    timeCodeRange: '[0:10 - 0:20]',
    cameraDirection: 'Eye-Level Medium Push-In to Macro Detail Sweep (9:16 Vertical)',
    motionCommand:
      'Continuous from Scene 1 last frame: Cream wool rug unrolls, signature oak furniture slides in, sheer white curtains glide along rails, amber 2700K lighting clicks on, macro camera tracking over textures and smiling character.',
    asmrTarget:
      'Soft rug unrolling thud, ceramic mug clinking onto wood, audible toggle switch click, warm lo-fi evening drone.',
    isContinuityAnchor: true,
    continuityNotice:
      '⚠️ MANDATORY: เปิดใช้งาน "Use last frame" จากวินาทีที่ 10 ของซีน 1 เพื่อล็อกตำแหน่งหน้าต่าง พื้นไม้ และแนวผนังให้ตรงกัน 100%',
    aspectRatio: '9:16',
    recommendedModel: 'Google Imagen 3 / Midjourney v6 / Veo3 Asset Reference',
    negativePrompt: MANDATORY_NEGATIVE_PROMPT,
    subPhases: [
      {
        subIndex: 'Phase 4',
        labelTh: 'Phase 4: จัดวางเฟอร์นิเจอร์หลักและพรมขนแกะ',
        labelEn: 'Phase 4: Unrolling wool rug & sliding signature furniture into place',
        timeCode: '[0:10 - 0:15]',
        camera: 'Eye-Level Static Wide',
        action: `Unrolling textured cream-beige wool rug, positioning low-profile light oak wood foundation furniture, hanging floating shelves.`,
        asmrTarget: 'Soft heavy fabric unroll, wood legs sliding on rug, cushioned furniture settle.',
      },
      {
        subIndex: 'Phase 5',
        labelTh: 'Phase 5: เปิดตัวพร้อมแสงส้มอบอุ่น 2700K และช็อตมาโคร',
        labelEn: 'Phase 5: Cozy reveal with amber 2700K glow & macro texture tracking',
        timeCode: '[0:15 - 0:20]',
        camera: 'Cinematic Slow Tracking Medium to Macro Push-In',
        action: `${characterSpec} clicks amber 2700K desk lamp toggle switch, washing walls in warm golden light, slides sheer white curtains, relaxes with steaming mug smiling at camera with sunset rice fields backdrop.`,
        asmrTarget: 'Audible mechanical switch snap, ceramic mug glide, tranquil evening breeze.',
      },
    ],
    imagePrompt9x16: `9:16 portrait orientation vertical architectural storyboard keyframe visual sheet, Scene 2 (Styling & Final Reveal) for modern ${style.nameEn} ${location.nameEn}. Directly continuous from last frame with identical polished micro-cement walls and large glass window view of tranquil green rice fields at sunset. Phase 4 and Phase 5 progression: thick cream wool rug unrolled, signature light oak furniture positioned, artisanal ceramics, sheer white curtains swaying softly. Young Asian woman character in sand-beige linen jumpsuit turns on an amber 2700K desk lamp, washing the room in warm golden glow. Macro close-up focus on furniture joints, ${refAssetsPhrase}, and authentic wooden textures. Cozy evening atmosphere, architectural digest aesthetics, photorealistic interior design photography, soft shadows, 8k resolution, cinematic lighting --ar 9:16`,
  };

  const mode1Data: ModeStoryboardData = {
    mode: 1,
    modeTitleTh: 'รูปแบบที่ 1 (Line-by-line Phase Progression)',
    descriptionTh: 'สตอรี่บอร์ดแบ่งตามเฟสก่อสร้างและจัดวาง 2 ซีน (ซีนละ 1 รูป 9:16)',
    totalImagesCount: 2,
    items: [mode1Item1, mode1Item2],
  };

  // ==========================================
  // MODE 2: Shot-by-Shot Short Prompts
  // 1 Image in 9:16:
  // - 7 Keyframes Jump-Cut Storyboard Sheet (Shot 1 to Shot 7)
  // ==========================================
  const mode2Item: StoryboardImagePromptItem = {
    id: 'mode2-7shots',
    imageIndex: 1,
    titleTh: 'สตอรี่บอร์ด 7 คีย์เฟรมแยกช็อต สไตล์ Jump Cut (7 Rapid Jump-Cut Storyboard Frames)',
    titleEn: '7-Shot Sequential Jump-Cut Storyboard Strip (0:00 - 0:20)',
    timeCodeRange: '[0:00 - 0:20]',
    cameraDirection: 'Dynamic Jump-Cut Sequence: Wide -> Low Floor -> Close-Up -> Medium -> Macro (9:16 Strip)',
    motionCommand:
      'High-energy jump-cuts every 2-3 seconds capturing the full transformation arc with rhythmic continuity across 7 distinct camera angles.',
    asmrTarget:
      'Punchy sound effects at every cut: broom sweep, cement trowel scrape, wood click, drill tap, rug drop, curtain swoosh, amber lamp click.',
    isContinuityAnchor: true,
    continuityNotice:
      '⚠️ จุดเชื่อมต่อ Shot 4 ไปยัง Shot 5 (วินาที 10-12): ล็อกมุมกล้อง พื้นไม้ และตำแหน่งหน้าต่างเพื่อความสมูทในการ Jump Cut',
    aspectRatio: '9:16',
    recommendedModel: 'Google Imagen 3 / Midjourney v6 / Veo3 Asset Reference',
    negativePrompt: MANDATORY_NEGATIVE_PROMPT,
    subPhases: [
      {
        subIndex: 'Shot 1',
        labelTh: 'Shot 1: The Raw Awakening (Before & Clear)',
        labelEn: 'Shot 1: Raw empty room clutter clearing',
        timeCode: '[0:00 - 0:03]',
        camera: 'Wide Establishing Shot',
        action: `Sweeping raw debris, large floor-to-ceiling glass window showing green rice fields outside.`,
        asmrTarget: 'Bristle sweeps, echoing empty concrete acoustics.',
      },
      {
        subIndex: 'Shot 2',
        labelTh: 'Shot 2: Wall Refinement (Micro-Cement Mastery)',
        labelEn: 'Shot 2: Plastering smooth micro-cement wall',
        timeCode: '[0:03 - 0:06]',
        camera: 'Medium Eye-Level Shot',
        action: `Troweling ${wallSpec} across wall with seamless strokes.`,
        asmrTarget: 'Wet plaster squelch, metallic trowel scraping sound.',
      },
      {
        subIndex: 'Shot 3',
        labelTh: 'Shot 3: Flooring Click (Oak Wood Installation)',
        labelEn: 'Shot 3: Herringbone blonde oak floor snapping',
        timeCode: '[0:06 - 0:09]',
        camera: 'Low-Angle Floor Shot',
        action: `Interlocking ${floorSpec} clicking tightly into place with rubber mallet.`,
        asmrTarget: 'Satisfying wooden snap, rhythmic rubber mallet taps.',
      },
      {
        subIndex: 'Shot 4',
        labelTh: 'Shot 4: Wall Anchoring (Art & Shelving)',
        labelEn: 'Shot 4: Mounting floating oak shelves & art',
        timeCode: '[0:09 - 0:12]',
        camera: 'Close-Up Tracking Shot',
        action: `Installing floating oak shelves on micro-cement wall (⚠️ Continuity Link to Shot 5).`,
        asmrTarget: 'Screw drill zips, solid wooden shelf locking.',
      },
      {
        subIndex: 'Shot 5',
        labelTh: 'Shot 5: Furniture Glide (Signature Pieces & Rug)',
        labelEn: 'Shot 5: Positioning low-profile oak furniture',
        timeCode: '[0:12 - 0:15]',
        camera: 'Medium Wide Push-In',
        action: `Unrolling cream wool rug and sliding signature oak furniture into frame.`,
        asmrTarget: 'Heavy wool unroll thud, furniture sliding smoothly.',
      },
      {
        subIndex: 'Shot 6',
        labelTh: 'Shot 6: Aesthetic Styling & Greenery',
        labelEn: 'Shot 6: Sheer curtains & ceramic decor arranging',
        timeCode: '[0:15 - 0:18]',
        camera: 'Slow Tracking Medium Shot',
        action: `Sliding sheer white curtains, styling ceramic mugs and green plants.`,
        asmrTarget: 'Curtain rings gliding on rail, ceramic cup clink.',
      },
      {
        subIndex: 'Shot 7',
        labelTh: 'Shot 7: The Cozy Reveal & Ambient Glow',
        labelEn: 'Shot 7: Amber 2700K lighting & macro reveal',
        timeCode: '[0:18 - 0:20]',
        camera: 'Cinematic Push-In to Macro Close-Up',
        action: `Amber lamp clicks on, macro camera tracking over textures and ${refAssetsPhrase}, character smiles at sunset rice fields.`,
        asmrTarget: 'Snappy toggle switch click, warm lo-fi bass hum fade-out.',
      },
    ],
    imagePrompt9x16: `9:16 vertical storyboard contact sheet / multi-panel cinematographic storyboard strip containing 7 discrete sequential jump-cut keyframes (Shot 1 to Shot 7) in 9:16 aspect ratio. Depicts the complete rapid transformation of ${location.nameEn} in ${style.nameEn} style: Shot 1 raw cluttered room with rice fields window; Shot 2 applying smooth micro-cement with trowel; Shot 3 clicking blonde oak herringbone planks; Shot 4 mounting shelves; Shot 5 placing signature oak furniture and cream rug; Shot 6 styling sheer curtains and botanical plants; Shot 7 warm 2700K amber desk lamp clicked on with cozy evening smile. Asian female character in beige jumpsuit consistent across frames. Clean grid layout with film strip borders, professional director pitch storyboard presentation, photorealistic architectural photography, ultra-detailed --ar 9:16`,
  };

  const mode2Data: ModeStoryboardData = {
    mode: 2,
    modeTitleTh: 'รูปแบบที่ 2 (Shot-by-Shot Short Prompts)',
    descriptionTh: 'สตอรี่บอร์ด 7 คีย์เฟรมแยกช็อต สไตล์ Jump Cut (1 รูป 9:16)',
    totalImagesCount: 1,
    items: [mode2Item],
  };

  // ==========================================
  // MODE 3: ASMR Time-lapse Storyboard
  // 2 Images in 9:16:
  // - Image 1: Scene 1 ถึง Scene 10 (0:00 - 0:10 งานโครงสร้าง & จุดล็อกเฟรม)
  // - Image 2: Scene 11 ถึง Scene 20 (0:10 - 0:20 งานตกแต่ง & Final Reveal)
  // ==========================================
  const mode3Item1: StoryboardImagePromptItem = {
    id: 'mode3-scene1-10',
    imageIndex: 1,
    titleTh: 'ภาพที่ 1 (Scene 1 ถึง Scene 10): งานโครงสร้าง & จุดล็อกเฟรมวินาทีที่ 10',
    titleEn: 'Storyboard Image 1: Scene 1 to Scene 10 - Build & Continuity Lock (0:00 - 0:10)',
    timeCodeRange: '[0:00 - 0:10]',
    cameraDirection: 'Second-by-second ASMR time-lapse progression in vertical 9:16 layout',
    motionCommand:
      'Fluid, highly satisfying time-lapse progression showing 10 sequential seconds of raw room transformation into a pristine architectural space.',
    asmrTarget:
      'Crisp sweeping, scraping, tapping, and clicking ASMR sounds leading to tranquil empty room tone at second 10.',
    isContinuityAnchor: true,
    continuityNotice:
      '⚠️ MANDATORY CONTINUITY ANCHOR: จุดล็อกเฟรมวินาที 0:09 - 0:10 คือจุดสิ้นสุด Scene 1 ต้องเปิดใช้ "Use last frame" เพื่อล็อกตำแหน่งหน้าต่างและผนังเข้าสู่ Scene 2',
    aspectRatio: '9:16',
    recommendedModel: 'Google Imagen 3 / Midjourney v6 / Veo3 Asset Reference',
    negativePrompt: MANDATORY_NEGATIVE_PROMPT,
    subPhases: [
      { subIndex: 1, labelTh: '0:00-0:01 จุดเริ่มต้นห้องว่างเปล่า/สภาพเดิม', labelEn: 'Before empty raw shell', timeCode: '[0:00-0:01]', camera: 'High-Angle Wide', action: 'Raw unrenovated room with flat light.', asmrTarget: 'Echoing room tone.' },
      { subIndex: 2, labelTh: '0:01-0:02 ตัวละครเริ่มทำความสะอาด เคลียร์สิ่งกีดขวาง', labelEn: 'Broom sweeping dust', timeCode: '[0:01-0:02]', camera: 'Eye-Level Medium Wide', action: `${characterSpec} sweeping concrete dust.`, asmrTarget: 'Crisp broom sweeps.' },
      { subIndex: 3, labelTh: '0:02-0:03 ขนย้ายแผ่นไม้และถังปูนเปลือยเข้าฉาก', labelEn: 'Staging materials', timeCode: '[0:02-0:03]', camera: 'Low-Angle Tracking', action: 'Oak planks and cement buckets staged.', asmrTarget: 'Solid wood bundle clank.' },
      { subIndex: 4, labelTh: '0:03-0:04 ฉาบปูนเปลือยรองพื้นรอบแรกบนผนัง', labelEn: 'First coat micro-cement', timeCode: '[0:03-0:04]', camera: 'Close-Up Plastering', action: 'Trowel spreads wet gray cement.', asmrTarget: 'Wet plaster squelch.' },
      { subIndex: 5, labelTh: '0:04-0:05 ปาดปูนขัดมันรอบสองให้เรียบเนียน', labelEn: 'Second burnish coat', timeCode: '[0:04-0:05]', camera: 'Medium Tracking', action: 'Burnishing micro-cement to soft sheen.', asmrTarget: 'Metallic blade hum.' },
      { subIndex: 6, labelTh: '0:05-0:06 ปูแผ่นโฟมรองพื้นกันเสียง', labelEn: 'Acoustic underlayment', timeCode: '[0:05-0:06]', camera: 'Floor Close-Up', action: 'Foam underlayment unrolls.', asmrTarget: 'Soft foam friction.' },
      { subIndex: 7, labelTh: '0:06-0:07 ต่อแผ่นไม้พื้นโอ๊คแบบกริ๊กล็อก', labelEn: 'Interlocking oak planks', timeCode: '[0:06-0:07]', camera: 'Low-Angle Macro', action: 'Herringbone planks snapping together.', asmrTarget: 'Sharp satisfying wood click.' },
      { subIndex: 8, labelTh: '0:07-0:08 ติดตั้งชั้นไม้ลอยตัวบนผนัง', labelEn: 'Floating shelves mounting', timeCode: '[0:07-0:08]', camera: 'Medium High', action: 'Fastening minimal oak shelves.', asmrTarget: 'Clean mechanical tap.' },
      { subIndex: 9, labelTh: '0:08-0:09 เช็ดทำความสะอาดและเก็บรายละเอียด', labelEn: 'Final dusting wipe', timeCode: '[0:08-0:09]', camera: 'Eye-Level Pan', action: 'Wiping fine micro-dust off wood.', asmrTarget: 'Microfiber cloth glide.' },
      { subIndex: 10, labelTh: '0:09-0:10 ห้องว่างเปล่าฉบับเสร็จสมบูรณ์ / จุดล็อกเฟรม', labelEn: 'Continuity Anchor Lock-Off', timeCode: '[0:09-0:10]', camera: 'Static Wide Lock-Off', action: `Pristine empty finished room lock-off with ${windowSpec}. Warm sunlight.`, asmrTarget: 'Pure ambient air tone.' },
    ],
    imagePrompt9x16: `9:16 portrait vertical architectural storyboard panel visual, Scene 1 to Scene 10 (0:00 to 0:10 seconds) ASMR time-lapse construction phase of modern ${style.nameEn} ${location.nameEn}. 10 sequential second-by-second keyframes: 1 Before raw room, 2 Sweeping dust, 3 Bringing oak planks, 4 Troweling micro-cement skim coat, 5 Buffing wall sheen, 6 Foam underlayment roll out, 7 Herringbone floor snapping, 8 Shelving installation, 9 Final dust wipe, 10 Pristine empty finished architectural lock-off bathed in golden daylight with floor-to-ceiling glass window showing green rice fields. Clean vertical sequence storyboard composition, precise architectural lighting, photorealistic 8k render, professional Google Flow Veo3 visual blueprint --ar 9:16`,
  };

  const mode3Item2: StoryboardImagePromptItem = {
    id: 'mode3-scene11-20',
    imageIndex: 2,
    titleTh: 'ภาพที่ 2 (Scene 11 ถึง Scene 20): งานตกแต่ง & Final Reveal ปิดท้าย',
    titleEn: 'Storyboard Image 2: Scene 11 to Scene 20 - Styling & Final Reveal (0:10 - 0:20)',
    timeCodeRange: '[0:10 - 0:20]',
    cameraDirection: 'Second-by-second ASMR styling & macro reveal progression in vertical 9:16 layout',
    motionCommand:
      'Continuous from Scene 1 last frame: 10 discrete styling actions unrolling wool rug, sliding in furniture, styling ceramics, drawing curtains, clicking 2700K lighting, and relaxing macro sweep.',
    asmrTarget:
      'Satisfying unrolling, sliding, sliding curtain rings, mechanical lamp switch click, lo-fi warm sunset tone.',
    isContinuityAnchor: true,
    continuityNotice:
      '⚠️ ล็อกเฟรมต่อเนื่องจากวินาทีที่ 10 (Scene 1 Last Frame) เพื่อรักษาระดับพื้นไม้ ผนังปูน และหน้าต่างบานใหญ่ให้ต่อเนื่อง 100%',
    aspectRatio: '9:16',
    recommendedModel: 'Google Imagen 3 / Midjourney v6 / Veo3 Asset Reference',
    negativePrompt: MANDATORY_NEGATIVE_PROMPT,
    subPhases: [
      { subIndex: 11, labelTh: '0:10-0:11 คลี่พรมทอมือผืนใหญ่ลงบนพื้นไม้โอ๊ค', labelEn: 'Wool rug unrolling', timeCode: '[0:10-0:11]', camera: 'Low-Angle Tracking', action: 'Cream wool rug unrolling across wood.', asmrTarget: 'Soft heavy rug unroll.' },
      { subIndex: 12, labelTh: '0:11-0:12 เลื่อนเฟอร์นิเจอร์หลักเข้าสู่ตำแหน่ง', labelEn: 'Signature furniture placement', timeCode: '[0:11-0:12]', camera: 'Medium Tracking', action: 'Oak desk and comfortable chair slide in.', asmrTarget: 'Wood glide on wool.' },
      { subIndex: 13, labelTh: '0:12-0:13 จัดวางของแต่งห้องและเซรามิกทำมือ', labelEn: 'Handmade ceramic styling', timeCode: '[0:12-0:13]', camera: 'Close-Up Tabletop', action: `${characterSpec} arranges handcrafted pottery.`, asmrTarget: 'Ceramic cup clink.' },
      { subIndex: 14, labelTh: '0:13-0:14 แขวนผ้าม่านโปร่งแสงสีขาวริมหน้าต่าง', labelEn: 'Sheer curtains gliding', timeCode: '[0:13-0:14]', camera: 'High Window Angle', action: 'Sheer white curtains drawn along rail.', asmrTarget: 'Curtain rings glide.' },
      { subIndex: 15, labelTh: '0:14-0:15 วางกระถางต้นไม้และหนังสือบนชั้นวาง', labelEn: 'Botanical greenery placement', timeCode: '[0:14-0:15]', camera: 'Eye-Level Medium', action: 'Indoor plants styled on floating shelf.', asmrTarget: 'Terracotta pot placement.' },
      { subIndex: 16, labelTh: '0:15-0:16 แสงแดดสะท้อนละอองฝุ่นทองในอากาศ', labelEn: 'Golden sunlight dust motes', timeCode: '[0:15-0:16]', camera: 'Cinematic Slow Motion', action: 'Volumetric golden sunlight beams.', asmrTarget: 'Deep warm room vibration.' },
      { subIndex: 17, labelTh: '0:16-0:17 ท้องฟ้าหลังกระจกเปลี่ยนเป็นสีส้มยามเย็น', labelEn: 'Sunset rice field transition', timeCode: '[0:16-0:17]', camera: 'Window Framing Wide', action: 'Sunset sky glowing over green rice fields.', asmrTarget: 'Distant evening breeze.' },
      { subIndex: 18, labelTh: '0:17-0:18 เปิดสวิตช์โคมไฟ แสงส้ม 2700K อาบทั้งห้อง', labelEn: 'Amber lamp switch toggle', timeCode: '[0:17-0:18]', camera: 'Close-Up Lamp Push-In', action: 'Clicking toggle switch of amber desk lamp.', asmrTarget: 'Audible mechanical click.' },
      { subIndex: 19, labelTh: '0:18-0:19 กล้องเคลื่อนช้าๆ โฟกัสดีเทลเนื้อไม้และของแต่งห้อง', labelEn: 'Macro texture sweep', timeCode: '[0:18-0:19]', camera: 'Macro Tracking Sweep', action: `Macro detail sweep over wood joinery and ${refAssetsPhrase}.`, asmrTarget: 'Warm deep bass drone.' },
      { subIndex: 20, labelTh: '0:19-0:20 ตัวละครนั่งพัก ดื่มด่ำบรรยากาศและยิ้มให้กล้อง', labelEn: 'Final peaceful smile reveal', timeCode: '[0:19-0:20]', camera: 'Cinematic Medium Close-Up', action: 'Character relaxes smiling comfortably at camera.', asmrTarget: 'Lo-fi chord gentle fade.' },
    ],
    imagePrompt9x16: `9:16 portrait vertical architectural storyboard panel visual, Scene 11 to Scene 20 (0:10 to 0:20 seconds) ASMR styling & reveal phase of modern ${style.nameEn} ${location.nameEn}. Seamless continuity from second 10. 10 sequential second-by-second keyframes: 11 Cream wool rug unrolling, 12 Oak furniture sliding in, 13 Placing artisanal ceramics and mug, 14 Sheer white curtains gliding on rail, 15 Indoor plants on shelf, 16 Sunlight dust motes, 17 Sunset sky glowing outside window, 18 Amber 2700K lamp clicks on casting warm shadows, 19 Macro tracking sweep over ${refAssetsPhrase}, 20 Character enjoying evening drink smiling at camera with sunset rice fields backdrop. Professional vertical storyboard sheet, cozy cinematic aesthetic, 8k resolution, Hasselblad look --ar 9:16`,
  };

  const mode3Data: ModeStoryboardData = {
    mode: 3,
    modeTitleTh: 'รูปแบบที่ 3 (ASMR Time-lapse Storyboard)',
    descriptionTh: 'สตอรี่บอร์ดละเอียด 20 คีย์เฟรม วินาทีต่อวินาที (2 รูป 9:16: Scene 1-10 และ Scene 11-20)',
    totalImagesCount: 2,
    items: [mode3Item1, mode3Item2],
  };

  const currentMode = mode === 1 ? mode1Data : mode === 2 ? mode2Data : mode3Data;

  return {
    mode1: mode1Data,
    mode2: mode2Data,
    mode3: mode3Data,
    currentMode,
  };
}
