import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const API_URL = "https://hackathon-1pvb.onrender.com/api/ai-model/v2/chat";
const API_KEY = "sk_d0d6d796cd96074d0bc2743cba611e406dd09664";

app.post("/flashcards", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-key": API_KEY
      },
      body: JSON.stringify({ context: prompt })
    });

    const data = await response.json();
    res.json(data);

  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "AI proxy failed" });
  }
});

app.listen(3000, () => console.log("Proxy running on http://localhost:3000"));