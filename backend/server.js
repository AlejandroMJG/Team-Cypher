import { createServer } from "node:http";

const PORT = 3000;
const API_URL = "https://hackathon-1pvb.onrender.com/api/ai-model/v2/chat";
const API_KEY = process.env.TEAM_CYPHER_API_KEY || "sk_d0d6d796cd96074d0bc2743cba611e406dd09664";

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  });
  res.end(JSON.stringify(data));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });

    req.on("error", reject);
  });
}

async function handleFlashcards(req, res) {
  try {
    const body = await readJson(req);
    const prompt = body.prompt;

    if (!prompt || typeof prompt !== "string") {
      return sendJson(res, 400, { error: "Missing prompt" });
    }

    const aiResponse = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-key": API_KEY
      },
      body: JSON.stringify({ context: prompt })
    });

    const data = await aiResponse.json();

    if (!aiResponse.ok) {
      return sendJson(res, aiResponse.status, {
        error: "AI request failed",
        details: data
      });
    }

    return sendJson(res, 200, data);
  } catch (error) {
    console.error("Proxy error:", error);
    return sendJson(res, 500, { error: "AI proxy failed" });
  }
}

const server = createServer((req, res) => {
  if (req.method === "OPTIONS") {
    return sendJson(res, 204, {});
  }

  if (req.method === "GET" && req.url === "/") {
    return sendJson(res, 200, { status: "Team Cipher backend is running" });
  }

  if (req.method === "POST" && req.url === "/flashcards") {
    return handleFlashcards(req, res);
  }

  return sendJson(res, 404, { error: "Not found" });
});

server.listen(PORT, () => {
  console.log(`Proxy running on http://localhost:${PORT}`);
});
