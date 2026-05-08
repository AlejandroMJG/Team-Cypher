const sourceText = document.getElementById("sourceText");
const cardCount = document.getElementById("cardCount");
const difficulty = document.getElementById("difficulty");
const generateBtn = document.getElementById("generateBtn");
const statusMessage = document.getElementById("status");

const API_URL = "http://localhost:3000/flashcards";

function buildFlashcardPrompt(text, count, level, cardNumber, existingQuestions) {
  return `
You are an AI that generates one flashcard.

Source text or question:
${text}

Flashcard ${cardNumber} of ${count}
Difficulty level: ${level}
Already created questions:
${existingQuestions.length > 0 ? existingQuestions.map((question) => `- ${question}`).join("\n") : "- none"}

Your task:
- Create exactly one new flashcard.
- Match the difficulty level:
  - easy: simple wording, direct answers, beginner friendly.
  - medium: clear study questions with useful details.
  - hard: more challenging questions that test deeper understanding.
- Keep every question under 14 words.
- Keep every answer under 18 words.
- Do not repeat any already created question.
- If the source is a question, answer it clearly and create related study cards.
- If the source is notes or a topic, extract the most important ideas.
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

function parseCompleteObjects(jsonText) {
  const cards = [];
  let depth = 0;
  let start = -1;
  let inString = false;
  let escaped = false;

  for (let i = 0; i < jsonText.length; i += 1) {
    const char = jsonText[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === "\\") {
      escaped = true;
      continue;
    }

    if (char === "\"") {
      inString = !inString;
      continue;
    }

    if (inString) {
      continue;
    }

    if (char === "{") {
      if (depth === 0) {
        start = i;
      }
      depth += 1;
    }

    if (char === "}") {
      depth -= 1;

      if (depth === 0 && start !== -1) {
        try {
          const card = JSON.parse(jsonText.slice(start, i + 1));

          if (card.question && card.answer) {
            cards.push(card);
          }
        } catch {
          // Skip incomplete or malformed objects and keep any valid cards.
        }
        start = -1;
      }
    }
  }

  return cards;
}

function parseFlashcards(data) {
  const raw = data.cards || data.flashcards || data.prompt || data.response || data.message || data.content || data;

  if (Array.isArray(raw)) {
    return raw;
  }

  if (typeof raw === "string") {
    const jsonText = raw
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .replace(/<reasoning>[\s\S]*?<\/reasoning>/gi, "")
      .trim();

    try {
      return JSON.parse(jsonText);
    } catch {
      const start = jsonText.indexOf("[");
      const end = jsonText.lastIndexOf("]");

      if (start !== -1 && end !== -1 && end > start) {
        return JSON.parse(jsonText.slice(start, end + 1));
      }

      return parseCompleteObjects(jsonText);
    }
  }

  return [];
}

async function requestFlashcard(text, count, level, cardNumber, existingQuestions) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      prompt: buildFlashcardPrompt(text, count, level, cardNumber, existingQuestions)
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "AI request failed");
  }

  const cards = parseFlashcards(data).filter((card) => card.question && card.answer);

  if (cards.length === 0) {
    throw new Error(`AI did not return card ${cardNumber}.`);
  }

  return cards[0];
}

generateBtn.addEventListener("click", async () => {
  const text = sourceText.value.trim();
  const count = Number(cardCount.value);
  const level = difficulty.value;

  if (!text) {
    statusMessage.textContent = "Enter a topic or notes before generating flashcards.";
    sourceText.focus();
    return;
  }

  generateBtn.disabled = true;
  statusMessage.textContent = "Generating with AI...";

  try {
    const cards = [];

    for (let index = 1; index <= count; index += 1) {
      statusMessage.textContent = `Generating card ${index} of ${count}...`;
      const card = await requestFlashcard(
        text,
        count,
        level,
        index,
        cards.map((item) => item.question)
      );
      cards.push(card);
    }

    localStorage.setItem("teamCipherFlashcards", JSON.stringify(cards));
    statusMessage.textContent = "Flashcards generated. Opening review mode...";

    window.setTimeout(() => {
      window.location.href = "./viewer.html";
    }, 500);
  } catch (error) {
    statusMessage.textContent = `Could not generate flashcard: ${error.message}`;
    generateBtn.disabled = false;
  }
});
