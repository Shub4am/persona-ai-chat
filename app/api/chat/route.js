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

        let res =
            response?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Sorry, reply to nahi de sakta abhi";

        const codeRequestRegex = /(code|program|script|function|example).*\b(in (javascript|js|python|py|java|c\+\+|c#|typescript|ts|go|rust|php|ruby|swift|kotlin|dart))|write (a|the)? code|show (me )?code|how to.*code/i;
        const userMessage = messages[messages.length - 1]?.content || "";
        if (codeRequestRegex.test(userMessage)) {
            const codeBlocks = [];
            let explanation = res;
            const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
            let match;
            let lastIndex = 0;
            let explanationParts = [];
            while ((match = codeBlockRegex.exec(res)) !== null) {
                if (match.index > lastIndex) {
                    explanationParts.push(res.slice(lastIndex, match.index));
                }
                codeBlocks.push({
                    lang: match[1] || "",
                    code: match[2].trim()
                });
                lastIndex = codeBlockRegex.lastIndex;
            }
            if (lastIndex < res.length) {
                explanationParts.push(res.slice(lastIndex));
            }
            explanation = explanationParts.join("\n").replace(/\n{3,}/g, "\n\n").trim();
            let formatted = explanation;
            if (codeBlocks.length > 0) {
                formatted += "\n\n" + codeBlocks.map(cb => `\u0060\u0060\u0060${cb.lang}\n${cb.code}\n\u0060\u0060\u0060`).join("\n\n");
            }
            res = formatted.trim();
        }

        return NextResponse.json({ reply: res });

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