export type LocationCategory = 'interior_living' | 'interior_utility' | 'exterior_outdoor' | 'custom';

export interface LocationItem {
  id: string;
  category: LocationCategory;
  nameTh: string;
  nameEn: string;
  icon: string;
  keyElementsTh: string[];
  keyElementsEn: string[];
  description: string;
}

export type DesignStyleId = 'loft' | 'minimalist' | 'japandi' | 'cozy_industrial_japandi' | 'custom';

export interface DesignStyle {
  id: DesignStyleId;
  nameTh: string;
  nameEn: string;
  descriptionTh: string;
  descriptionEn: string;
  wallTexture: string;
  floorTexture: string;
  woodTone: string;
  colorPalette: string[];
  tagline: string;
}

export type RoomConditionId = 'empty' | 'cluttered' | 'under_construction' | 'custom';

export interface RoomCondition {
  id: RoomConditionId;
  nameTh: string;
  nameEn: string;
  descriptionTh: string;
  descriptionEn: string;
  promptPhrase: string;
}

export type PromptModeId = 1 | 2 | 3;

export interface PromptMode {
  id: PromptModeId;
  titleTh: string;
  titleEn: string;
  tagline: string;
  durationText: string;
  descriptionTh: string;
  scenesCount: number;
}

export interface PromptScene {
  timeCode: string;
  phaseOrShot: string;
  shotType?: string;
  cameraMovement: string;
  actionEn: string;
  actionTh: string;
  materialsEn: string;
  promptText: string;
  negativePrompt: string;
  audioASMRTarget: string;
  audioCuesTh: string;
}

export interface GeneratedDirectorResponse {
  id: string;
  timestamp: number;
  location: {
    nameTh: string;
    nameEn: string;
    category: string;
    keyElements: string[];
    customDetails?: string;
  };
  style: {
    id: string;
    nameTh: string;
    nameEn: string;
    palette: string[];
  };
  condition: {
    id: string;
    nameTh: string;
    nameEn: string;
    description: string;
  };
  selectedMode: PromptModeId;
  conceptOverview: {
    overallStyle: string;
    cozyAtmosphere: string;
    texturesWallFloor: string;
    characterStyling: string;
    audioDesign: string;
  };
  mode1Output?: {
    scene1: {
      title: string;
      timeRange: string;
      prompt: string;
      negativePrompt: string;
      audioASMRTarget: string;
    };
    scene2: {
      title: string;
      timeRange: string;
      prompt: string;
      negativePrompt: string;
      audioASMRTarget: string;
      continuityWarning: string;
    };
  };
  mode2Output?: {
    shots: Array<{
      shotNumber: number;
      timeRange: string;
      shotName: string;
      cameraType: string;
      prompt: string;
      negativePrompt: string;
      audioASMRTarget: string;
    }>;
  };
  mode3Output?: {
    scene1: {
      title: string;
      duration: string;
      steps: Array<{
        timeCode: string;
        sceneNumber: number;
        titleTh: string;
        actionEn: string;
        asmrCue: string;
        camera: string;
      }>;
      fullPrompt: string;
      negativePrompt: string;
      audioASMRTarget: string;
    };
    scene2: {
      title: string;
      duration: string;
      continuityNotice: string;
      steps: Array<{
        timeCode: string;
        sceneNumber: number;
        titleTh: string;
        actionEn: string;
        asmrCue: string;
        camera: string;
      }>;
      fullPrompt: string;
      negativePrompt: string;
      audioASMRTarget: string;
    };
  };
  workflowInGoogleFlow: {
    steps: Array<{
      stepNumber: number;
      title: string;
      instruction: string;
      toolSettings: string;
      criticalCallout?: string;
    }>;
  };
  editingAndEngagementTips: {
    beatSyncTricks: string;
    lightingContrastTricks: string;
    retentionTricks: string;
  };
  thaiSocialCaptions: {
    hook: string;
    caption: string;
    hashtags: string[];
  };
  referenceImageName?: string;
  referenceImagePreview?: string;
  referenceImages?: ReferenceImageItem[];
  storyboardFrames?: StoryboardKeyframe[];
  storyboardPrompts?: StoryboardPromptsGroup;
}

export interface StoryboardSubPhase {
  subIndex?: string | number;
  labelTh: string;
  labelEn: string;
  timeCode: string;
  camera: string;
  action: string;
  asmrTarget: string;
}

export interface StoryboardImagePromptItem {
  id: string;
  imageIndex: number;
  titleTh: string;
  titleEn: string;
  timeCodeRange: string;
  subPhases: StoryboardSubPhase[];
  cameraDirection: string;
  motionCommand: string;
  asmrTarget: string;
  isContinuityAnchor?: boolean;
  continuityNotice?: string;
  imagePrompt9x16: string;
  negativePrompt: string;
  aspectRatio: '9:16';
  recommendedModel: string;
}

export interface ModeStoryboardData {
  mode: PromptModeId;
  modeTitleTh: string;
  descriptionTh: string;
  totalImagesCount: number;
  items: StoryboardImagePromptItem[];
}

export interface StoryboardPromptsGroup {
  mode1: ModeStoryboardData;
  mode2: ModeStoryboardData;
  mode3: ModeStoryboardData;
  currentMode: ModeStoryboardData;
}

export interface ReferenceImageItem {
  id: string;
  name: string;
  previewUrl: string;
  size?: number;
  label?: string;
  uploadedAt?: number;
}

export interface StoryboardKeyframe {
  id: string;
  sceneOrShotIndex: number;
  timeCode: string;
  titleTh: string;
  titleEn: string;
  camera: string;
  actionEn: string;
  actionTh: string;
  materialsEn: string;
  asmrCue: string;
  isContinuityAnchor?: boolean;
  imagePrompt: string;
  imageUrl?: string;
  isLoading?: boolean;
}

export interface SecurityPrivacySettings {
  autoScrubSensitiveData: boolean;
  encryptLocalStorage: boolean;
  zeroExternalTelemetry: boolean;
  wipeAfterSession: boolean;
}
