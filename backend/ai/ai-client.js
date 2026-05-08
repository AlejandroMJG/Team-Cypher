const API_URL = "http://localhost:3000/flashcards";

export async function askAI(prompt) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ prompt })
  });

  if (!response.ok) {
    throw new Error(`AI request failed: ${response.status}`);
  }

  return await response.json();
}
