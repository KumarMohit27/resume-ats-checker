"use client";

import { useState } from "react";
import Link from "next/link";

type Analysis = {
  score: number;
  rating: string;
  careerField: string;

  jobMatch: {
    score: number;
    requiredSkills: string[];
    matchedSkills: string[];
    missingSkills: string[];
  };

  wordCount: number;
  matchedKeywords: string[];
  totalKeywords: number;
  missingKeywords: string[];

  sections: string[];
  missingSections: string[];

  detectedActionVerbs: string[];
  hasQuantifiableAchievements: boolean;

  strengths: string[];
  improvements: string[];
  warnings: string[];

  breakdown: {
    contact: number;
    sections: number;
    keywords: number;
    experience: number;
    projects: number;
    education: number;
    actionVerbs: number;
    quantification: number;
    length: number;
  };
};

export default function AnalyzerPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [careerField, setCareerField] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a PDF or DOCX file.");
      return;
    }

    setSelectedFile(file);
    setAnalysis(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      alert("Please upload your resume first.");
      return;
    }

    if (!careerField) {
      alert("Please select your career field.");
      return;
    }

    setLoading(true);

    try {
      // ==========================================
      // ATS ANALYSIS ONLY
      // ==========================================

      const atsFormData = new FormData();

      atsFormData.append("resume", selectedFile);
      atsFormData.append("careerField", careerField);
      atsFormData.append("jobDescription", jobDescription);

      const atsResponse = await fetch("/api/analyze", {
        method: "POST",
        body: atsFormData,
      });

      const atsData = await atsResponse.json();

      if (!atsResponse.ok || !atsData.success) {
        alert(atsData.error || "ATS analysis failed.");
        return;
      }

      // ==========================================
      // SAVE RESUME FOR AI PAGE
      // ==========================================

      const fileData = await fileToBase64(selectedFile);

      sessionStorage.setItem(
        "resumeScoreAIData",
        JSON.stringify({
          fileName: selectedFile.name,
          fileType: selectedFile.type,
          fileData,
          careerField,
          jobDescription,
        })
      );

      // ==========================================
      // SHOW ATS RESULTS
      // ==========================================

      setAnalysis(atsData.analysis);
    } catch (error) {
      console.error("ATS analysis error:", error);

      alert(
        "Something went wrong while analyzing your resume. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNewResume = () => {
    setAnalysis(null);
    setSelectedFile(null);
    setCareerField("");
    setJobDescription("");
    setShowAdvanced(false);

    sessionStorage.removeItem("resumeScoreAIData");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">

          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-blue-600"
          >
            ResumeScore
          </Link>

          <Link
            href="/"
            className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-blue-600"
          >
            ← Home
          </Link>

        </div>
      </nav>


      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <section className="mx-auto max-w-5xl px-5 pb-8 pt-10 text-center md:px-8">

        <div className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
          📊 ATS Resume Analyzer
        </div>

        <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Check Your ATS Score
        </h1>

        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
          Upload your resume and discover how well it performs against
          ATS requirements and your target career.
        </p>

      </section>


      {/* =====================================================
          ANALYZER FORM
      ===================================================== */}

      {!analysis && (
        <section className="mx-auto max-w-4xl px-5 pb-16 md:px-8">

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">

            {/* UPLOAD */}

            <div>

              <label className="mb-3 block text-sm font-bold text-slate-800">
                Upload Resume
              </label>

              <label
                htmlFor="resume-upload"
                className="group block cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition hover:border-blue-500 hover:bg-blue-50/40"
              >

                <div className="text-4xl transition group-hover:scale-110">
                  📄
                </div>

                <h2 className="mt-3 font-bold text-slate-800">
                  Upload your resume
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  PDF or DOCX files supported
                </p>

                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />

              </label>


              {selectedFile && (
                <div className="mt-3 flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800">

                  <span>📄</span>

                  <span className="truncate">
                    {selectedFile.name}
                  </span>

                  <span className="ml-auto text-green-600">
                    ✓
                  </span>

                </div>
              )}

            </div>


            {/* CAREER FIELD */}

            <div className="mt-6">

              <label
                htmlFor="career"
                className="mb-2 block text-sm font-bold text-slate-800"
              >
                Target Career Field
              </label>

              <select
                id="career"
                value={careerField}
                onChange={(e) => setCareerField(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >

                <option value="">
                  Select your career field
                </option>

                <option value="Software Developer">
                  Software Developer
                </option>

                <option value="AI / Machine Learning Engineer">
                  AI / Machine Learning Engineer
                </option>

                <option value="Data Scientist">
                  Data Scientist
                </option>

                <option value="Data Analyst">
                  Data Analyst
                </option>

                <option value="Web Developer">
                  Web Developer
                </option>

                <option value="Cloud Engineer">
                  Cloud Engineer
                </option>

                <option value="Cybersecurity">
                  Cybersecurity
                </option>

              </select>

            </div>


            {/* JOB DESCRIPTION */}

            <div className="mt-6">

              <div className="mb-2 flex items-center justify-between">

                <label
                  htmlFor="job-description"
                  className="text-sm font-bold text-slate-800"
                >
                  Job Description
                </label>

                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                  Optional
                </span>

              </div>

              <textarea
                id="job-description"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={6}
                placeholder="Paste the job description here to get a Job Match Score..."
                className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>


            {/* ATS BUTTON */}

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-blue-600 py-4 font-bold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {loading
                ? "⟳ Analyzing Your Resume..."
                : "Analyze My Resume →"}
            </button>

            <p className="mt-3 text-center text-xs text-slate-400">
              This step performs ATS-focused resume checks.
            </p>

          </div>

        </section>
      )}


      {/* =====================================================
          RESULTS
      ===================================================== */}

      {analysis && (
        <section
          id="results"
          className="mx-auto max-w-7xl px-5 pb-16 md:px-8"
        >

          {/* RESULT HEADER */}

          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">

            <div>

              <div className="flex items-center gap-2 text-sm font-bold text-green-600">

                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                  ✓
                </span>

                ANALYSIS COMPLETE

              </div>

              <h2 className="mt-2 text-3xl font-bold tracking-tight">
                Resume Dashboard
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {analysis.careerField}
              </p>

            </div>


            <button
              onClick={handleNewResume}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-blue-400 hover:text-blue-600"
            >
              ↻ Analyze Another Resume
            </button>

          </div>


          {/* =================================================
              AI BUTTON
          ================================================= */}

          <div className="mb-6 overflow-hidden rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 shadow-lg md:p-8">

            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

              <div className="text-white">

                <div className="flex items-center gap-3">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-2xl">
                    🤖
                  </div>

                  <div>

                    <h2 className="text-2xl font-bold">
                      Want a Deeper Resume Analysis?
                    </h2>

                    <p className="mt-1 text-sm text-blue-100">
                      Let Gemini AI review your resume in detail.
                    </p>

                  </div>

                </div>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-blue-50">
                  Get AI-powered feedback on your summary, experience,
                  projects, achievements, skills and job compatibility.
                </p>

              </div>


              <Link
                href="/ai-analysis"
                className="shrink-0 rounded-2xl bg-white px-6 py-4 text-center text-sm font-bold text-blue-700 shadow-md transition hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-lg"
              >
                🤖 Check Your Resume with AI →
              </Link>

            </div>

          </div>


          {/* =================================================
              TOP SCORE AREA
          ================================================= */}

          <div className="grid gap-5 lg:grid-cols-3">

            {/* ATS SCORE */}

            <ATSScoreCard
              score={analysis.score}
              rating={analysis.rating}
            />


            {/* JOB MATCH */}

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2 md:p-7">

              {jobDescription.trim() && analysis.jobMatch ? (

                <>

                  <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

                    <div>

                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        Job Compatibility
                      </p>

                      <h3 className="mt-1 text-2xl font-bold">
                        🎯 Job Match Score
                      </h3>

                      <p className="mt-1 max-w-lg text-sm leading-6 text-slate-500">
                        See how closely your resume matches the
                        skills required for this position.
                      </p>

                    </div>


                    <div className="text-center sm:text-right">

                      <div className="text-5xl font-black text-blue-600">
                        {analysis.jobMatch.score}
                        <span className="text-xl font-medium text-slate-400">
                          /100
                        </span>
                      </div>

                      <p
                        className={`mt-1 text-sm font-bold ${getMatchColor(
                          analysis.jobMatch.score
                        )}`}
                      >
                        {getMatchLabel(analysis.jobMatch.score)}
                      </p>

                    </div>

                  </div>


                  <div className="mt-5">

                    <div className="h-3 overflow-hidden rounded-full bg-slate-100">

                      <div
                        className={`h-full rounded-full transition-all duration-700 ${getScoreBarColor(
                          analysis.jobMatch.score
                        )}`}
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(0, analysis.jobMatch.score)
                          )}%`,
                        }}
                      />

                    </div>

                  </div>


                  <div className="mt-5 grid grid-cols-3 gap-3">

                    <MiniStat
                      value={
                        analysis.jobMatch.requiredSkills.length
                      }
                      label="Required"
                    />

                    <MiniStat
                      value={
                        analysis.jobMatch.matchedSkills.length
                      }
                      label="Matched"
                      green
                    />

                    <MiniStat
                      value={
                        analysis.jobMatch.missingSkills.length
                      }
                      label="Missing"
                      red
                    />

                  </div>

                </>

              ) : (

                <div className="flex min-h-[230px] flex-col items-center justify-center text-center">

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
                    🎯
                  </div>

                  <h3 className="mt-4 text-xl font-bold">
                    Job Match Score
                  </h3>

                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                    Add a job description before analyzing your
                    resume to compare your skills with the role.
                  </p>

                </div>

              )}

            </div>

          </div>


          {/* QUICK STATS */}

          <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">

            <QuickStat
              value={analysis.wordCount}
              label="Resume Words"
            />

            <QuickStat
              value={analysis.matchedKeywords.length}
              label="Keywords Found"
              green
            />

            <QuickStat
              value={analysis.totalKeywords}
              label="Keywords Checked"
            />

            <QuickStat
              value={analysis.missingKeywords.length}
              label="Missing Keywords"
              red
            />

          </div>


          {/* FIX THESE FIRST */}

          <PrioritySection analysis={analysis} />


          {/* SCORE BREAKDOWN + ATS CHECKS */}

          <div className="mt-5 grid gap-5 lg:grid-cols-2">

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="mb-5">

                <div className="flex items-center gap-2">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                    📊
                  </div>

                  <div>

                    <h3 className="text-xl font-bold">
                      Score Breakdown
                    </h3>

                    <p className="text-sm text-slate-500">
                      Factors contributing to your ATS score.
                    </p>

                  </div>

                </div>

              </div>


              <ScoreBar
                label="Contact Information"
                value={analysis.breakdown.contact}
                max={10}
              />

              <ScoreBar
                label="Resume Sections"
                value={analysis.breakdown.sections}
                max={20}
              />

              <ScoreBar
                label="Career Keywords"
                value={analysis.breakdown.keywords}
                max={35}
              />

              <ScoreBar
                label="Experience"
                value={analysis.breakdown.experience}
                max={8}
              />

              <ScoreBar
                label="Projects"
                value={analysis.breakdown.projects}
                max={8}
              />

              <ScoreBar
                label="Education"
                value={analysis.breakdown.education}
                max={7}
              />

              <ScoreBar
                label="Action Verbs"
                value={analysis.breakdown.actionVerbs}
                max={5}
              />

              <ScoreBar
                label="Achievements"
                value={analysis.breakdown.quantification}
                max={5}
              />

              <ScoreBar
                label="Resume Length"
                value={analysis.breakdown.length}
                max={5}
              />

            </div>


            <ATSChecks analysis={analysis} />

          </div>


          {/* KEYWORD ANALYSIS */}

          <div className="mt-5 grid gap-5 lg:grid-cols-2">

            <SkillBox
              title="✅ Matching Skills & Keywords"
              skills={analysis.matchedKeywords}
              type="green"
              emptyText="No matching skills found."
            />

            <SkillBox
              title="⚠️ Missing Relevant Skills"
              skills={analysis.missingKeywords}
              type="red"
              emptyText="No relevant skills are missing."
            />

          </div>


          {/* STRENGTHS + IMPROVEMENTS */}

          <div className="mt-5 grid gap-5 lg:grid-cols-2">

            <ResultBox
              title="💪 Strengths"
              items={analysis.strengths}
              type="green"
            />

            <ResultBox
              title="💡 Improvement Suggestions"
              items={analysis.improvements}
              type="blue"
            />

          </div>


          {/* JOB SKILLS */}

          {jobDescription.trim() &&
            analysis.jobMatch &&
            (analysis.jobMatch.matchedSkills.length > 0 ||
              analysis.jobMatch.missingSkills.length > 0) && (

              <div className="mt-5">

                <div className="mb-4">

                  <h3 className="text-xl font-bold">
                    🎯 Job Skill Analysis
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Skills detected from the job description.
                  </p>

                </div>


                <div className="grid gap-5 lg:grid-cols-2">

                  <SkillBox
                    title="🎯 Matched Job Skills"
                    skills={analysis.jobMatch.matchedSkills}
                    type="green"
                    emptyText="No matching job skills detected."
                  />

                  <SkillBox
                    title="⚠️ Missing Job Skills"
                    skills={analysis.jobMatch.missingSkills}
                    type="red"
                    emptyText="All detected job skills are present."
                  />

                </div>

              </div>
            )}


          {/* ADVANCED ANALYSIS */}

          <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex w-full items-center justify-between p-5 text-left transition hover:bg-slate-50 md:p-6"
            >

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                  🔍
                </div>

                <div>

                  <h3 className="text-xl font-bold">
                    Advanced Resume Analysis
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Resume sections, action verbs, achievements and
                    warnings.
                  </p>

                </div>

              </div>


              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xl font-bold text-slate-500">
                {showAdvanced ? "−" : "+"}
              </span>

            </button>


            {showAdvanced && (

              <div className="border-t border-slate-200 p-5 md:p-6">

                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                  {/* PRESENT SECTIONS */}

                  <div className="rounded-2xl bg-slate-50 p-5">

                    <h4 className="font-bold">
                      📑 Resume Sections
                    </h4>

                    <div className="mt-4 space-y-2">

                      {analysis.sections.length > 0 ? (

                        analysis.sections.map((section, index) => (

                          <div
                            key={index}
                            className="text-sm text-green-700"
                          >
                            ✓{" "}
                            <span className="capitalize">
                              {section}
                            </span>
                          </div>

                        ))

                      ) : (

                        <p className="text-sm text-slate-500">
                          No sections detected.
                        </p>

                      )}

                    </div>

                  </div>


                  {/* MISSING SECTIONS */}

                  <div className="rounded-2xl bg-slate-50 p-5">

                    <h4 className="font-bold">
                      📌 Missing Sections
                    </h4>

                    <div className="mt-4 space-y-2">

                      {analysis.missingSections.length > 0 ? (

                        analysis.missingSections.map(
                          (section, index) => (

                            <div
                              key={index}
                              className="text-sm text-red-600"
                            >
                              ✗{" "}
                              <span className="capitalize">
                                {section}
                              </span>
                            </div>

                          )
                        )

                      ) : (

                        <p className="text-sm text-green-600">
                          ✓ All important sections are present.
                        </p>

                      )}

                    </div>

                  </div>


                  {/* ACTION VERBS */}

                  <div className="rounded-2xl bg-slate-50 p-5">

                    <h4 className="font-bold">
                      🚀 Action Verbs
                    </h4>

                    <div className="mt-4 flex flex-wrap gap-2">

                      {analysis.detectedActionVerbs.length > 0 ? (

                        analysis.detectedActionVerbs.map(
                          (verb, index) => (

                            <span
                              key={index}
                              className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"
                            >
                              {verb}
                            </span>

                          )
                        )

                      ) : (

                        <p className="text-sm text-slate-500">
                          No strong action verbs detected.
                        </p>

                      )}

                    </div>

                  </div>


                  {/* ACHIEVEMENTS */}

                  <div className="rounded-2xl bg-slate-50 p-5">

                    <h4 className="font-bold">
                      📈 Quantifiable Achievements
                    </h4>

                    <p
                      className={`mt-4 text-sm leading-6 ${
                        analysis.hasQuantifiableAchievements
                          ? "text-green-600"
                          : "text-orange-600"
                      }`}
                    >
                      {analysis.hasQuantifiableAchievements
                        ? "✓ Your resume contains measurable information."
                        : "Consider adding measurable results such as percentages, accuracy, users, performance improvements, or numbers."}
                    </p>

                  </div>


                  {/* WARNINGS */}

                  <div className="rounded-2xl bg-orange-50 p-5 md:col-span-2">

                    <h4 className="font-bold text-orange-800">
                      ⚠️ Warnings
                    </h4>

                    {analysis.warnings.length > 0 ? (

                      <div className="mt-4 grid gap-2 sm:grid-cols-2">

                        {analysis.warnings.map(
                          (warning, index) => (

                            <div
                              key={index}
                              className="rounded-xl border border-orange-100 bg-white p-3 text-sm leading-5 text-slate-700"
                            >
                              {warning}
                            </div>

                          )
                        )}

                      </div>

                    ) : (

                      <p className="mt-3 text-sm text-green-600">
                        ✓ No major warnings.
                      </p>

                    )}

                  </div>

                </div>

              </div>

            )}

          </div>


          {/* FOOTER */}

          <p className="mt-6 text-center text-xs leading-5 text-slate-400">
            ResumeScore provides automated ATS analysis. Only add
            skills and experience that you genuinely have.
          </p>

        </section>
      )}

    </main>
  );
}


/* =========================================================
   FILE TO BASE64
========================================================= */

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result !== "string") {
        reject(new Error("Could not read file."));
        return;
      }

      // Remove "data:...;base64," prefix
      const base64 = result.split(",")[1];

      resolve(base64);
    };

    reader.onerror = () => {
      reject(new Error("Could not convert file."));
    };

    reader.readAsDataURL(file);
  });
}


/* =========================================================
   ATS SCORE CARD
========================================================= */

function ATSScoreCard({
  score,
  rating,
}: {
  score: number;
  rating: string;
}) {
  const safeScore = Math.min(100, Math.max(0, score));

  const scoreColor =
    safeScore >= 80
      ? "text-green-600"
      : safeScore >= 60
        ? "text-blue-600"
        : safeScore >= 40
          ? "text-orange-500"
          : "text-red-600";

  const ringColor =
    safeScore >= 80
      ? "border-green-500"
      : safeScore >= 60
        ? "border-blue-500"
        : safeScore >= 40
          ? "border-orange-400"
          : "border-red-500";

  const progressColor =
    safeScore >= 80
      ? "bg-green-500"
      : safeScore >= 60
        ? "bg-blue-600"
        : safeScore >= 40
          ? "bg-orange-500"
          : "bg-red-500";

  const explanation =
    safeScore >= 80
      ? "Excellent ATS readiness. Your resume is well optimized."
      : safeScore >= 60
        ? "Good ATS readiness, but there are areas that can still be improved."
        : safeScore >= 40
          ? "Your resume needs some improvements to perform better with ATS systems."
          : "Your resume needs significant improvements before applying.";

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm md:p-7">

      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
        Overall ATS Score
      </p>

      <div className="mt-5 flex justify-center">

        <div
          className={`relative flex h-40 w-40 items-center justify-center rounded-full border-[12px] bg-white shadow-inner ${ringColor}`}
        >

          <div>

            <div
              className={`text-5xl font-black tracking-tight ${scoreColor}`}
            >
              {safeScore}
            </div>

            <div className="text-sm font-medium text-slate-400">
              /100
            </div>

          </div>

        </div>

      </div>

      <div className={`mt-4 text-lg font-bold ${scoreColor}`}>
        {rating}
      </div>

      <div className="mx-auto mt-5 max-w-xs">

        <div className="h-3 overflow-hidden rounded-full bg-slate-100">

          <div
            className={`h-full rounded-full transition-all duration-700 ${progressColor}`}
            style={{
              width: `${safeScore}%`,
            }}
          />

        </div>

      </div>

      <p className="mx-auto mt-4 max-w-xs text-xs leading-5 text-slate-500">
        {explanation}
      </p>

    </div>
  );
}


/* =========================================================
   PRIORITY SECTION
========================================================= */

function PrioritySection({
  analysis,
}: {
  analysis: Analysis;
}) {
  const priorities: {
    title: string;
    description: string;
    priority: "High" | "Medium";
  }[] = [];

  if (analysis.missingKeywords.length > 0) {
    priorities.push({
      title: "Add relevant missing keywords",
      description: `Consider adding ${Math.min(
        5,
        analysis.missingKeywords.length
      )} relevant skills or keywords that genuinely match your experience.`,
      priority: "High",
    });
  }

  if (!analysis.hasQuantifiableAchievements) {
    priorities.push({
      title: "Add measurable achievements",
      description:
        "Use numbers, percentages, accuracy, performance improvements, users, revenue, or other measurable results where appropriate.",
      priority: "High",
    });
  }

  if (analysis.missingSections.length > 0) {
    priorities.push({
      title: "Complete important resume sections",
      description: `Consider adding: ${analysis.missingSections
        .slice(0, 3)
        .join(", ")}.`,
      priority: "High",
    });
  }

  if (analysis.detectedActionVerbs.length < 3) {
    priorities.push({
      title: "Use stronger action verbs",
      description:
        "Start bullet points with clear action verbs such as Developed, Implemented, Designed, Analyzed, Optimized, or Led.",
      priority: "Medium",
    });
  }

  if (analysis.breakdown.experience < 5) {
    priorities.push({
      title: "Strengthen experience descriptions",
      description:
        "Describe what you did, which technologies you used, and what measurable result you achieved.",
      priority: "Medium",
    });
  }

  if (analysis.breakdown.projects < 5) {
    priorities.push({
      title: "Improve project descriptions",
      description:
        "Highlight the technology, your contribution, and the outcome of important projects.",
      priority: "Medium",
    });
  }

  const visiblePriorities = priorities.slice(0, 3);

  return (
    <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-7">

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <div className="flex items-center gap-2">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
              🔥
            </div>

            <h3 className="text-xl font-bold">
              Fix These First
            </h3>

          </div>

          <p className="mt-2 text-sm text-slate-500">
            The most important improvements you can make to your
            resume right now.
          </p>

        </div>

        {visiblePriorities.length > 0 && (
          <span className="w-fit rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">
            {visiblePriorities.length} priorities
          </span>
        )}

      </div>


      {visiblePriorities.length > 0 ? (

        <div className="mt-5 grid gap-3">

          {visiblePriorities.map((item, index) => (

            <div
              key={index}
              className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >

              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-black text-slate-700 shadow-sm">
                {index + 1}
              </div>

              <div className="min-w-0 flex-1">

                <div className="flex flex-wrap items-center gap-2">

                  <h4 className="font-bold text-slate-800">
                    {item.title}
                  </h4>

                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                      item.priority === "High"
                        ? "bg-red-100 text-red-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {item.priority}
                  </span>

                </div>

                <p className="mt-1 text-sm leading-5 text-slate-600">
                  {item.description}
                </p>

              </div>

            </div>

          ))}

        </div>

      ) : (

        <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
          ✓ No major improvement priorities were detected.
        </div>

      )}

    </div>
  );
}


/* =========================================================
   ATS CHECKS
========================================================= */

function ATSChecks({
  analysis,
}: {
  analysis: Analysis;
}) {

  const checks = [
    {
      title: "Contact Information",
      passed: analysis.breakdown.contact >= 7,
      detail:
        analysis.breakdown.contact >= 7
          ? "Contact details appear to be present."
          : "Review your phone number, email and contact details.",
    },

    {
      title: "Resume Sections",
      passed: analysis.breakdown.sections >= 15,
      detail:
        analysis.breakdown.sections >= 15
          ? "Important resume sections were detected."
          : "Some important resume sections may be missing.",
    },

    {
      title: "Career Keywords",
      passed: analysis.breakdown.keywords >= 24,
      detail:
        analysis.breakdown.keywords >= 24
          ? "Good coverage of relevant career keywords."
          : "Consider adding more relevant career keywords.",
    },

    {
      title: "Experience",
      passed: analysis.breakdown.experience >= 5,
      detail:
        analysis.breakdown.experience >= 5
          ? "Experience information looks reasonably complete."
          : "Strengthen your experience descriptions.",
    },

    {
      title: "Projects",
      passed: analysis.breakdown.projects >= 5,
      detail:
        analysis.breakdown.projects >= 5
          ? "Projects are contributing positively to your resume."
          : "Consider adding or improving relevant projects.",
    },

    {
      title: "Education",
      passed: analysis.breakdown.education >= 5,
      detail:
        analysis.breakdown.education >= 5
          ? "Education information was detected."
          : "Review your education details.",
    },

    {
      title: "Action Verbs",
      passed: analysis.breakdown.actionVerbs >= 3,
      detail:
        analysis.breakdown.actionVerbs >= 3
          ? "Strong action-oriented language was detected."
          : "Use stronger action verbs in your bullet points.",
    },

    {
      title: "Measurable Achievements",
      passed: analysis.hasQuantifiableAchievements,
      detail: analysis.hasQuantifiableAchievements
        ? "Measurable information was detected."
        : "Add numbers or measurable outcomes where possible.",
    },

    {
      title: "Resume Length",
      passed: analysis.breakdown.length >= 3,
      detail:
        analysis.breakdown.length >= 3
          ? "Resume length is within a reasonable range."
          : "Review the amount of content in your resume.",
    },
  ];

  const passedCount = checks.filter(
    (check) => check.passed
  ).length;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-7">

      <div className="flex items-start justify-between gap-4">

        <div>

          <div className="flex items-center gap-2">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
              📄
            </div>

            <div>

              <h3 className="text-xl font-bold">
                ATS Readiness Checks
              </h3>

              <p className="text-sm text-slate-500">
                Important resume quality checks.
              </p>

            </div>

          </div>

        </div>

        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
          {passedCount}/{checks.length}
        </div>

      </div>


      <div className="mt-5 space-y-2">

        {checks.map((check, index) => (

          <div
            key={index}
            className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3"
          >

            <span
              className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                check.passed
                  ? "bg-green-100 text-green-700"
                  : "bg-orange-100 text-orange-700"
              }`}
            >
              {check.passed ? "✓" : "!"}
            </span>

            <div className="min-w-0">

              <p className="text-sm font-bold text-slate-800">
                {check.title}
              </p>

              <p className="mt-0.5 text-xs leading-5 text-slate-500">
                {check.detail}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}


/* =========================================================
   SCORE BAR
========================================================= */

function ScoreBar({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {

  const percentage = Math.min(
    100,
    Math.max(0, Math.round((value / max) * 100))
  );

  return (
    <div className="mb-4">

      <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">

        <span className="font-medium text-slate-700">
          {label}
        </span>

        <span className="shrink-0 font-bold text-slate-800">
          {value}/{max}
        </span>

      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">

        <div
          className={`h-full rounded-full transition-all duration-500 ${getScoreBarColor(
            percentage
          )}`}
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

    </div>
  );
}


/* =========================================================
   QUICK STAT
========================================================= */

function QuickStat({
  value,
  label,
  green = false,
  red = false,
}: {
  value: number;
  label: string;
  green?: boolean;
  red?: boolean;
}) {

  const color = red
    ? "text-red-600"
    : green
      ? "text-green-600"
      : "text-blue-600";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:p-5">

      <div className={`text-2xl font-black md:text-3xl ${color}`}>
        {value}
      </div>

      <p className="mt-1 text-xs font-semibold text-slate-500">
        {label}
      </p>

    </div>
  );
}


/* =========================================================
   MINI STAT
========================================================= */

function MiniStat({
  value,
  label,
  green = false,
  red = false,
}: {
  value: number;
  label: string;
  green?: boolean;
  red?: boolean;
}) {

  const color = red
    ? "text-red-600"
    : green
      ? "text-green-600"
      : "text-blue-600";

  return (
    <div className="rounded-xl bg-slate-50 p-3 text-center">

      <div className={`text-xl font-black ${color}`}>
        {value}
      </div>

      <div className="mt-0.5 text-xs font-medium text-slate-500">
        {label}
      </div>

    </div>
  );
}


/* =========================================================
   SKILL BOX
========================================================= */

function SkillBox({
  title,
  skills,
  type,
  emptyText,
}: {
  title: string;
  skills: string[];
  type: "green" | "red";
  emptyText: string;
}) {

  const styles =
    type === "green"
      ? "border-green-200 bg-green-50 text-green-700"
      : "border-red-200 bg-red-50 text-red-700";

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between gap-3">

        <h3 className="text-xl font-bold">
          {title}
        </h3>

        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">
          {skills.length}
        </span>

      </div>


      {skills.length > 0 ? (

        <div className="mt-4 flex max-h-44 flex-wrap gap-2 overflow-y-auto pr-1">

          {skills.map((skill, index) => (

            <span
              key={index}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${styles}`}
            >
              {skill}
            </span>

          ))}

        </div>

      ) : (

        <p className="mt-4 text-sm text-slate-500">
          {emptyText}
        </p>

      )}

    </div>
  );
}


/* =========================================================
   RESULT BOX
========================================================= */

function ResultBox({
  title,
  items,
  type,
}: {
  title: string;
  items: string[];
  type: "green" | "blue";
}) {

  const styles =
    type === "green"
      ? "border-green-200 bg-green-50"
      : "border-blue-200 bg-blue-50";

  return (
    <div className={`rounded-3xl border p-6 shadow-sm ${styles}`}>

      <h3 className="text-xl font-bold">
        {title}
      </h3>

      {items.length > 0 ? (

        <div className="mt-4 grid gap-2">

          {items.map((item, index) => (

            <div
              key={index}
              className="rounded-xl border border-white bg-white p-3 text-sm leading-5 text-slate-700"
            >
              {item}
            </div>

          ))}

        </div>

      ) : (

        <p className="mt-4 text-sm text-slate-500">
          Nothing to report.
        </p>

      )}

    </div>
  );
}


/* =========================================================
   SCORE HELPERS
========================================================= */

function getScoreBarColor(score: number) {

  if (score >= 80) {
    return "bg-green-500";
  }

  if (score >= 60) {
    return "bg-blue-600";
  }

  if (score >= 40) {
    return "bg-orange-500";
  }

  return "bg-red-500";
}


function getMatchColor(score: number) {

  if (score >= 80) {
    return "text-green-600";
  }

  if (score >= 60) {
    return "text-blue-600";
  }

  if (score >= 40) {
    return "text-orange-500";
  }

  return "text-red-600";
}


function getMatchLabel(score: number) {

  if (score >= 80) {
    return "Excellent Match";
  }

  if (score >= 60) {
    return "Good Match";
  }

  if (score >= 40) {
    return "Moderate Match";
  }

  return "Low Match";
}