"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type AIAnalysis = {
  overallAssessment: string;
  resumeQualityScore: number;
  jobMatchScore: number;

  summaryQuality: {
    score: number;
    feedback: string;
  };

  experienceQuality: {
    score: number;
    feedback: string;
  };

  projectQuality: {
    score: number;
    feedback: string;
  };

  achievementQuality: {
    score: number;
    feedback: string;
  };

  matchedSkills: string[];
  missingSkills: string[];

  strongPoints: string[];
  weakPoints: string[];

  priorityImprovements: string[];
  bulletPointSuggestions: string[];
};

export default function AIAnalysisPage() {
  const [aiAnalysis, setAiAnalysis] =
    useState<AIAnalysis | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const runAIAnalysis = async () => {
      try {
        // ==========================================
        // GET SAVED RESUME DATA
        // ==========================================

        const savedData = sessionStorage.getItem(
          "resumeScoreAIData"
        );

        if (!savedData) {
          setError(
            "Resume information was not found. Please return to the ATS analyzer and analyze your resume first."
          );

          setLoading(false);
          return;
        }

        const data = JSON.parse(savedData);

        // ==========================================
        // RECREATE FILE
        // ==========================================

        const byteCharacters = atob(data.fileData);

        const byteNumbers = new Array(
          byteCharacters.length
        );

        for (
          let i = 0;
          i < byteCharacters.length;
          i++
        ) {
          byteNumbers[i] =
            byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(
          byteNumbers
        );

        const resumeFile = new File(
          [byteArray],
          data.fileName,
          {
            type: data.fileType,
          }
        );

        // ==========================================
        // SEND TO GEMINI API
        // ==========================================

        const formData = new FormData();

        formData.append("resume", resumeFile);
        formData.append(
          "careerField",
          data.careerField
        );
        formData.append(
          "jobDescription",
          data.jobDescription || ""
        );

        const response = await fetch(
          "/api/ai-analyze",
          {
            method: "POST",
            body: formData,
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.error ||
              "AI analysis could not be completed."
          );
        }

        setAiAnalysis(result.aiAnalysis);
      } catch (err) {
        console.error(
          "Gemini analysis error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while running AI analysis."
        );
      } finally {
        setLoading(false);
      }
    };

    runAIAnalysis();
  }, []);

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">

        <Navbar />

        <section className="mx-auto flex min-h-[75vh] max-w-4xl items-center justify-center px-5">

          <div className="w-full rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-4xl">
              🤖
            </div>

            <h1 className="mt-6 text-3xl font-bold">
              Gemini is analyzing your resume
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
              AI is reviewing your resume quality,
              experience, projects, achievements,
              skills and job compatibility.
            </p>

            <div className="mx-auto mt-8 h-3 max-w-md overflow-hidden rounded-full bg-slate-100">

              <div className="h-full w-1/2 animate-pulse rounded-full bg-blue-600" />

            </div>

            <p className="mt-4 text-xs font-medium text-blue-600">
              Powered by Gemini
            </p>

          </div>

        </section>

      </main>
    );
  }

  // ==========================================
  // ERROR SCREEN
  // ==========================================

  if (error || !aiAnalysis) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">

        <Navbar />

        <section className="mx-auto flex min-h-[75vh] max-w-3xl items-center justify-center px-5">

          <div className="w-full rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm md:p-10">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50 text-4xl">
              ⚠️
            </div>

            <h1 className="mt-6 text-2xl font-bold">
              AI Analysis Unavailable
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
              {error ||
                "Gemini could not analyze your resume at this time."}
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">

              <Link
                href="/analyzer"
                className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                ← Back to ATS Analyzer
              </Link>

              <button
                onClick={() => window.location.reload()}
                className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-400 hover:text-blue-600"
              >
                ↻ Try Again
              </button>

            </div>

          </div>

        </section>

      </main>
    );
  }

  // ==========================================
  // AI RESULTS
  // ==========================================

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      <Navbar />

      <section className="mx-auto max-w-6xl px-5 pb-16 pt-10 md:px-8">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="mb-8">

          <Link
            href="/analyzer"
            className="text-sm font-semibold text-slate-500 transition hover:text-blue-600"
          >
            ← Back to ATS Results
          </Link>

          <div className="mt-6 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-7 text-white shadow-lg md:p-9">

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-3xl">
                🤖
              </div>

              <div>

                <p className="text-sm font-semibold text-blue-100">
                  AI-POWERED RESUME REVIEW
                </p>

                <h1 className="mt-1 text-3xl font-black md:text-4xl">
                  Gemini AI Analysis
                </h1>

                <p className="mt-1 text-sm text-blue-100">
                  Powered by Gemini
                </p>

              </div>

            </div>

            <p className="mt-6 max-w-3xl text-sm leading-7 text-blue-50 md:text-base">
              {aiAnalysis.overallAssessment}
            </p>

          </div>

        </div>


        {/* ==========================================
            AI SCORES
        ========================================== */}

        <div className="grid gap-5 md:grid-cols-2">

          <ScoreCard
            title="AI Resume Quality"
            score={aiAnalysis.resumeQualityScore}
            description="Overall quality of your resume according to Gemini."
          />

          <ScoreCard
            title="AI Job Match"
            score={aiAnalysis.jobMatchScore}
            description="How closely your resume matches the target role."
          />

        </div>


        {/* ==========================================
            QUALITY BREAKDOWN
        ========================================== */}

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">

          <SectionHeading
            icon="🧠"
            title="AI Quality Breakdown"
            description="Gemini's evaluation of the most important resume areas."
          />

          <div className="mt-6 grid gap-5 md:grid-cols-2">

            <QualityCard
              title="Summary Quality"
              score={aiAnalysis.summaryQuality.score}
              feedback={aiAnalysis.summaryQuality.feedback}
            />

            <QualityCard
              title="Experience Quality"
              score={aiAnalysis.experienceQuality.score}
              feedback={aiAnalysis.experienceQuality.feedback}
            />

            <QualityCard
              title="Project Quality"
              score={aiAnalysis.projectQuality.score}
              feedback={aiAnalysis.projectQuality.feedback}
            />

            <QualityCard
              title="Achievement Quality"
              score={aiAnalysis.achievementQuality.score}
              feedback={aiAnalysis.achievementQuality.feedback}
            />

          </div>

        </section>


        {/* ==========================================
            STRENGTHS + WEAKNESSES
        ========================================== */}

        <div className="mt-6 grid gap-6 md:grid-cols-2">

          <ListCard
            title="AI Detected Strengths"
            icon="✅"
            items={aiAnalysis.strongPoints}
            type="green"
          />

          <ListCard
            title="AI Detected Weaknesses"
            icon="⚠️"
            items={aiAnalysis.weakPoints}
            type="red"
          />

        </div>


        {/* ==========================================
            SKILLS
        ========================================== */}

        <div className="mt-6 grid gap-6 md:grid-cols-2">

          <SkillCard
            title="AI Matched Skills"
            icon="🎯"
            skills={aiAnalysis.matchedSkills}
            type="green"
          />

          <SkillCard
            title="AI Missing Skills"
            icon="🔍"
            skills={aiAnalysis.missingSkills}
            type="red"
          />

        </div>


        {/* ==========================================
            PRIORITY IMPROVEMENTS
        ========================================== */}

        <section className="mt-6 rounded-3xl border border-orange-200 bg-white p-6 shadow-sm md:p-8">

          <SectionHeading
            icon="🔥"
            title="AI Priority Improvements"
            description="The changes Gemini considers most important."
          />

          <div className="mt-6 space-y-3">

            {aiAnalysis.priorityImprovements.length > 0 ? (

              aiAnalysis.priorityImprovements.map(
                (item, index) => (

                  <div
                    key={index}
                    className="flex gap-4 rounded-2xl border border-orange-100 bg-orange-50 p-5"
                  >

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-black text-white">
                      {index + 1}
                    </div>

                    <p className="text-sm leading-6 text-slate-700">
                      {item}
                    </p>

                  </div>

                )
              )

            ) : (

              <p className="text-sm text-slate-500">
                No major improvements were suggested.
              </p>

            )}

          </div>

        </section>


        {/* ==========================================
            BULLET POINT SUGGESTIONS
        ========================================== */}

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">

          <SectionHeading
            icon="✍️"
            title="AI Bullet Point Suggestions"
            description="Suggestions for making your resume achievements stronger and more measurable."
          />

          <div className="mt-6 space-y-4">

            {aiAnalysis.bulletPointSuggestions.length > 0 ? (

              aiAnalysis.bulletPointSuggestions.map(
                (suggestion, index) => (

                  <div
                    key={index}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                  >

                    <div className="mb-2 text-xs font-bold uppercase tracking-wider text-blue-600">
                      Suggestion {index + 1}
                    </div>

                    <p className="text-sm leading-6 text-slate-700">
                      {suggestion}
                    </p>

                  </div>

                )
              )

            ) : (

              <p className="text-sm text-slate-500">
                No bullet point suggestions were generated.
              </p>

            )}

          </div>

        </section>


        {/* ==========================================
            BOTTOM CTA
        ========================================== */}

        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-3xl border border-blue-200 bg-blue-50 p-6 text-center sm:flex-row sm:text-left">

          <div>

            <h3 className="font-bold text-slate-800">
              Want to improve your resume further?
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Return to your ATS dashboard and review all the technical checks.
            </p>

          </div>

          <Link
            href="/analyzer"
            className="shrink-0 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
          >
            ← Back to ATS Results
          </Link>

        </div>


        {/* FOOTER */}

        <p className="mt-8 text-center text-xs leading-5 text-slate-400">
          ResumeScore uses AI-assisted analysis to provide resume
          improvement suggestions. Always verify suggestions and only
          include skills and experience you genuinely have.
        </p>

      </section>

    </main>
  );
}


/* =========================================================
   NAVBAR
========================================================= */

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">

        <Link
          href="/"
          className="text-2xl font-bold tracking-tight text-blue-600"
        >
          ResumeScore
        </Link>

        <Link
          href="/analyzer"
          className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-blue-600"
        >
          ← ATS Analyzer
        </Link>

      </div>

    </nav>
  );
}


/* =========================================================
   SECTION HEADING
========================================================= */

function SectionHeading({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl">
        {icon}
      </div>

      <div>

        <h2 className="text-xl font-bold md:text-2xl">
          {title}
        </h2>

        <p className="mt-1 text-sm leading-5 text-slate-500">
          {description}
        </p>

      </div>

    </div>
  );
}


/* =========================================================
   SCORE CARD
========================================================= */

function ScoreCard({
  title,
  score,
  description,
}: {
  title: string;
  score: number;
  description: string;
}) {
  const safeScore = Math.min(
    100,
    Math.max(0, Number(score) || 0)
  );

  const scoreColor =
    safeScore >= 80
      ? "text-green-600"
      : safeScore >= 60
        ? "text-blue-600"
        : safeScore >= 40
          ? "text-orange-500"
          : "text-red-600";

  const barColor =
    safeScore >= 80
      ? "bg-green-500"
      : safeScore >= 60
        ? "bg-blue-600"
        : safeScore >= 40
          ? "bg-orange-500"
          : "bg-red-500";

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
        {title}
      </p>

      <div className="mt-3 flex items-end gap-2">

        <span className={`text-5xl font-black ${scoreColor}`}>
          {safeScore}
        </span>

        <span className="mb-1 text-xl text-slate-400">
          /100
        </span>

      </div>

      <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">

        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{
            width: `${safeScore}%`,
          }}
        />

      </div>

      <p className="mt-4 text-sm leading-6 text-slate-500">
        {description}
      </p>

    </div>
  );
}


/* =========================================================
   QUALITY CARD
========================================================= */

function QualityCard({
  title,
  score,
  feedback,
}: {
  title: string;
  score: number;
  feedback: string;
}) {
  const safeScore = Math.min(
    100,
    Math.max(0, Number(score) || 0)
  );

  return (
    <div className="rounded-2xl border border-slate-200 p-5">

      <div className="flex items-center justify-between gap-3">

        <h3 className="font-bold text-slate-800">
          {title}
        </h3>

        <span className="text-xl font-black text-blue-600">
          {safeScore}/100
        </span>

      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">

        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-700"
          style={{
            width: `${safeScore}%`,
          }}
        />

      </div>

      <p className="mt-4 text-sm leading-6 text-slate-600">
        {feedback}
      </p>

    </div>
  );
}


/* =========================================================
   LIST CARD
========================================================= */

function ListCard({
  title,
  icon,
  items,
  type,
}: {
  title: string;
  icon: string;
  items: string[];
  type: "green" | "red";
}) {
  const containerStyle =
    type === "green"
      ? "border-green-200 bg-green-50"
      : "border-red-200 bg-red-50";

  const titleStyle =
    type === "green"
      ? "text-green-800"
      : "text-red-800";

  return (
    <div
      className={`rounded-3xl border p-6 shadow-sm ${containerStyle}`}
    >

      <h2
        className={`text-xl font-bold ${titleStyle}`}
      >
        {icon} {title}
      </h2>

      <div className="mt-5 space-y-3">

        {items.length > 0 ? (

          items.map((item, index) => (

            <div
              key={index}
              className="rounded-xl border border-white bg-white p-4 text-sm leading-6 text-slate-700"
            >
              {item}
            </div>

          ))

        ) : (

          <p className="text-sm text-slate-500">
            Nothing was detected here.
          </p>

        )}

      </div>

    </div>
  );
}


/* =========================================================
   SKILL CARD
========================================================= */

function SkillCard({
  title,
  icon,
  skills,
  type,
}: {
  title: string;
  icon: string;
  skills: string[];
  type: "green" | "red";
}) {
  const borderStyle =
    type === "green"
      ? "border-green-200"
      : "border-red-200";

  const skillStyle =
    type === "green"
      ? "border-green-200 bg-green-50 text-green-700"
      : "border-red-200 bg-red-50 text-red-700";

  return (
    <div
      className={`rounded-3xl border ${borderStyle} bg-white p-6 shadow-sm`}
    >

      <div className="flex items-center justify-between gap-3">

        <h2 className="text-xl font-bold">
          {icon} {title}
        </h2>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
          {skills.length}
        </span>

      </div>

      {skills.length > 0 ? (

        <div className="mt-5 flex flex-wrap gap-2">

          {skills.map((skill, index) => (

            <span
              key={index}
              className={`rounded-full border px-3 py-2 text-xs font-semibold ${skillStyle}`}
            >
              {skill}
            </span>

          ))}

        </div>

      ) : (

        <p className="mt-5 text-sm text-slate-500">
          No major skills were detected.
        </p>

      )}

    </div>
  );
}