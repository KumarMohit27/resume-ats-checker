import { NextResponse } from "next/server";
import { extractText, getDocumentProxy } from "unpdf";
import mammoth from "mammoth";

const careerSkills: Record<string, string[]> = {
  "Software Developer": [
    "c++",
    "java",
    "python",
    "javascript",
    "typescript",
    "data structures",
    "algorithms",
    "oops",
    "object oriented programming",
    "sql",
    "git",
    "github",
    "rest api",
    "api",
    "debugging",
    "problem solving",
  ],

  "AI / Machine Learning Engineer": [
    "python",
    "machine learning",
    "deep learning",
    "artificial intelligence",
    "tensorflow",
    "pytorch",
    "scikit-learn",
    "sklearn",
    "pandas",
    "numpy",
    "computer vision",
    "natural language processing",
    "nlp",
    "neural networks",
    "cnn",
    "transformer",
    "transformers",
    "sql",
    "data preprocessing",
    "model training",
    "model evaluation",
  ],

  "Data Scientist": [
    "python",
    "machine learning",
    "statistics",
    "pandas",
    "numpy",
    "scikit-learn",
    "sklearn",
    "sql",
    "data analysis",
    "data visualization",
    "matplotlib",
    "seaborn",
    "tensorflow",
    "pytorch",
    "deep learning",
    "feature engineering",
    "data preprocessing",
    "model evaluation",
  ],

  "Data Analyst": [
    "python",
    "sql",
    "excel",
    "power bi",
    "tableau",
    "pandas",
    "numpy",
    "data analysis",
    "data visualization",
    "statistics",
    "matplotlib",
    "seaborn",
    "dashboard",
    "reporting",
  ],

  "Web Developer": [
    "html",
    "css",
    "javascript",
    "typescript",
    "react",
    "next.js",
    "nextjs",
    "node.js",
    "nodejs",
    "express",
    "rest api",
    "api",
    "mongodb",
    "sql",
    "git",
    "github",
    "responsive design",
  ],

  "Cloud Engineer": [
    "aws",
    "azure",
    "google cloud",
    "gcp",
    "docker",
    "kubernetes",
    "linux",
    "terraform",
    "jenkins",
    "ci/cd",
    "devops",
    "cloud computing",
    "git",
    "github",
    "python",
    "networking",
  ],

  "Cybersecurity": [
    "cybersecurity",
    "network security",
    "information security",
    "ethical hacking",
    "penetration testing",
    "linux",
    "cryptography",
    "firewall",
    "siem",
    "vulnerability assessment",
    "incident response",
    "python",
    "networking",
    "owasp",
  ],
};

const actionVerbs = [
  "developed",
  "created",
  "built",
  "implemented",
  "designed",
  "analyzed",
  "optimized",
  "improved",
  "automated",
  "engineered",
  "trained",
  "deployed",
  "integrated",
  "tested",
  "managed",
  "led",
  "solved",
  "configured",
  "maintained",
  "achieved",
  "increased",
  "reduced",
  "generated",
];

const sectionPatterns: Record<string, RegExp[]> = {
  summary: [
    /\bsummary\b/i,
    /\bprofessional summary\b/i,
    /\bprofile\b/i,
    /\bobjective\b/i,
  ],

  skills: [
    /\bskills\b/i,
    /\btechnical skills\b/i,
    /\bcore skills\b/i,
    /\btechnologies\b/i,
  ],

  education: [
    /\beducation\b/i,
    /\bacademic background\b/i,
    /\bqualification\b/i,
  ],

  experience: [
    /\bexperience\b/i,
    /\bwork experience\b/i,
    /\bprofessional experience\b/i,
    /\binternship\b/i,
    /\binternships\b/i,
  ],

  projects: [
    /\bprojects\b/i,
    /\bacademic projects\b/i,
    /\bpersonal projects\b/i,
    /\bproject experience\b/i,
  ],

  certifications: [
    /\bcertifications\b/i,
    /\bcertificates\b/i,
    /\btraining\b/i,
  ],
};

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[•●▪◦]/g, " ")
    .trim();
}

function containsKeyword(text: string, keyword: string): boolean {
  const normalizedKeyword = keyword.toLowerCase();

  if (
    normalizedKeyword === "c++" ||
    normalizedKeyword === "c#" ||
    normalizedKeyword === "node.js" ||
    normalizedKeyword === "next.js"
  ) {
    return text.includes(normalizedKeyword);
  }

  return text.includes(normalizedKeyword);
}

function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}

function findSections(text: string): string[] {
  const found: string[] = [];

  for (const [section, patterns] of Object.entries(sectionPatterns)) {
    const exists = patterns.some((pattern) => pattern.test(text));

    if (exists) {
      found.push(section);
    }
  }

  return found;
}

function findActionVerbs(text: string): string[] {
  return actionVerbs.filter((verb) => {
    const regex = new RegExp(`\\b${verb}\\b`, "i");
    return regex.test(text);
  });
}

function hasQuantification(text: string): boolean {
  return (
    /\b\d+%/.test(text) ||
    /\b\d+\+/.test(text) ||
    /\b\d+\s*(users|projects|models|datasets|records|applications|clients)\b/i.test(
      text
    ) ||
    /\b(increased|reduced|improved|achieved|saved)\b.{0,40}\b\d+/i.test(
      text
    )
  );
}

function getRating(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 75) return "Very Good";
  if (score >= 65) return "Good";
  if (score >= 50) return "Needs Improvement";

  return "Weak";
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("resume") as File | null;

    const careerField =
      (formData.get("careerField") as string) ||
      "Software Developer";

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
    // EXTRACT RESUME TEXT
    // ==========================================

    const buffer = Buffer.from(await file.arrayBuffer());

    let resumeText = "";

    // PDF
    if (
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf")
    ) {
      const pdf = await getDocumentProxy(
        new Uint8Array(buffer)
      );

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
            "Could not extract text from this resume. Please upload a text-based PDF or DOCX file.",
        },
        { status: 400 }
      );
    }

    const text = normalizeText(resumeText);
    const wordCount = countWords(resumeText);

    // ==========================================
    // 1. CONTACT INFORMATION
    // ==========================================

    const hasEmail =
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(
        resumeText
      );

    const hasPhone =
      /(\+?\d[\d\s().-]{8,}\d)/.test(resumeText);

    const hasLinkedIn =
      /linkedin\.com/i.test(resumeText);

    const hasGithub =
      /github\.com/i.test(resumeText);

    let contactScore = 0;

    if (hasEmail) contactScore += 3;
    if (hasPhone) contactScore += 3;
    if (hasLinkedIn) contactScore += 2;
    if (hasGithub) contactScore += 2;

    // ==========================================
    // 2. SECTION ANALYSIS
    // ==========================================

    const sections = findSections(resumeText);

    const importantSections = [
      "summary",
      "skills",
      "education",
      "experience",
      "projects",
    ];

    const missingSections = importantSections.filter(
      (section) => !sections.includes(section)
    );

    const sectionScore = Math.round(
      (importantSections.filter((section) =>
        sections.includes(section)
      ).length /
        importantSections.length) *
        20
    );

    // ==========================================
    // 3. CAREER-SPECIFIC KEYWORDS
    // ==========================================

    // IMPORTANT:
    // skills is declared BEFORE Job Matching.
    const skills =
      careerSkills[careerField] ||
      careerSkills["Software Developer"];

    const matchedKeywords = skills.filter((skill) =>
      containsKeyword(text, skill)
    );

    const missingKeywords = skills.filter(
      (skill) => !containsKeyword(text, skill)
    );

    const keywordScore = Math.round(
      (matchedKeywords.length / skills.length) * 35
    );

    // ==========================================
    // 4. JOB DESCRIPTION MATCHING
    // ==========================================

    const normalizedJobDescription =
      normalizeText(jobDescription);

    // Find career skills mentioned in the JD.
    const requiredJobSkills = jobDescription
      ? skills.filter((skill) =>
          containsKeyword(
            normalizedJobDescription,
            skill
          )
        )
      : [];

    // Find which required JD skills exist in resume.
    const resumeMatchedJobSkills =
      requiredJobSkills.filter((skill) =>
        containsKeyword(text, skill)
      );

    // Find JD skills missing from resume.
    const missingJobSkills =
      requiredJobSkills.filter(
        (skill) => !containsKeyword(text, skill)
      );

    let jobMatchScore = 0;

    if (requiredJobSkills.length > 0) {
      jobMatchScore = Math.round(
        (resumeMatchedJobSkills.length /
          requiredJobSkills.length) *
          100
      );
    }

    // ==========================================
    // 5. EXPERIENCE / INTERNSHIP
    // ==========================================

    const hasExperience =
      sections.includes("experience") ||
      /\binternship\b|\binternships\b|\bwork experience\b/i.test(
        resumeText
      );

    const experienceScore = hasExperience ? 8 : 0;

    // ==========================================
    // 6. PROJECTS
    // ==========================================

    const hasProjects =
      sections.includes("projects");

    const projectScore = hasProjects ? 8 : 0;

    // ==========================================
    // 7. EDUCATION
    // ==========================================

    const hasEducation =
      sections.includes("education");

    const educationScore = hasEducation ? 7 : 0;

    // ==========================================
    // 8. ACTION VERBS
    // ==========================================

    const detectedActionVerbs =
      findActionVerbs(resumeText);

    let actionVerbScore = 0;

    if (detectedActionVerbs.length >= 8) {
      actionVerbScore = 5;
    } else if (detectedActionVerbs.length >= 5) {
      actionVerbScore = 4;
    } else if (detectedActionVerbs.length >= 3) {
      actionVerbScore = 2;
    } else if (detectedActionVerbs.length >= 1) {
      actionVerbScore = 1;
    }

    // ==========================================
    // 9. QUANTIFIABLE ACHIEVEMENTS
    // ==========================================

    const hasNumbers =
      hasQuantification(resumeText);

    const quantificationScore =
      hasNumbers ? 5 : 0;

    // ==========================================
    // 10. RESUME LENGTH
    // ==========================================

    let lengthScore = 0;

    if (wordCount >= 300 && wordCount <= 900) {
      lengthScore = 5;
    } else if (
      wordCount >= 200 &&
      wordCount <= 1100
    ) {
      lengthScore = 3;
    } else {
      lengthScore = 1;
    }

    // ==========================================
    // 11. CONTENT WARNINGS
    // ==========================================

    const warnings: string[] = [];

    if (!hasEmail) {
      warnings.push(
        "Add a professional email address."
      );
    }

    if (!hasPhone) {
      warnings.push(
        "Add a phone number."
      );
    }

    if (!hasLinkedIn) {
      warnings.push(
        "Consider adding your LinkedIn profile."
      );
    }

    if (
      !hasGithub &&
      careerField !== "Data Analyst"
    ) {
      warnings.push(
        "Consider adding your GitHub profile."
      );
    }

    if (!hasProjects) {
      warnings.push(
        "Add a dedicated Projects section."
      );
    }

    if (!hasExperience) {
      warnings.push(
        "Add internships, work experience, or relevant practical experience if available."
      );
    }

    if (!hasNumbers) {
      warnings.push(
        "Add measurable results to projects or experience, such as percentages, users, accuracy, or performance improvements."
      );
    }

    if (detectedActionVerbs.length < 3) {
      warnings.push(
        "Use stronger action verbs such as Developed, Implemented, Designed, Built, Optimized, or Automated."
      );
    }

    if (wordCount < 200) {
      warnings.push(
        "Your resume may contain too little content."
      );
    }

    if (wordCount > 1100) {
      warnings.push(
        "Your resume may be too long. Remove less relevant information."
      );
    }

    // ==========================================
    // 12. STRENGTHS
    // ==========================================

    const strengths: string[] = [];

    if (hasEmail) {
      strengths.push(
        "Professional email detected."
      );
    }

    if (hasPhone) {
      strengths.push(
        "Phone number detected."
      );
    }

    if (hasLinkedIn) {
      strengths.push(
        "LinkedIn profile detected."
      );
    }

    if (hasGithub) {
      strengths.push(
        "GitHub profile detected."
      );
    }

    if (hasProjects) {
      strengths.push(
        "Projects section detected."
      );
    }

    if (hasExperience) {
      strengths.push(
        "Experience or internship section detected."
      );
    }

    if (hasEducation) {
      strengths.push(
        "Education section detected."
      );
    }

    if (matchedKeywords.length >= 5) {
      strengths.push(
        `Strong match with ${careerField} skills (${matchedKeywords.length} relevant skills detected).`
      );
    } else if (matchedKeywords.length >= 3) {
      strengths.push(
        `Some relevant ${careerField} skills were detected.`
      );
    }

    if (detectedActionVerbs.length >= 5) {
      strengths.push(
        "Good use of action-oriented language."
      );
    }

    if (hasNumbers) {
      strengths.push(
        "Quantifiable information was detected in the resume."
      );
    }

    // ==========================================
    // 13. IMPROVEMENTS
    // ==========================================

    const improvements: string[] = [];

    if (missingKeywords.length > 0) {
      improvements.push(
        `Consider adding relevant ${careerField} skills when you genuinely have experience with them.`
      );
    }

    if (missingSections.length > 0) {
      improvements.push(
        `Consider adding these sections: ${missingSections.join(", ")}.`
      );
    }

    if (detectedActionVerbs.length < 5) {
      improvements.push(
        "Replace passive descriptions with strong action verbs."
      );
    }

    if (!hasNumbers) {
      improvements.push(
        "Add measurable achievements to make your experience more convincing."
      );
    }

    if (!hasLinkedIn) {
      improvements.push(
        "Add your LinkedIn profile to improve professional discoverability."
      );
    }

    if (
      !hasGithub &&
      careerField !== "Data Analyst"
    ) {
      improvements.push(
        "Add GitHub if you have relevant coding or technical projects."
      );
    }

    // ==========================================
    // 14. FINAL ATS SCORE
    // ==========================================

    /*
      Maximum possible score:

      Contact        = 10
      Sections       = 20
      Keywords       = 35
      Experience     = 8
      Projects       = 8
      Education      = 7
      Action verbs   = 5
      Quantification = 5
      Length         = 5

      TOTAL = 103

      Normalize to 100.
    */

    const rawScore =
      contactScore +
      sectionScore +
      keywordScore +
      experienceScore +
      projectScore +
      educationScore +
      actionVerbScore +
      quantificationScore +
      lengthScore;

    const score = Math.min(
      100,
      Math.round((rawScore / 103) * 100)
    );

    const rating = getRating(score);

    // ==========================================
    // RESPONSE
    // ==========================================

    return NextResponse.json({
      success: true,

      fileName: file.name,

      analysis: {
        score,
        rating,
        careerField,

        // JOB MATCHING
        jobMatch: {
          score: jobMatchScore,
          requiredSkills: requiredJobSkills,
          matchedSkills: resumeMatchedJobSkills,
          missingSkills: missingJobSkills,
        },

        wordCount,

        matchedKeywords,
        totalKeywords: skills.length,
        missingKeywords,

        sections,
        missingSections,

        detectedActionVerbs,

        hasQuantifiableAchievements:
          hasNumbers,

        strengths,
        improvements,
        warnings,

        breakdown: {
          contact: contactScore,
          sections: sectionScore,
          keywords: keywordScore,
          experience: experienceScore,
          projects: projectScore,
          education: educationScore,
          actionVerbs: actionVerbScore,
          quantification: quantificationScore,
          length: lengthScore,
        },
      },
    });
  } catch (error) {
    console.error(
      "ATS ANALYSIS ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while analyzing the resume. Please try again.",
      },
      { status: 500 }
    );
  }
}