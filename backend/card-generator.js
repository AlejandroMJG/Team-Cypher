import { askAI } from "./ai/ai-client.js";
import { buildFlashcardPrompt } from "./ai/prompt-builder.js";

export async function generateCardsAI(text) {
  const prompt = buildFlashcardPrompt(text);
  const result = await askAI(prompt);
  const raw = result.prompt || result.response || result.message || result.content || result;

  if (Array.isArray(raw)) {
    return raw;
  }

  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to parse AI JSON:", raw);
    return [];
  }
}
