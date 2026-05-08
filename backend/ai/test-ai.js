import { askAI } from "./ai-client.js";

askAI("Generate 1 flashcard about JavaScript").then(result => {
    console.log("AI response:", result);
});