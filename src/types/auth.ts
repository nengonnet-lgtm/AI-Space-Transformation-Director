export interface GoogleUserProfile {
  email: string;
  name: string;
  picture?: string;
  sub?: string;
  verified: boolean;
  signedInAt: string;
}

export interface ApiKeyStatus {
  hasSystemKey: boolean;
  hasCustomKey: boolean;
  activeKeySource: 'custom' | 'system' | 'none';
  isValidating: boolean;
  validationResult: {
    valid: boolean;
    latencyMs?: number;
    error?: string;
  } | null;
}
