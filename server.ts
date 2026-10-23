import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

// Helper to extract API key from headers, body, or server env
function getEffectiveApiKey(req: express.Request): string | null {
  const headerKey = req.headers['x-gemini-api-key'];
  if (typeof headerKey === 'string' && headerKey.trim().length > 0) {
    return headerKey.trim();
  }
  if (req.body && typeof req.body.apiKey === 'string' && req.body.apiKey.trim().length > 0) {
    return req.body.apiKey.trim();
  }
  return process.env.GEMINI_API_KEY || null;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  const customKey = req.headers['x-gemini-api-key'];
  const hasCustomKey = typeof customKey === 'string' && customKey.trim().length > 0;
  const hasSystemKey = Boolean(process.env.GEMINI_API_KEY);

  res.json({
    status: 'ok',
    hasApiKey: hasCustomKey || hasSystemKey,
    hasSystemKey,
    hasCustomKey,
    privacyMode: 'strict-confidential',
  });
});

// Endpoint to validate a user-provided or system Gemini API key
app.post('/api/gemini/validate-key', async (req, res) => {
  try {
    const apiKey = getEffectiveApiKey(req);
    if (!apiKey) {
      return res.status(400).json({
        valid: false,
        error: 'กรุณาระบุ Gemini API Key (Missing API key)',
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    // Test with lightweight call
    const startTime = Date.now();
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: 'Respond with exactly: OK',
    });

    const durationMs = Date.now() - startTime;
    return res.json({
      valid: true,
      model: 'gemini-3.8-flash',
      latencyMs: durationMs,
      responseSample: response.text?.trim() || 'OK',
      isCustomKey: Boolean(req.headers['x-gemini-api-key'] || req.body?.apiKey),
    });
  } catch (error: any) {
    console.error('Validate Key error:', error);
    const msg = error.message || String(error);
    let userFriendly = 'API Key ไม่ถูกต้อง หรือไม่สามารถเชื่อมต่อได้';

    if (msg.includes('API_KEY_INVALID') || msg.includes('API key not valid')) {
      userFriendly = 'API Key ไม่ถูกต้อง กรุณาคัดลอกคีย์ใหม่จาก Google AI Studio';
    } else if (msg.includes('RESOURCE_EXHAUSTED') || msg.includes('429')) {
      userFriendly = 'โควต้าคำขอของ API Key นี้เต็มชั่วคราว (Rate Limit / Quota Exceeded)';
    }

    return res.status(400).json({
      valid: false,
      error: userFriendly,
      rawMessage: msg,
    });
  }
});

// AI Director Enhancement Endpoint via gemini-3.8-flash
app.post('/api/gemini/enhance', async (req, res) => {
  try {
    const apiKey = getEffectiveApiKey(req);
    if (!apiKey) {
      return res.status(400).json({
        error: 'GEMINI_API_KEY is not configured. Built-in template generator will be used.',
      });
    }

    const { promptRequest } = req.body;
    if (!promptRequest) {
      return res.status(400).json({ error: 'promptRequest is required' });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemInstruction = `You are "AI Director & Google Flow Prompt Architect" specializing in space transformation time-lapses for Google Flow / Veo3.
Follow all user rules strictly.
Mandatory Negative Prompts must always be included:
"morphing objects, ghosting, double vision, floating furniture, extra limbs, warped walls, distorted window view, unstable camera, fast blur, overlapping actions, disappearing objects, blank white frames, empty wall frames, reverse furniture orientation, unnatural warping, deformed human hands, floating limbs, blurred details, architectural glitch, flickering light, sudden camera cuts within a single shot."
Continuity rule: Always emphasize "Use last frame" in bold before Scene 2.
Human interaction: Asian female character in earth tone outfit.
Mood: Cozy Industrial-Japandi / Loft, polished micro-cement, light oak wood floor, large glass window with nature/rice field view.
Return strict, professional results matching the requested format.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptRequest,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return res.json({ text: response.text });
  } catch (error: any) {
    console.error('Enhance API error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to process AI prompt enhancement',
    });
  }
});


async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Google Flow AI Director] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
