import {
  GeneratedDirectorResponse,
  PromptModeId,
  LocationItem,
  DesignStyle,
  RoomCondition,
  ReferenceImageItem,
} from '../types/director';
import { MANDATORY_NEGATIVE_PROMPT } from '../data/presets';
import { buildStoryboardPrompts } from './storyboardPromptBuilder';

interface BuildParams {
  location: LocationItem | { id: string; category: any; nameTh: string; nameEn: string; keyElementsTh: string[]; keyElementsEn: string[]; description: string };
  style: DesignStyle;
  condition: RoomCondition;
  mode: PromptModeId;
  customNotes?: string;
  referenceImageName?: string;
  referenceImagePreview?: string;
  referenceImages?: ReferenceImageItem[];
  scrubData?: boolean;
}

// Confidential data scrubber to protect user privacy
export function scrubSensitiveData(text: string): string {
  if (!text) return '';
  return text
    // Replace telephone numbers (Thai / Int'l)
    .replace(/(?:\+?66|0)[0-9]{1,2}[-\s]?[0-9]{3,4}[-\s]?[0-9]{3,4}/g, '[CONFIDENTIAL_PHONE]')
    // Replace email addresses
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[CONFIDENTIAL_EMAIL]')
    // Replace budget amounts like 50,000 บาท / $10,000 / 500k
    .replace(/(?:\$|฿|THB\s?|USD\s?)\s?[\d,]+(?:\.\d+)?|\b\d+(?:,\d+)*(?:\s?(?:บาท|bath|THB|k|m))\b/gi, '[CONFIDENTIAL_BUDGET]')
    // Replace street addresses / soi / moo / postcode
    .replace(/(?:บ้านเลขที่|ซอย|ถนน|หมู่ที่|แขวง|เขต|ต\.|อ\.|จ\.)\s?[\u0E00-\u0E7Fa-zA-Z0-9\s/.-]+/g, '[CONFIDENTIAL_ADDRESS]')
    // Replace 5-digit postcodes
    .replace(/\b[1-9][0-9]{4}\b/g, '[CONFIDENTIAL_POSTCODE]');
}

export function generateDirectorScript(params: BuildParams): GeneratedDirectorResponse {
  const {
    location,
    style,
    condition,
    mode,
    customNotes = '',
    referenceImageName,
    referenceImagePreview,
    referenceImages,
    scrubData = true,
  } = params;

  const cleanedNotes = scrubData ? scrubSensitiveData(customNotes) : customNotes;

  // Resolve all reference images (multi-image support with backward compatibility)
  const allImages: ReferenceImageItem[] = referenceImages && referenceImages.length > 0
    ? referenceImages
    : (referenceImagePreview ? [{ id: 'ref-legacy-1', name: referenceImageName || 'reference-furniture.jpg', previewUrl: referenceImagePreview }] : []);

  const imageNamesList = allImages.length > 0
    ? allImages.map(img => img.name.replace(/\.[^/.]+$/, "")).filter(Boolean).slice(0, 5).join(', ')
    : '';

  const imageRefPromptPhrase = imageNamesList
    ? `macro detail sweep over fine furniture joints and uploaded image decor references (${imageNamesList})`
    : 'macro detail sweep over furniture joints and uploaded image decor references';

  // Extract key elements
  const keyItemsEn = location.keyElementsEn.join(', ');
  const keyItemsTh = location.keyElementsTh.join(', ');

  // Base texture tokens
  const wallSpec = 'smooth polished micro-cement loft walls with architectural soft sheen';
  const floorSpec = 'light blonde oak herringbone wood planks with natural timber grain';
  const windowSpec = 'large floor-to-ceiling black aluminum sliding glass window revealing panoramic serene green rice fields and lush tropical landscape';
  const characterSpec = 'a focused young Asian woman with neat tied-back hair wearing a stylish minimalist earth-tone sand-beige linen jumpsuit and matching work sneakers, maintaining consistent outfit throughout';

  // Mode 1: Line-by-line Phase Progression
  const mode1Scene1Prompt = `[0-3s] Phase 1: High-angle static wide shot, 9:16 aspect ratio. ${condition.promptPhrase} Large floor-to-ceiling glass window showing green rice fields outside. ${characterSpec} enters the scene holding cleaning supplies, sweeping away fine dust and clearing debris across the subfloor with rhythmic, fluid motions.
[3-7s] Phase 2: Eye-level tracking time-lapse. The raw walls rapidly transform into ${wallSpec}. She carefully rolls acoustic underlayment and snaps interlocking ${floorSpec} across the entire space with satisfying precision.
[7-10s] Phase 3: Seamless smooth pan. Base architectural finishing completes. Warm golden afternoon sunlight streams through the clean window onto the newly laid floor. She dusts off the micro-cement walls and gives a satisfied nod.`;

  const mode1Scene2Prompt = `(⚠️ MANDATORY: Enable "Use last frame" from second 10 of Scene 1 to ensure 100% architectural continuity, window placement, and wall texture)
[0-5s] Phase 4: Eye-level static wide shot, 9:16 aspect ratio. Continuous from previous scene. ${characterSpec} effortlessly glides into frame carrying large signature furniture items: unrolls a textured cream-beige wool rug, positions the low-profile light oak wood foundation furniture, and fastens minimal floating fixtures.
[5-10s] Phase 5: Cinematic slow tracking close-up to medium shot. Styling details lock into place: ${keyItemsEn}. She arranges artisanal ceramic decor, fluffs cushions, slides sheer white curtains across the window frame, and clicks on an amber desk lamp casting a warm cozy ambient glow. Camera executes a ${imageRefPromptPhrase}, authentic framed wall art, and ambient textures, as she sits down calmly, smiling towards camera against the sunset rice field view.`;

  // Mode 2: Shot-by-Shot Short Prompts Structure (7 Rapid Cuts)
  const mode2Shots = [
    {
      shotNumber: 1,
      timeRange: '[0-3s]',
      shotName: 'The Raw Awakening (Before & Clear)',
      cameraType: 'Wide Establishing Shot',
      prompt: `Wide establishing angle, 9:16 aspect ratio. ${characterSpec} energetically sweeps fine construction dust and clears old clutter from the raw empty space. Background features ${windowSpec} under bright morning light.`,
      negativePrompt: MANDATORY_NEGATIVE_PROMPT,
      audioASMRTarget: 'Crisp ASMR sweeping bristles on concrete, cardboard folding, dust settling, ambient morning birds chirping outside.',
    },
    {
      shotNumber: 2,
      timeRange: '[3-6s]',
      shotName: 'Wall Refinement (Micro-Cement Mastery)',
      cameraType: 'Medium Eye-Level Shot',
      prompt: `Medium eye-level shot, 9:16 aspect ratio. ${characterSpec} uses a stainless steel plastering trowel to apply a flawless layer of ${wallSpec}. The textured gray surface dries instantly into a smooth modern finish.`,
      negativePrompt: MANDATORY_NEGATIVE_PROMPT,
      audioASMRTarget: 'Wet plaster squelch, metallic trowel scraping rhythmically across smooth wall, satisfying scrape sounds.',
    },
    {
      shotNumber: 3,
      timeRange: '[6-9s]',
      shotName: 'Flooring Click (Oak Wood Installation)',
      cameraType: 'Low-Angle Floor Shot',
      prompt: `Low-angle floor perspective, 9:16 aspect ratio. ${characterSpec} clicks together interlocking planks of ${floorSpec}, tapping with a rubber mallet until the floor stretches seamlessly across the entire room.`,
      negativePrompt: MANDATORY_NEGATIVE_PROMPT,
      audioASMRTarget: 'Distinct satisfying wooden clicks, dull rhythmic rubber mallet taps on wood, timber board sliding.',
    },
    {
      shotNumber: 4,
      timeRange: '[9-12s]',
      shotName: 'Wall Anchoring (Art & Shelving)',
      cameraType: 'Close-Up Tracking Shot',
      prompt: `Close-up tracking shot, 9:16 aspect ratio. ${characterSpec} drills and mounts floating oak shelving, then hangs authentic framed artwork and architectural canvas prints on the polished micro-cement wall without empty frames.`,
      negativePrompt: MANDATORY_NEGATIVE_PROMPT,
      audioASMRTarget: 'Brief high-pitched cordless electric drill hum, clean tap of frame resting on hook, level vial bubble settle.',
    },
    {
      shotNumber: 5,
      timeRange: '[12-15s]',
      shotName: 'Main Anchor Furniture Placement',
      cameraType: 'Wide Smooth Pan',
      prompt: `Wide smooth pan, 9:16 aspect ratio. (Use last frame). ${characterSpec} rolls out a heavy woven cream-beige textured rug and slides key primary furniture pieces into place, aligning naturally with the panoramic window.`,
      negativePrompt: MANDATORY_NEGATIVE_PROMPT,
      audioASMRTarget: 'Heavy fabric thud of rug unfurling, smooth glide of wooden furniture legs over wood floor, satisfied exhale.',
    },
    {
      shotNumber: 6,
      timeRange: '[15-18s]',
      shotName: 'Aesthetic Styling & Greenery',
      cameraType: 'Slow Tracking Medium Shot',
      prompt: `Slow tracking medium shot, 9:16 aspect ratio. ${characterSpec} delicately styles the area with ${keyItemsEn}, indoor botanical plants, ceramic mugs, and pulls sheer white curtains along the window track.`,
      negativePrompt: MANDATORY_NEGATIVE_PROMPT,
      audioASMRTarget: 'Ceramic cup clinking onto wood tabletop, curtain rings gliding smoothly along metal rod, subtle rustle of monstera leaves.',
    },
    {
      shotNumber: 7,
      timeRange: '[18-20s]',
      shotName: 'The Cozy Reveal & Ambient Glow',
      cameraType: 'Cinematic Slow Push-In to Close-Up',
      prompt: `Cinematic slow push-in to close-up, 9:16 aspect ratio. ${characterSpec} clicks the toggle switch of an amber desk lamp, washing the room in warm golden 2700K illumination. Camera executes a ${imageRefPromptPhrase}. She sits down comfortably, enjoying a hot drink and smiling at camera with the lush green rice fields glowing in sunset beyond.`,
      negativePrompt: MANDATORY_NEGATIVE_PROMPT,
      audioASMRTarget: 'Audible mechanical toggle switch click (snappy ASMR), warm deep bass hum of soft lighting, gentle evening breeze, ambient lo-fi chord fade-out.',
    },
  ];

  // Mode 3: ASMR Time-lapse Storyboard (20 Detailed Segments)
  const mode3Scene1Steps = [
    {
      timeCode: '[0:00-0:01]',
      sceneNumber: 1,
      titleTh: 'Before / จุดเริ่มต้นห้องว่างเปล่า ยังไม่ได้ตกแต่ง หรือสภาพเก่า',
      actionEn: 'Wide high-angle lock-off showing the unrenovated room with harsh flat lighting and raw architectural shell.',
      asmrCue: 'Echoing room tone, distant outdoor wind humming.',
      camera: 'Static High-Angle Wide',
    },
    {
      timeCode: '[0:01-0:02]',
      sceneNumber: 2,
      titleTh: 'เตรียมพื้นที่ / ตัวละครเริ่มทำความสะอาด เคลียร์สิ่งกีดขวาง',
      actionEn: `${characterSpec} enters with natural stride, energetically sweeping concrete dust and sorting debris into tidy containers.`,
      asmrCue: 'Crisp broom sweeps, cardboard box sliding with friction.',
      camera: 'Eye-Level Medium Wide',
    },
    {
      timeCode: '[0:02-0:03]',
      sceneNumber: 3,
      titleTh: 'เริ่มลงมือทำ / เริ่มขนย้ายโครงสร้างพื้นฐานหรือวัสดุหลักเข้าฉาก',
      actionEn: 'Stacks of oak wood flooring planks and buckets of micro-cement finish are brought in and staged neatly along the perimeter.',
      asmrCue: 'Solid wooden bundles resting on floor, bucket handle clank.',
      camera: 'Low-Angle Tracking',
    },
    {
      timeCode: '[0:03-0:04]',
      sceneNumber: 4,
      titleTh: 'ขั้นตอนโครงสร้าง 1 / ตัวละครเริ่มปรับปรุงผิวผนัง (ทาสี/ฉาบปูนเปลือย)',
      actionEn: `${characterSpec} sweeps trowel in broad arcing strokes, smoothing fresh wet micro-cement across rough wall surfaces.`,
      asmrCue: 'Wet trowel skimming cream paste against stone wall.',
      camera: 'Medium Over-the-Shoulder',
    },
    {
      timeCode: '[0:04-0:05]',
      sceneNumber: 5,
      titleTh: 'ขั้นตอนโครงสร้าง 2 / พื้นผิวผนังเปลี่ยนแปลงเสร็จสมบูรณ์อย่างเนียนตา',
      actionEn: 'Time-lapse acceleration shows micro-cement curing evenly to a refined matte industrial sheen, catching diffused sunlight.',
      asmrCue: 'Soft whoosh of rapid drying, gentle ambient air flow.',
      camera: 'Smooth 45-degree Pan',
    },
    {
      timeCode: '[0:05-0:06]',
      sceneNumber: 6,
      titleTh: 'ขั้นตอนพื้นผิว 1 / ตัวละครเริ่มลงมือรื้อปรับปรุงพื้นที่หรือปูพื้นผิวใหม่',
      actionEn: 'She unrolls black acoustic insulation underlayment and begins laying the first interlocking row of light oak wood flooring.',
      asmrCue: 'Foil underlayment crinkles, first wood tongue-and-groove click.',
      camera: 'Close-Up Floor Level',
    },
    {
      timeCode: '[0:06-0:07]',
      sceneNumber: 7,
      titleTh: 'ขั้นตอนพื้นผิว 2 / แผ่นพื้นล็อกเข้าที่และปูเต็มพื้นที่ห้องอย่างเรียบร้อย',
      actionEn: 'Consecutive rows of blonde oak timber snap rapidly across the floor like dominoes, completing the pristine wood surface.',
      asmrCue: 'Rapid rhythmic wooden snapping clicks, rubber mallet taps.',
      camera: 'Wide Floor Pull-Back',
    },
    {
      timeCode: '[0:07-0:08]',
      sceneNumber: 8,
      titleTh: 'ติดตั้งอุปกรณ์ผนัง / ตัวละครใช้เครื่องมือช่างติดตั้งชั้นวางหรือติดตั้งรูปภาพบนผนัง',
      actionEn: `${characterSpec} uses laser level and cordless drill to hang heavy wooden floating shelves and art frames with genuine canvas prints.`,
      asmrCue: 'Zipping cordless drill torque, crisp click of level bubble.',
      camera: 'Medium Tight Tracking',
    },
    {
      timeCode: '[0:08-0:09]',
      sceneNumber: 9,
      titleTh: 'ตรวจสอบความสะอาด / ตัวละครเช็ดทำความสะอาดฝุ่นปูนและฝุ่นไม้บนพื้น',
      actionEn: 'She glides a microfiber flat mop over the gleaming oak floor, erasing any dust footprints and revealing timber luster.',
      asmrCue: 'Soft whisper of microfiber on wax timber, water mist puff.',
      camera: 'Low Tracking Glide',
    },
    {
      timeCode: '[0:09-0:10]',
      sceneNumber: 10,
      titleTh: 'สรุปโครงสร้างห้องใหม่ / ภาพห้องเปล่าสไตล์ Loft-Japandi ที่ทำโครงสร้างเสร็จสมบูรณ์',
      actionEn: `Clean architectural lock-off showing the pristine empty room with ${wallSpec}, ${floorSpec}, and ${windowSpec}. Ready for furniture styling.`,
      asmrCue: 'Deep warm architectural resonance, melodic wind chime.',
      camera: 'Symmetrical Wide Center Lock-off',
    },
  ];

  const mode3Scene2Steps = [
    {
      timeCode: '[0:10-0:11]',
      sceneNumber: 11,
      titleTh: 'เริ่มจัดเฟอร์นิเจอร์หลัก / พรมผืนใหญ่ถูกปูลงพื้น และโครงเฟอร์นิเจอร์หลักเลื่อนเข้าฉาก',
      actionEn: `(⚠️ Use last frame active). ${characterSpec} unrolls a thick braided natural wool area rug in soft oatmeal tone; primary solid oak furniture structure slides in smoothly.`,
      asmrCue: 'Deep heavy fabric roll unfurl, wood runners sliding gently.',
      camera: 'Wide Eye-Level Steadycam',
    },
    {
      timeCode: '[0:11-0:12]',
      sceneNumber: 12,
      titleTh: 'ประกอบเฟอร์นิเจอร์ชิ้นใหญ่ / ตัวละครจัดเบาะ จัดที่นอน หรือปูผ้าเข้าที่',
      actionEn: 'She arranges dense natural linen cushions and smooths textured throw blankets with rhythmic folding motions.',
      asmrCue: 'Crisp fabric flaps, cushion puffing air whoosh.',
      camera: 'Medium Over-the-Shoulder',
    },
    {
      timeCode: '[0:12-0:13]',
      sceneNumber: 13,
      titleTh: 'จัดวางโต๊ะทำงาน / โต๊ะไม้และเก้าอี้มินิมอลถูกขยับจัดวางเข้ามุมริมหน้าต่าง',
      actionEn: 'A minimalist oak writing desk and ergonomic woven cord chair are slid perfectly parallel to the floor-to-ceiling glass window.',
      asmrCue: 'Felt furniture pad sliding with muffled glide, chair wood creak.',
      camera: 'Slow Orbit Tracking',
    },
    {
      timeCode: '[0:13-0:14]',
      sceneNumber: 14,
      titleTh: 'ติดตั้งระบบไฟ / ตัวละครหมุนเปลี่ยนหลอดไฟหรือจัดตำแหน่งโคมไฟตั้งโต๊ะ',
      actionEn: 'She threads a vintage Edison globe bulb into an architectural brass and matte black desk lamp and positions it neatly.',
      asmrCue: 'Delicate metallic bulb screw threading, glass tap ring.',
      camera: 'Tight Macro Detail',
    },
    {
      timeCode: '[0:14-0:15]',
      sceneNumber: 15,
      titleTh: 'ตกแต่งสิ่งของขนาดเล็ก / ตัวละครเริ่มนำแล็ปท็อป แก้วกาแฟ มาวางบนโต๊ะ',
      actionEn: 'She places a slim silver laptop, a steaming ceramic latte cup, and a leather notebook on the wooden desk surface.',
      asmrCue: 'Satisfying ceramic mug clink on wood, gentle steam hiss.',
      camera: 'Top-Down 45-degree Angle',
    },
    {
      timeCode: '[0:15-0:16]',
      sceneNumber: 16,
      titleTh: 'จัดองค์ประกอบชั้นวาง / ทยอยวางกระถางต้นไม้และหนังสือบนโต๊ะหรือชั้นวาง',
      actionEn: 'Hardcover design books with cream spines are stacked, alongside a terracotta pot with a trailing heartleaf philodendron.',
      asmrCue: 'Book page rustle, terracotta clay scrape on shelf.',
      camera: 'Eye-Level Shelf Pan',
    },
    {
      timeCode: '[0:16-0:17]',
      sceneNumber: 17,
      titleTh: 'เพิ่มความละมุน / ตัวละครติดตั้งผ้าม่านโปร่งแสงสีขาวที่หน้าต่างกระจก',
      actionEn: 'She attaches sheer ethereal white linen curtains onto the recessed ceiling track and sweeps them into cascading soft pleats.',
      asmrCue: 'Curtain glide along track, soft fabric drape flutter.',
      camera: 'Wide Window Tracking',
    },
    {
      timeCode: '[0:17-0:18]',
      sceneNumber: 18,
      titleTh: 'ตรวจทานความเรียบร้อย / ตัวละครขยับจัดหมอนอิงรูปดอกไม้และเช็ดหน้าจอคอมพิวเตอร์',
      actionEn: 'She plumps a sculptural flower-shaped earth-tone cushion and gives the workspace a final loving wipe.',
      asmrCue: 'Velvety cushion pat, microfiber screen wipe swipe.',
      camera: 'Close-Up Action Focus',
    },
    {
      timeCode: '[0:18-0:19]',
      sceneNumber: 19,
      titleTh: 'เปิดระบบแสงเงา / ไฟส้มโทนอุ่นจากโคมไฟที่เปิดขึ้น แสงแดดเย็นส่องผ่านผ้าม่านโปร่ง',
      actionEn: 'Click! Warm 2700K amber lighting blooms from lamps; golden sunset rays filter through the sheer curtains creating soft volumetric light rays.',
      asmrCue: 'Tactile switch click, subtle electrical hum, warm acoustic bloom.',
      camera: 'Slow Cinematic Push-In',
    },
    {
      timeCode: '[0:19-0:20]',
      sceneNumber: 20,
      titleTh: 'Final Result / ตัวละครนั่งลงบนเตียงหรือเก้าอี้อย่างเป็นธรรมชาติ หันมาส่งยิ้มให้กล้อง ท่ามกลางห้องมินิมอลที่สมบูรณ์แบบพร้อมวิวทุ่งนาด้านนอก',
      actionEn: `${characterSpec} comfortably sits in the finished room, holds her coffee, and turns to give a warm, genuine smile to camera. Lush emerald rice field view glows peacefully outside.`,
      asmrCue: 'Deep calming exhale, birds singing outside, peaceful lo-fi chords swell.',
      camera: 'Golden Hour Beauty Portrait Shot with Macro Tracking on Texture',
    },
  ];

  // Full formatted Scene 1 & 2 prompts for Mode 3
  const mode3Scene1FullPrompt = `[SCENE 1: THE FOUNDATION & BUILD - 10 SECONDS]
Aspect Ratio: 9:16 portrait. High production value Veo3 quality.
[0:00-0:01] Symmetrical wide angle of ${condition.promptPhrase}.
[0:01-0:03] ${characterSpec} sweeps construction dust with rhythmic broom strokes.
[0:03-0:05] Trowel application: ${wallSpec} rapidly coats the space with clean industrial polish.
[0:05-0:07] Floor assembly: Interlocking ${floorSpec} snaps tightly across the floor in seamless time-lapse.
[0:07-0:09] Installation of floating oak shelving and authentic framed art on walls.
[0:09-0:10] Camera settles into pristine empty finished room lock-off with ${windowSpec}. Warm diffused light.`;

  const mode3Scene2FullPrompt = `[SCENE 2: THE STYLING & FINAL REVEAL - 10 SECONDS]
(⚠️ MANDATORY: Enable "Use last frame" from 0:10 of Scene 1 to preserve exact window position, polished micro-cement, and floor alignment)
Aspect Ratio: 9:16 portrait. Veo3 photorealistic cinematic quality.
[0:10-0:12] Continuous from last frame. Thick cream wool rug unrolls; signature oak furniture slides gracefully into place.
[0:12-0:15] ${characterSpec} positions ${keyItemsEn}, arranges ceramics and steaming mug.
[0:15-0:17] Cascading sheer white curtains hang gracefully along the glass window; books and botanical plants styled on shelves.
[0:17-0:19] Amber 2700K lighting clicks on, painting soft warm shadows against micro-cement.
[0:19-0:20] Close-up ${imageRefPromptPhrase}. Character relaxes comfortably, smiling at camera with the tranquil green rice fields in sunset background.`;

  const thaiCaptions = {
    hook: `✨ จากห้อง${condition.nameTh.includes('รก') ? 'รกสุดพัง' : condition.nameTh.includes('ว่าง') ? 'โล่งๆ ไร้วิญญาณ' : 'ดิบปูนเปลือย'} สู่ ${location.nameTh} สไตล์ ${style.nameTh} ใน 20 วินาที! 🌿`,
    caption: `แปลงโฉม ${location.nameTh} ให้กลายเป็นสเปซในฝันด้วยโทน Cozy Industrial-Japandi 🪵✨ ผนังปูนเปลือยขัดมันตัดกับพื้นไม้โอ๊คอุ่นๆ เปิดม่านรับวิวทุ่งนาสีเขียวสบายตา ดูแล้วใจฟูมากกก บันทึกเก็บไว้เป็นไอเดียแต่งห้องกันเลย!`,
    hashtags: [
      '#แต่งห้องมินิมอล',
      '#รีโนเวทห้อง',
      '#JapandiStyle',
      '#LoftStyle',
      '#MakeoverTimelapse',
      '#GoogleFlow',
      '#Veo3AI',
    ],
  };

  return {
    id: `director-${Date.now()}`,
    timestamp: Date.now(),
    location: {
      nameTh: location.nameTh,
      nameEn: location.nameEn,
      category: location.category,
      keyElements: location.keyElementsTh,
      customDetails: cleanedNotes,
    },
    style: {
      id: style.id,
      nameTh: style.nameTh,
      nameEn: style.nameEn,
      palette: style.colorPalette,
    },
    condition: {
      id: condition.id,
      nameTh: condition.nameTh,
      nameEn: condition.nameEn,
      description: condition.descriptionTh,
    },
    selectedMode: mode,
    conceptOverview: {
      overallStyle: `${style.nameTh} (${style.nameEn}) ผสมผสานความดิบเท่ของลอฟท์เข้ากับความอบอุ่นละมุนของมินิมอลและเจแปนดิ`,
      cozyAtmosphere: 'เน้นแสงไฟโทนอุ่น (Warm Amber 2700K) ตัดกับแสงธรรมชาติสีเขียวสดใสของวิวทุ่งนาภายนอกหน้าต่างกระจกบานใหญ่',
      texturesWallFloor: `ผนังปูนเปลือยไมโครซีเมนต์ขัดมัน (${wallSpec}) คู่กับพื้นไม้ลามิเนตสีโอ๊คอ่อนลายก้างปลา (${floorSpec})`,
      characterStyling: 'ตัวละครหญิงเอเชียสวมชุดเอิร์ธโทนสีเบจทราย (Linen Sand Jumpsuit) เสื้อผ้าชุดเดิมตลอดทั้งคลิป แสดงการกระทำสมจริงเป็นขั้นเป็นตอน',
      audioDesign: 'เสียง ASMR คมชัดทุกการกระทำ ตั้งแต่เสียงกวาดฝุ่น ฉาบปูน ปูพื้นไม้ลั่นคลิก วางแก้วกาแฟ จนถึงเสียงคลิกเปิดสวิตช์ไฟส้ม',
    },
    mode1Output: {
      scene1: {
        title: 'Scene 1: The Raw & Structural Foundation (วินาทีที่ 0-10)',
        timeRange: '[0-10s] Duration: 10 seconds | Aspect: 9:16',
        prompt: mode1Scene1Prompt,
        negativePrompt: MANDATORY_NEGATIVE_PROMPT,
        audioASMRTarget:
          'Veo3 Audio AI Target: ASMR concrete sweeping, metallic trowel scraping on wet micro-cement, rhythmic wood plank interlocking snaps, soft breeze through window.',
      },
      scene2: {
        title: 'Scene 2: The Styling & Final Reveal (วินาทีที่ 10-20)',
        timeRange: '[10-20s] Duration: 10 seconds | Aspect: 9:16',
        prompt: mode1Scene2Prompt,
        negativePrompt: MANDATORY_NEGATIVE_PROMPT,
        audioASMRTarget:
          'Veo3 Audio AI Target: Heavy wool rug thud, sliding wood drawer, ceramic cup clink, snappy metallic lamp toggle switch click, warm ambient room resonance.',
        continuityWarning:
          '⚠️ บังคับเปิดฟีเจอร์ "Use last frame" จากวินาทีที่ 10 ของซีนแรกก่อนสั่งรันซีนที่ 2 เพื่อล็อกตำแหน่งห้องและโครงสร้างหน้าต่างไม่ให้บิดเบี้ยว',
      },
    },
    mode2Output: {
      shots: mode2Shots,
    },
    mode3Output: {
      scene1: {
        title: '🎬 Scene 1: The Foundation & Build (ความยาว 10 วินาที / ฉาก 1-10)',
        duration: '10 วินาที (0:00 - 0:10)',
        steps: mode3Scene1Steps,
        fullPrompt: mode3Scene1FullPrompt,
        negativePrompt: MANDATORY_NEGATIVE_PROMPT,
        audioASMRTarget:
          'Veo3 Audio AI Target: High-fidelity tactile ASMR (broom sweep, wet trowel, interlocking wood clicks, cordless drill hum, clean microfiber mop swipe).',
      },
      scene2: {
        title: '🎬 Scene 2: The Styling & Final Reveal (ความยาว 10 วินาที / ฉาก 11-20)',
        duration: '10 วินาที (0:10 - 0:20)',
        continuityNotice:
          '⚠️ บังคับผู้ใช้เปิดฟีเจอร์ "Use last frame" จากวินาทีที่ 10 ของซีนแรกก่อนสั่งรัน เพื่อล็อกตำแหน่งห้อง หน้าต่าง และวิวทุ่งนา',
        steps: mode3Scene2Steps,
        fullPrompt: mode3Scene2FullPrompt,
        negativePrompt: MANDATORY_NEGATIVE_PROMPT,
        audioASMRTarget:
          'Veo3 Audio AI Target: Fabric rustle, furniture glide, ceramic clink, tactile mechanical toggle click, volumetric warm lighting bloom, lo-fi acoustic fade-out.',
      },
    },
    workflowInGoogleFlow: {
      steps: [
        {
          stepNumber: 1,
          title: 'ตั้งค่าโมเดลและโปรเจกต์ใน Google Flow',
          instruction:
            'เลือกโมเดล Veo3 หรือ Veo3-Quality ปรับสัดส่วนวิดีโอเป็น 9:16 (Portrait) และกำหนดความยาวคลิปเป็น 10 วินาทีต่อหนึ่งการเจนเนอเรต',
          toolSettings: 'Model: Veo3-Quality | Ratio: 9:16 | Duration: 10s | Audio Generation: Enabled (ASMR Focus)',
        },
        {
          stepNumber: 2,
          title: 'รันซีนแรก (Scene 1: The Foundation & Build)',
          instruction:
            'คัดลอกพรอมต์หลักของ Scene 1 และวางข้อความ Negative Prompt ในช่อง Negative Prompt ของระบบ จากนั้นกด Generate รอจนคลิปแรกประมวลผลเสร็จสมบูรณ์',
          toolSettings: 'Prompt: Scene 1 Prompt | Negative Prompt: Mandatory Safety Filter',
        },
        {
          stepNumber: 3,
          title: 'ล็อกความต่อเนื่องด้วย "Use last frame" (กฎเหล็ก)',
          instruction:
            'ก่อนสั่งรันซีนที่ 2 ให้เปิดฟังก์ชัน "Use last frame" หรือคลิกเลือกเฟรมสุดท้ายที่วินาที 10:00 ของ Scene 1 เพื่อใช้เป็นภาพตั้งต้นของ Scene 2 ป้องกันไม่ให้ห้อง หน้าต่าง และวิวทุ่งนาบิดเบี้ยว',
          toolSettings: 'Feature: Use Last Frame (Frame at 10.0s) -> Active',
          criticalCallout: '⚠️ คำเตือนสำคัญ: ห้ามกดสร้าง Scene 2 โดยไม่เปิด Use last frame เด็ดขาด!',
        },
        {
          stepNumber: 4,
          title: 'อัปโหลดรูปภาพอ้างอิงเฟอร์นิเจอร์ (Reference Image Focus)',
          instruction:
            'หากมีภาพถ่ายเฟอร์นิเจอร์ โต๊ะ โคมไฟ หรือของตกแต่งจริง ให้อัปโหลดเข้าช่อง Reference Image ของ Veo3 เพื่อให้โมเดลโฟกัสดีเทลเนื้อไม้ โครงสร้าง และแสงเงาตามรูปถ่ายจริงในช่วง Close-up ท้ายคลิป',
          toolSettings: 'Reference Input: Asset Reference (Desk, Lamp, Decor) | Weight: High',
        },
      ],
    },
    editingAndEngagementTips: {
      beatSyncTricks:
        'ตัดต่อต่อชน Scene 1 และ Scene 2 ให้ลงจังหวะบีทเพลงแนว Chillhop / Lo-Fi หรือใช้เฉพาะเสียง ASMR แท้ๆ ในช่วง 0-18 วินาที แล้วให้ดนตรีอบอุ่นค่อยๆ ดังขึ้นพร้อมจังหวะเปิดสวิตช์ไฟส้ม',
      lightingContrastTricks:
        'ขับเน้นคอนทราสต์ของแสงธรรมชาติภายนอกหน้าต่างบานใหญ่ (วิวทุ่งนาสีเขียว) ตัดกับแสงส้มโทนอุ่น 2700K ภายในห้องเพื่อสร้างมิติความลึกที่สะกดสายตาผู้ชมตั้งแต่ 3 วินาทีแรก',
      retentionTricks:
        'สปีดคลิปช่วงฉาบปูนและปูพื้นให้เร็วแบบ Satisfying Speed (2x-3x) เพื่อกระตุ้นโดปามีนคนดู แล้วชะลอความเร็วกลับเป็น Normal Speed (1x) ใน 2 วินาทีสุดท้ายเพื่อความฟิน',
    },
    thaiSocialCaptions: thaiCaptions,
    referenceImages: allImages,
    referenceImageName: allImages[0]?.name || referenceImageName,
    referenceImagePreview: allImages[0]?.previewUrl || referenceImagePreview,
    storyboardPrompts: buildStoryboardPrompts({
      location,
      style,
      condition,
      mode,
      referenceImages: allImages,
    }),
  };
}
