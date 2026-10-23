import { GoogleUserProfile } from '../types/auth';

const STORAGE_KEY_API_KEY = 'custom_gemini_api_key_v1';
const STORAGE_KEY_GOOGLE_USER = 'google_user_session_v1';

export function getStoredApiKey(): string | null {
  try {
    const key = localStorage.getItem(STORAGE_KEY_API_KEY);
    return key && key.trim().length > 0 ? key.trim() : null;
  } catch {
    return null;
  }
}

export function setStoredApiKey(key: string): void {
  try {
    if (!key || key.trim().length === 0) {
      localStorage.removeItem(STORAGE_KEY_API_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY_API_KEY, key.trim());
    }
  } catch (e) {
    console.warn('LocalStorage error setting API key:', e);
  }
}

export function removeStoredApiKey(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_API_KEY);
  } catch (e) {
    console.warn('LocalStorage error removing API key:', e);
  }
}

export function getStoredGoogleUser(): GoogleUserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_GOOGLE_USER);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredGoogleUser(user: GoogleUserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY_GOOGLE_USER, JSON.stringify(user));
  } catch (e) {
    console.warn('LocalStorage error setting Google User:', e);
  }
}

export function removeStoredGoogleUser(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_GOOGLE_USER);
  } catch (e) {
    console.warn('LocalStorage error removing Google User:', e);
  }
}

export function getAuthHeaders(apiKeyOverride?: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const key = apiKeyOverride !== undefined ? apiKeyOverride : getStoredApiKey();
  if (key && key.trim().length > 0) {
    headers['x-gemini-api-key'] = key.trim();
  }
  return headers;
}

export async function validateApiKey(
  apiKeyCandidate?: string
): Promise<{ valid: boolean; latencyMs?: number; error?: string; model?: string }> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (apiKeyCandidate) {
      headers['x-gemini-api-key'] = apiKeyCandidate.trim();
    }

    const res = await fetch('/api/gemini/validate-key', {
      method: 'POST',
      headers,
      body: JSON.stringify({ apiKey: apiKeyCandidate || '' }),
    });

    const data = await res.json();
    if (!res.ok || !data.valid) {
      return {
        valid: false,
        error: data.error || 'การเชื่อมต่อ API ล้มเหลว',
      };
    }

    return {
      valid: true,
      latencyMs: data.latencyMs,
      model: data.model,
    };
  } catch (err: any) {
    return {
      valid: false,
      error: err.message || 'ไม่สามารถติดต่อเซิร์ฟเวอร์เพื่อตรวจสอบ API Key ได้',
    };
  }
}
