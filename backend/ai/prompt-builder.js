export function buildFlashcardPrompt(text) {
  return `
You are an AI that generates one flashcard.

Source text or question:
${text}

Your task:
- Create exactly one flashcard.
- If the source is a question, answer it clearly.
- If the source is notes or a topic, turn the main idea into a question and answer.
- Do not include reasoning, markdown, backticks, or extra text.

Return ONLY valid JSON in this exact format:

[
  {
    "question": "string",
    "answer": "string"
  }
]

If you cannot generate a flashcard, return an empty JSON array: [].
  `;
}
