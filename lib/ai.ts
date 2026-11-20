import { GoogleGenAI } from "@google/genai";

const gemini = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
});

export async function generateAIResponse(
    prompt: string,
    systemInstruction = "You are a helpful AI assistant."
): Promise<string> {
    // 1. Primary: Gemini 2.5 Flash
    if (process.env.GEMINI_API_KEY) {
        try {
            const response = await gemini.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    systemInstruction,
                },
            });

            if (response.text) {
                return response.text;
            }
        } catch (err) {
            console.warn("Gemini failed, switching to Groq fallback:", err);
        }
    }

    // 2. Auto-Fallback: Groq (Llama 3.3 70B)
    if (process.env.GROQ_API_KEY) {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: systemInstruction },
                    { role: "user", content: prompt },
                ],
            }),
        });

        if (res.ok) {
            const data = await res.json();
            const text = data.choices?.[0]?.message?.content;
            if (text) return text;
        }
    }

    throw new Error("Both Gemini and Groq API calls failed. Check API keys.");
}