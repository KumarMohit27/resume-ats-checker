import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { extractText, getDocumentProxy } from "unpdf";
import mammoth from "mammoth";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("resume") as File | null;
    const careerField =
      (formData.get("careerField") as string) || "Software Developer";
    const jobDescription =
      (formData.get("jobDescription") as string) || "";

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: "No resume file uploaded.",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // 1. EXTRACT RESUME TEXT
    // ==========================================

    const buffer = Buffer.from(await file.arrayBuffer());

    let resumeText = "";

    // PDF
    if (
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf")
    ) {
      const pdf = await getDocumentProxy(new Uint8Array(buffer));

      const result = await extractText(pdf, {
        mergePages: true,
      });

      resumeText = result.text;
    }

    // DOCX
    else if (
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.name.toLowerCase().endsWith(".docx")
    ) {
      const result = await mammoth.extractRawText({
        buffer,
      });

      resumeText = result.value;
    }

    else {
      return NextResponse.json(
        {
          success: false,
          error: "Only PDF and DOCX files are supported.",
        },
        { status: 400 }
      );
    }

    if (!resumeText.trim()) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Could not extract text from this resume.",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // 2. CHECK GEMINI API KEY
    // ==========================================

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "GEMINI_API_KEY was not found.",
        },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey,
    });

    // ==========================================
    // 3. PREPARE AI PROMPT
    // ==========================================

    const prompt = `
You are an expert ATS resume evaluator and professional career coach.

Analyze the candidate's resume carefully.

Candidate career field:
${careerField}

Job description:
${jobDescription || "No job description was provided."}

Resume:
--------------------
${resumeText}
--------------------

Your job is to evaluate the resume for:

1. Overall resume quality
2. Relevance to the selected career field
3. Relevance to the provided job description
4. Important skills already present
5. Important skills missing from the resume
6. Weak resume content
7. Strong resume content
8. Experience quality
9. Project quality and relevance
10. Achievement/quantification quality
11. Resume summary quality
12. Actionable improvement suggestions

IMPORTANT RULES:

- Never invent experience or skills that are not present.
- Do not tell the candidate to add a skill unless it is relevant.
- If a skill is missing, say it is missing rather than assuming the candidate knows it.
- Suggestions should be realistic for a student or job seeker.
- Focus on improvements that can genuinely increase interview chances.
- Analyze the actual resume content rather than giving generic advice.
- Do not rewrite the entire resume.
- Keep suggestions concise and practical.

Return ONLY valid JSON.

Use exactly this structure:

{
  "overallAssessment": "short assessment",
  "resumeQualityScore": 0,
  "jobMatchScore": 0,
  "summaryQuality": {
    "score": 0,
    "feedback": "feedback"
  },
  "experienceQuality": {
    "score": 0,
    "feedback": "feedback"
  },
  "projectQuality": {
    "score": 0,
    "feedback": "feedback"
  },
  "achievementQuality": {
    "score": 0,
    "feedback": "feedback"
  },
  "matchedSkills": [],
  "missingSkills": [],
  "strongPoints": [],
  "weakPoints": [],
  "priorityImprovements": [],
  "bulletPointSuggestions": []
}

All scores must be between 0 and 100.

Return arrays as arrays of strings.
`;

    // ==========================================
    // 4. CALL GEMINI
    // ==========================================

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text?.trim();

    if (!responseText) {
      return NextResponse.json(
        {
          success: false,
          error: "Gemini returned an empty response.",
        },
        { status: 500 }
      );
    }

    // ==========================================
    // 5. CONVERT GEMINI RESPONSE TO JSON
    // ==========================================

    let aiAnalysis;

    try {
      aiAnalysis = JSON.parse(responseText);
    } catch (parseError) {
      console.error("GEMINI JSON PARSE ERROR:", parseError);
      console.error("GEMINI RESPONSE:", responseText);

      return NextResponse.json(
        {
          success: false,
          error: "Gemini returned an invalid JSON response.",
        },
        { status: 500 }
      );
    }

    // ==========================================
    // 6. RETURN AI ANALYSIS
    // ==========================================

    return NextResponse.json({
      success: true,
      fileName: file.name,
      careerField,
      aiAnalysis,
    });
  } catch (error) {
    console.error("AI RESUME ANALYSIS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Gemini AI analysis failed.",
      },
      { status: 500 }
    );
  }
}