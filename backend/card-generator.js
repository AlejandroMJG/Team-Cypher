import { askAI } from "./ai/ai-client.js";
import { buildFlashcardPrompt } from "./ai/prompt-builder.js";

export async function generateCardsAI(text, type) {
  const prompt = buildFlashcardPrompt(text, type);
  const result = await askAI(prompt);

  const raw = result.prompt;

  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to parse AI JSON:", raw);
    return [];
  }
}