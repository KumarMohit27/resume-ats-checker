"use client";

import { useState } from "react";

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

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [careerField, setCareerField] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      setSelectedFile(file);
      setAnalysis(null);
    }
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
      const formData = new FormData();

      formData.append("resume", selectedFile);
      formData.append("careerField", careerField);
      formData.append("jobDescription", jobDescription);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.error || "Analysis failed.");
        return;
      }

      setAnalysis(data.analysis);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* ================= NAVBAR ================= */}

      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">

          <div className="text-2xl font-bold text-blue-600">
            ResumeScore
          </div>

          <div className="text-sm text-slate-500">
            AI Resume ATS Analyzer
          </div>

        </div>
      </nav>


      {/* ================= HERO ================= */}

      <section className="max-w-5xl mx-auto px-6 pt-16 pb-10 text-center">

        <h1 className="text-5xl font-bold tracking-tight">
          Check your resume&apos;s ATS score
        </h1>

        <p className="mt-5 text-lg text-slate-600">
          Upload your resume and discover how well it matches your target
          career.
        </p>


        {/* ================= UPLOAD BOX ================= */}

        <div className="mt-10 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">

          <label
            htmlFor="resume-upload"
            className="block cursor-pointer border-2 border-dashed border-slate-300 rounded-2xl p-10 hover:border-blue-500 transition"
          >

            <div className="text-4xl mb-4">
              📄
            </div>

            <div className="text-lg font-semibold">
              Upload your resume
            </div>

            <div className="text-sm text-slate-500 mt-2">
              PDF or DOCX
            </div>

            <input
              id="resume-upload"
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              className="hidden"
            />

          </label>


          {/* SELECTED FILE */}

          {selectedFile && (
            <div className="mt-5 bg-blue-50 border border-blue-200 rounded-xl p-4 text-blue-700">
              📄 {selectedFile.name}
            </div>
          )}


          {/* ================= CAREER FIELD ================= */}

          <div className="mt-6 text-left">

            <label className="block font-semibold mb-2">
              Target Career Field
            </label>

            <select
              value={careerField}
              onChange={(e) => setCareerField(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
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


          {/* ================= JOB DESCRIPTION ================= */}

          <div className="mt-6 text-left">

            <label className="block font-semibold mb-2">

              Job Description

              <span className="text-slate-400 font-normal ml-2">
                (Optional)
              </span>

            </label>


            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              rows={7}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />


            <p className="text-sm text-slate-500 mt-2">
              Add a job description to compare your resume with the job
              requirements.
            </p>

          </div>


          {/* ================= ANALYZE BUTTON ================= */}

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-4 rounded-xl transition"
          >

            {loading
              ? "Analyzing Resume..."
              : "Analyze My Resume"}

          </button>

        </div>

      </section>


      {/* ================= RESULTS ================= */}

      {analysis && (

        <section className="max-w-6xl mx-auto px-6 pb-20">


          {/* ================= ATS SCORE ================= */}

          <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center shadow-sm">

            <div className="text-sm uppercase tracking-wider text-slate-500 font-semibold">
              ATS Score
            </div>

            <div className="mt-3">

              <span className="text-7xl font-bold text-blue-600">
                {analysis.score}
              </span>

              <span className="text-3xl text-slate-400">
                /100
              </span>

            </div>

            <div className="text-2xl font-bold mt-3">
              {analysis.rating}
            </div>

            <div className="text-slate-500 mt-2">
              Target field: {analysis.careerField}
            </div>

          </div>


          {/* ================= SCORE BREAKDOWN ================= */}

          <div className="bg-white border border-slate-200 rounded-3xl p-8 mt-6">

            <h2 className="text-2xl font-bold mb-8">
              📊 Score Breakdown
            </h2>

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
              label="Quantifiable Achievements"
              value={analysis.breakdown.quantification}
              max={5}
            />

            <ScoreBar
              label="Resume Length"
              value={analysis.breakdown.length}
              max={5}
            />

          </div>


          {/* ================================================= */}
          {/* JOB MATCH SCORE                                   */}
          {/* ================================================= */}

          {jobDescription.trim() !== "" && analysis.jobMatch && (

            <div className="bg-white border border-slate-200 rounded-3xl p-8 mt-6">

              {/* JOB MATCH HEADER */}

              <div className="text-center">

                <div className="text-sm uppercase tracking-wider text-slate-500 font-semibold">
                  Resume vs Job Description
                </div>

                <h2 className="text-3xl font-bold mt-2">
                  🎯 Job Match Score
                </h2>

                <div className="mt-5">

                  <span className="text-6xl font-bold text-blue-600">
                    {analysis.jobMatch.score}
                  </span>

                  <span className="text-2xl text-slate-400">
                    /100
                  </span>

                </div>

                <p className="text-slate-500 mt-2">
                  How closely your resume matches the job description
                </p>

              </div>


              {/* MATCHED SKILLS */}

              <div className="mt-10">

                <h3 className="text-xl font-bold mb-4">
                  ✅ Matched Job Skills
                </h3>


                {analysis.jobMatch.matchedSkills.length > 0 ? (

                  <div className="flex flex-wrap gap-3">

                    {analysis.jobMatch.matchedSkills.map(
                      (skill, index) => (

                        <span
                          key={index}
                          className="px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-full"
                        >
                          ✓ {skill}
                        </span>

                      )
                    )}

                  </div>

                ) : (

                  <p className="text-slate-500">
                    No matching skills were detected.
                  </p>

                )}

              </div>


              {/* MISSING SKILLS */}

              <div className="mt-10">

                <h3 className="text-xl font-bold mb-4">
                  ⚠️ Missing Job Skills
                </h3>


                {analysis.jobMatch.missingSkills.length > 0 ? (

                  <div className="flex flex-wrap gap-3">

                    {analysis.jobMatch.missingSkills.map(
                      (skill, index) => (

                        <span
                          key={index}
                          className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-full"
                        >
                          {skill}
                        </span>

                      )
                    )}

                  </div>

                ) : (

                  <p className="text-green-600">
                    🎉 Your resume contains all detected skills from this
                    job description.
                  </p>

                )}

              </div>


              {/* JOB MATCH STATISTICS */}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">


                <div className="bg-slate-50 rounded-2xl p-6 text-center">

                  <div className="text-3xl font-bold">
                    {analysis.jobMatch.requiredSkills.length}
                  </div>

                  <div className="text-slate-500 mt-2">
                    Skills Required
                  </div>

                </div>


                <div className="bg-green-50 rounded-2xl p-6 text-center">

                  <div className="text-3xl font-bold text-green-600">
                    {analysis.jobMatch.matchedSkills.length}
                  </div>

                  <div className="text-slate-500 mt-2">
                    Skills Matched
                  </div>

                </div>


                <div className="bg-red-50 rounded-2xl p-6 text-center">

                  <div className="text-3xl font-bold text-red-600">
                    {analysis.jobMatch.missingSkills.length}
                  </div>

                  <div className="text-slate-500 mt-2">
                    Skills Missing
                  </div>

                </div>

              </div>

            </div>

          )}


          {/* ================= QUICK STATS ================= */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">

            <StatCard
              value={analysis.wordCount}
              label="Words"
            />


            <div className="bg-white border border-slate-200 rounded-2xl p-6 min-h-[160px]">

              <div className="flex flex-wrap gap-2 justify-center max-h-[95px] overflow-y-auto">

                {analysis.matchedKeywords.length > 0 ? (

                  analysis.matchedKeywords.map(
                    (keyword, index) => (

                      <span
                        key={index}
                        className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-sm"
                      >
                        {keyword}
                      </span>

                    )
                  )

                ) : (

                  <span className="text-slate-400">
                    No matching keywords
                  </span>

                )}

              </div>

              <div className="text-slate-500 text-center mt-4">
                Keywords Found
              </div>

            </div>


            <StatCard
              value={analysis.totalKeywords}
              label="Keywords Checked"
            />

          </div>


          {/* ================= MATCHING SKILLS ================= */}

          <div className="bg-white border border-slate-200 rounded-3xl p-8 mt-6">

            <h2 className="text-2xl font-bold mb-5">
              ✅ Matching Skills
            </h2>


            <div className="flex flex-wrap gap-3">

              {analysis.matchedKeywords.map(
                (keyword, index) => (

                  <span
                    key={index}
                    className="px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-full"
                  >
                    ✓ {keyword}
                  </span>

                )
              )}

            </div>

          </div>


          {/* ================= MISSING KEYWORDS ================= */}

          <div className="bg-white border border-slate-200 rounded-3xl p-8 mt-6">

            <h2 className="text-2xl font-bold mb-5">
              ⚠️ Missing Relevant Skills
            </h2>


            {analysis.missingKeywords.length > 0 ? (

              <div className="flex flex-wrap gap-3">

                {analysis.missingKeywords.map(
                  (keyword, index) => (

                    <span
                      key={index}
                      className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-full"
                    >
                      {keyword}
                    </span>

                  )
                )}

              </div>

            ) : (

              <p className="text-green-600">
                Excellent! No relevant skills are missing.
              </p>

            )}


            <p className="text-sm text-slate-500 mt-5">
              Only add skills that you genuinely know or have experience
              with.
            </p>

          </div>


          {/* ================= STRENGTHS ================= */}

          <ResultSection
            title="💪 Strengths"
            items={analysis.strengths}
            type="success"
          />


          {/* ================= IMPROVEMENTS ================= */}

          <ResultSection
            title="💡 Improvement Suggestions"
            items={analysis.improvements}
            type="info"
          />


          {/* ================= WARNINGS ================= */}

          <ResultSection
            title="⚠️ Warnings"
            items={analysis.warnings}
            type="warning"
          />


          {/* ================= RESUME SECTIONS ================= */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">


            <div className="bg-white border border-slate-200 rounded-3xl p-8">

              <h2 className="text-2xl font-bold mb-5">
                📑 Resume Sections
              </h2>


              <div className="space-y-3">

                {analysis.sections.map(
                  (section, index) => (

                    <div
                      key={index}
                      className="flex items-center gap-3 text-green-700"
                    >

                      <span>
                        ✓
                      </span>

                      <span className="capitalize">
                        {section}
                      </span>

                    </div>

                  )
                )}

              </div>

            </div>


            <div className="bg-white border border-slate-200 rounded-3xl p-8">

              <h2 className="text-2xl font-bold mb-5">
                📌 Missing Sections
              </h2>


              {analysis.missingSections.length > 0 ? (

                <div className="space-y-3">

                  {analysis.missingSections.map(
                    (section, index) => (

                      <div
                        key={index}
                        className="flex items-center gap-3 text-red-600"
                      >

                        <span>
                          ✗
                        </span>

                        <span className="capitalize">
                          {section}
                        </span>

                      </div>

                    )
                  )}

                </div>

              ) : (

                <p className="text-green-600">
                  All important sections are present.
                </p>

              )}

            </div>

          </div>


          {/* ================= ACTION VERBS ================= */}

          <div className="bg-white border border-slate-200 rounded-3xl p-8 mt-6">

            <h2 className="text-2xl font-bold mb-5">
              🚀 Action Verbs Detected
            </h2>


            <div className="flex flex-wrap gap-3">

              {analysis.detectedActionVerbs.length > 0 ? (

                analysis.detectedActionVerbs.map(
                  (verb, index) => (

                    <span
                      key={index}
                      className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-full"
                    >
                      {verb}
                    </span>

                  )
                )

              ) : (

                <p className="text-slate-500">
                  No strong action verbs detected.
                </p>

              )}

            </div>

          </div>


          {/* ================= ACHIEVEMENTS ================= */}

          <div className="bg-white border border-slate-200 rounded-3xl p-8 mt-6">

            <h2 className="text-2xl font-bold mb-5">
              📈 Quantifiable Achievements
            </h2>


            {analysis.hasQuantifiableAchievements ? (

              <p className="text-green-600">
                ✓ Your resume contains measurable information.
              </p>

            ) : (

              <p className="text-orange-600">
                Consider adding measurable results such as percentages,
                accuracy, users, performance improvements, or numbers.
              </p>

            )}

          </div>


        </section>

      )}

    </main>
  );
}


/* ================================================= */
/* SCORE BAR                                          */
/* ================================================= */

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
    Math.round((value / max) * 100)
  );

  return (

    <div className="mb-7">

      <div className="flex justify-between mb-2">

        <span className="font-medium">
          {label}
        </span>

        <span className="font-bold">
          {value}/{max}
        </span>

      </div>


      <div className="h-4 bg-slate-200 rounded-full overflow-hidden">

        <div
          className="h-full bg-blue-600 rounded-full transition-all"
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

    </div>

  );
}


/* ================================================= */
/* STAT CARD                                          */
/* ================================================= */

function StatCard({
  value,
  label,
}: {
  value: number;
  label: string;
}) {

  return (

    <div className="bg-white border border-slate-200 rounded-2xl p-6 min-h-[160px] flex flex-col justify-center text-center">

      <div className="text-4xl font-bold">
        {value}
      </div>

      <div className="text-slate-500 mt-2">
        {label}
      </div>

    </div>

  );
}


/* ================================================= */
/* RESULT SECTION                                     */
/* ================================================= */

function ResultSection({
  title,
  items,
  type,
}: {
  title: string;
  items: string[];
  type: "success" | "info" | "warning";
}) {

  const styles = {
    success: "bg-green-50 border-green-200",
    info: "bg-blue-50 border-blue-200",
    warning: "bg-orange-50 border-orange-200",
  };

  return (

    <div
      className={`border rounded-3xl p-8 mt-6 ${styles[type]}`}
    >

      <h2 className="text-2xl font-bold mb-5">
        {title}
      </h2>


      {items.length > 0 ? (

        <div className="space-y-3">

          {items.map((item, index) => (

            <div
              key={index}
              className="bg-white rounded-xl p-4 border border-slate-200"
            >
              {item}
            </div>

          ))}

        </div>

      ) : (

        <p className="text-slate-500">
          Nothing to report.
        </p>

      )}

    </div>

  );
}