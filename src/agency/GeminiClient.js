/**
 * Gemini API client with deterministic mock fallback for local prototyping
 */

let GoogleGenerativeAI;

try {
  ({ GoogleGenerativeAI } = require('@google/generative-ai'));
} catch {
  GoogleGenerativeAI = null;
}

const DEFAULT_MODEL = 'gemini-2.0-flash';

class GeminiClient {
  constructor(options = {}) {
    this.apiKey = options.apiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    this.modelName = options.model || process.env.GEMINI_MODEL || DEFAULT_MODEL;
    this.mockMode = options.mockMode ?? !this.apiKey;
    this.model = null;

    if (!this.mockMode && GoogleGenerativeAI) {
      const genAI = new GoogleGenerativeAI(this.apiKey);
      this.model = genAI.getGenerativeModel({ model: this.modelName });
    } else if (!this.mockMode && !GoogleGenerativeAI) {
      console.warn('⚠️ @google/generative-ai not installed — running agency in mock mode');
      this.mockMode = true;
    }
  }

  isMockMode() {
    return this.mockMode;
  }

  async generateJSON({ systemPrompt, userPrompt, mockFactory }) {
    if (this.mockMode) {
      await delay(400 + Math.random() * 600);
      return mockFactory();
    }

    const prompt = `${systemPrompt}\n\n---\n\nUSER INPUT:\n${userPrompt}\n\nRemember: respond with valid JSON only.`;

    const result = await this.model.generateContent(prompt);
    const text = result.response.text();
    return parseJSONResponse(text);
  }
}

function parseJSONResponse(text) {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1].trim() : trimmed;
  return JSON.parse(candidate);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = GeminiClient;
