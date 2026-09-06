import { GoogleGenAI } from "@google/genai";

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return Response.json(
        {
          success: false,
          error: "GEMINI_API_KEY was not found.",
        },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: "Say hello to my ResumeScore project in one short sentence.",
    });

    return Response.json({
      success: true,
      message: response.text,
    });
  } catch (error) {
    console.error("Gemini API Error:", error);

    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}