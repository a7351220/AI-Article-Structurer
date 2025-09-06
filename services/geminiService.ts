import { GoogleGenAI, Type } from "@google/genai";
import { Paragraph } from "../types";

// Fix: Initialize GoogleGenAI with a named apiKey parameter.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        title: {
          type: Type.STRING,
          description: "A concise title for the paragraph.",
        },
        explanation: {
          type: Type.STRING,
          description: "A brief, one-sentence explanation of this paragraph's purpose or focus.",
        },
        content: {
          type: Type.STRING,
          description: "The full, rewritten content for this paragraph.",
        },
      },
      required: ["title", "explanation", "content"],
    },
};


export const generateArticle = async (text: string, structurePrompt: string, wordCount: number, language: string): Promise<Omit<Paragraph, 'id'>[]> => {
    if (!text.trim()) {
        // Return a default structure if there is no input text
        const defaultStructure = [
            { title: "Introduction", content: "", explanation: "Introduce the main topic and grab the reader's attention." },
            { title: "Development", content: "", explanation: "Elaborate on the main points, providing details and evidence." },
            { title: "Conclusion", content: "", explanation: "Summarize the key points and provide a concluding thought." },
        ];
        return defaultStructure;
    }
    
    const prompt = `
        Original Text:
        ---
        ${text}
        ---

        Instructions:
        1. Content: Use the Original Text as the primary source of information.
        2. Structure: ${structurePrompt}
        3. Language: The entire output must be in ${language}.
        4. Length: The total length of the article should be approximately ${wordCount} words.

        Rewrite the original text following all instructions.
        The output must be structured as an array of paragraphs, each with a title, a one-sentence explanation of its purpose, and the rewritten content.
        Do not include any introductory or concluding remarks outside of the JSON structure.
    `;

    // Fix: Use the correct model 'gemini-2.5-flash' and structure the generateContent call according to guidelines.
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
        },
    });

    // Fix: Correctly extract text from the response object.
    const jsonStr = response.text.trim();
    
    try {
        const result = JSON.parse(jsonStr);
        if (Array.isArray(result)) {
            return result;
        }
        console.error("Parsed JSON is not an array:", result);
        throw new Error("API did not return a valid array structure.");

    } catch (e) {
        console.error("Failed to parse Gemini response:", e);
        console.error("Raw response:", jsonStr);
        throw new Error("Failed to parse the structured article from the AI response.");
    }
};

export const summarizeText = async (text: string): Promise<string> => {
    if (!text.trim()) {
        return "Empty Content";
    }

    const prompt = `
        Summarize the following text into a short, descriptive title of no more than 10 words.
        This title will be used to label the text in a list.
        Do not add any introductory phrases like "This text is about..." or "Summary:".
        Just return the title.

        Text:
        ---
        ${text}
        ---
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    return response.text.trim();
}

export const modifyParagraph = async (content: string, modificationPrompt: string, language: string): Promise<string> => {
    if (!content.trim() || !modificationPrompt.trim()) {
        return content; // Return original content if either is empty
    }

    const prompt = `
        Original Paragraph Content:
        ---
        ${content}
        ---

        Instruction: ${modificationPrompt}
        Language: The rewritten paragraph must be in ${language}.

        Rewrite the paragraph based on the instruction and language requirement.
        Only return the rewritten paragraph content as a single block of text.
        Do not add any extra titles, explanations, or formatting.
        Do not use markdown.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    return response.text.trim();
};