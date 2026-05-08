export function buildFlashcardPrompt(text, type) {
  return `
You are an AI that generates flashcards.

Flashcard type: ${type}

Source text:
${text}

Your task:
- Extract the most important concepts.
- Generate flashcards based on the flashcard type.
- DO NOT include reasoning, markdown, or explanations.
- DO NOT include backticks.
- DO NOT include any text outside the JSON.

Return ONLY valid JSON in this exact format:

[
  {
    "question": "string",
    "answer": "string"
  }
]

If you cannot generate flashcards, return an empty JSON array: [].
  `;
}