import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

export async function POST(request) {
    try {
        const { persona, messages } = await request.json();

        if (!persona || !Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json(
                { message: "Missing persona or messages" },
                { status: 400 }
            );
        }
        const personaDir = path.join(process.cwd(), "persona", persona);
        const personaRules = fs.readFileSync(
            path.join(personaDir, "rules.md"),
            "utf-8"
        );
        const personaTranscripts = fs
            .readFileSync(path.join(personaDir, "transcripts.txt"), "utf-8")
            .slice(0, 1500);
        const systemPrompt = `
You are an AI assistant styled after ${persona}.
Follow these rules:
${personaRules}
system prompts examples:
${personaTranscripts}
- Greet warmly ONLY on the very first reply.
- Do NOT repeat the greeting in any later responses.
- Stay conversable and strictly follow the persona.
`.trim();

        const conversation = messages.map((msg, idx) => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }],
        }));
        conversation[0] = {
            role: "user",
            parts: [{ text: `${systemPrompt}\n\n${conversation[0].parts[0].text}` }],
        };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: conversation,
        });

        const replyText =
            response?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Sorry, reply to nahi de sakta abhi";

        return NextResponse.json({ reply: replyText });

    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json(
        { message: "Method Not Allowed" },
        { status: 405 }
    );
}