const API_URL = "https://hackathon-1pvb.onrender.com/api/ai-model/v2/chat";
const API_KEY = "YOUR_API_KEY_HERE"; // replace with your key

export async function askAI(prompt) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-key": API_KEY
    },
    body: JSON.stringify({
      context: prompt
    })
  });

  if (!response.ok) {
    throw new Error("AI request failed: " + response.status);
  }

  const data = await response.json();
  return data;
}