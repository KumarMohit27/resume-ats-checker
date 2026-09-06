"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">

      {/* ================= NAVBAR ================= */}
      <nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">

          {/* Logo */}
          <Link href="/" className="text-2xl font-extrabold tracking-tight">
            <span className="text-slate-900">Resume</span>
            <span className="text-blue-600">Score</span>
          </Link>

          {/* Navigation */}
          <div className="hidden items-center gap-9 md:flex">
            <a
              href="#home"
              className="font-medium text-blue-600"
            >
              Home
            </a>

            <Link
              href="/analyzer"
              className="font-medium text-slate-600 transition hover:text-blue-600"
            >
              Analyzer
            </Link>

            <a
              href="#features"
              className="font-medium text-slate-600 transition hover:text-blue-600"
            >
              Features
            </a>

            <a
              href="#about"
              className="font-medium text-slate-600 transition hover:text-blue-600"
            >
              About
            </a>
          </div>

          {/* Developer Profile */}
          {/* Developer Profile */}

<div className="relative">

  {/* Message + Arrow */}
  <div className="absolute right-full top-1/2 mr-4 hidden -translate-y-1/2 items-center md:flex">

    {/* Message */}
    <div className="animate-[float_3s_ease-in-out_infinite] rounded-xl bg-blue-600 px-4 py-2 text-center text-xs font-bold leading-4 text-white shadow-lg shadow-blue-600/25">
      Click here to view
      <br />
      developer
    </div>

    {/* Arrow */}
    <svg
      className="h-12 w-14 text-blue-600"
      viewBox="0 0 100 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 35 C35 35, 55 35, 80 20"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
      />

      <path
        d="M65 18 L82 18 L76 34"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>

  </div>


  {/* Clickable Profile */}

  <Link
    href="/about-me"
    className="group flex items-center gap-3 rounded-xl px-2 py-1 transition hover:bg-blue-50"
  >

    {/* Photo */}
    <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-white bg-slate-100 shadow-md ring-1 ring-slate-200 transition duration-300 group-hover:scale-105 group-hover:ring-blue-400">

      <img
        src="/profile.jpeg"
        alt="Kumar Mohit"
        className="h-full w-full object-cover object-top"
      />

    </div>


    {/* Name */}
    <div className="hidden leading-tight sm:block">

      <p className="text-xs font-medium text-slate-500">
        Made by
      </p>

      <p className="text-sm font-bold text-blue-600">
        KUMAR MOHIT
      </p>

    </div>

  </Link>

</div>
        </div>
      </nav>


      {/* ================= HERO ================= */}
      <section
        id="home"
        className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/50 to-indigo-50/70"
      >

        {/* Background decorations */}
        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-blue-200/20 blur-3xl" />
        <div className="absolute right-0 top-10 h-96 w-96 rounded-full bg-indigo-200/30 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">

          {/* LEFT SIDE */}
          <div>

            {/* Badge */}
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-5 py-2.5 text-sm font-semibold text-blue-600">
              <span>✦</span>
              AI-Powered Resume Analysis
            </div>

            {/* Heading */}
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
  Build a Stronger Resume.
  <span className="block text-blue-600">Get Hired.</span>
</h1>

            {/* Description */}
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl">
              Check your ATS score, find missing keywords, get personalized
              suggestions and make your resume stand out from the competition.
            </p>

            {/* Buttons */}
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">

              <Link
                href="/analyzer"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-blue-600/25 transition hover:-translate-y-1 hover:bg-blue-700 hover:shadow-xl"
              >
                <span className="text-xl">↑</span>
                Analyze Your Resume
                <span className="transition group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-8 py-4 text-base font-bold text-slate-700 transition hover:-translate-y-1 hover:border-blue-300 hover:text-blue-600"
              >
                Learn More
              </a>

            </div>

            {/* Trust points */}
            <div className="mt-9 flex flex-wrap gap-x-7 gap-y-4 text-sm font-medium text-slate-600">

              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  ✓
                </span>
                Free to use
              </div>

              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                  ⚡
                </span>
                Fast & Accurate
              </div>

              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  ✓
                </span>
                100% Secure
              </div>

            </div>
          </div>


          {/* RIGHT SIDE - PREVIEW DASHBOARD */}
          <div className="relative">

            {/* Glow */}
            <div className="absolute inset-8 rounded-full bg-blue-300/30 blur-3xl" />

            {/* Dashboard */}
            <div className="relative rounded-3xl border border-white/80 bg-white/85 p-5 shadow-2xl shadow-blue-900/10 backdrop-blur-xl sm:p-7">

              <div className="grid gap-4 sm:grid-cols-2">

                {/* ATS SCORE */}
                <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">

                  <p className="text-sm font-bold text-slate-800">
                    ATS Score
                  </p>

                  <div className="mx-auto mt-5 flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-cyan-400 to-emerald-400 p-[9px]">
                    <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-white">
                      <span className="text-4xl font-extrabold text-slate-900">
                        87
                      </span>
                      <span className="text-sm font-medium text-slate-500">
                        /100
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 text-center font-bold text-emerald-500">
                    Excellent
                  </p>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-[87%] rounded-full bg-gradient-to-r from-blue-500 to-emerald-400" />
                  </div>

                </div>


                {/* JOB MATCH */}
                <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">

                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                      🎯
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        Job Match
                      </p>
                      <p className="text-xs text-slate-500">
                        Your compatibility
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <span className="text-4xl font-extrabold text-blue-600">
                      92
                    </span>
                    <span className="ml-1 text-sm font-semibold text-slate-500">
                      /100
                    </span>
                  </div>

                  <p className="mt-1 font-bold text-emerald-500">
                    Great Match
                  </p>

                  <div className="mt-5 space-y-2">

                    <div className="flex items-center justify-between rounded-xl bg-blue-50 px-3 py-2 text-xs">
                      <span className="text-slate-600">
                        Required Skills
                      </span>
                      <span className="font-bold text-blue-600">
                        12
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2 text-xs">
                      <span className="text-slate-600">
                        Matched Skills
                      </span>
                      <span className="font-bold text-emerald-600">
                        10
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-red-50 px-3 py-2 text-xs">
                      <span className="text-slate-600">
                        Missing Skills
                      </span>
                      <span className="font-bold text-red-500">
                        2
                      </span>
                    </div>

                  </div>
                </div>

              </div>


              {/* KEY INSIGHTS */}
              <div className="mt-4 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-xl">
                    💡
                  </div>

                  <p className="font-bold text-slate-800">
                    Key Insights
                  </p>
                </div>

                <div className="mt-4 space-y-3 text-sm">

                  <div className="flex items-center gap-3">
                    <span className="text-emerald-500">✓</span>
                    <span className="text-slate-600">
                      Strong keyword optimization
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-emerald-500">✓</span>
                    <span className="text-slate-600">
                      Good section coverage
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-amber-500">⚠</span>
                    <span className="text-slate-600">
                      Add more quantified achievements
                    </span>
                  </div>

                </div>
              </div>


              {/* File badges */}
              <div className="absolute -right-5 top-20 hidden flex-col gap-3 sm:flex">

                <div className="rounded-xl bg-red-500 px-3 py-2 text-xs font-bold text-white shadow-lg">
                  PDF
                </div>

                <div className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white shadow-lg">
                  DOCX
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>


      {/* ================= FEATURES ================= */}
      <section
        id="features"
        className="bg-white px-6 py-20 lg:px-8 lg:py-28"
      >

        <div className="mx-auto max-w-7xl">

          {/* Section heading */}
          <div className="mx-auto max-w-3xl text-center">

            <div className="mb-5 inline-flex rounded-full bg-blue-50 px-5 py-2 text-sm font-semibold text-blue-600">
              Why Choose ResumeScore?
            </div>

            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Everything You Need to Get Noticed
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-500">
              Powerful resume analysis to help you create an ATS-friendly
              resume and improve your chances of landing interviews.
            </p>

          </div>


          {/* Feature cards */}
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">

            <FeatureCard
              icon="🎯"
              title="ATS Score Analysis"
              description="Get your overall ATS score and understand how well your resume performs."
              iconStyle="blue"
            />

            <FeatureCard
              icon="🔍"
              title="Keyword Matching"
              description="Find matched and missing keywords from your target job description."
              iconStyle="green"
            />

            <FeatureCard
              icon="📄"
              title="Detailed Breakdown"
              description="See how each section, skill and factor contributes to your score."
              iconStyle="purple"
            />

            <FeatureCard
              icon="💡"
              title="Smart Suggestions"
              description="Get personalized tips to improve your resume and increase your chances."
              iconStyle="orange"
            />

            <FeatureCard
              icon="🛡️"
              title="Job Match Score"
              description="Compare your skills with job requirements and see your match percentage."
              iconStyle="cyan"
            />

          </div>
        </div>
      </section>


      {/* ================= HOW IT WORKS ================= */}
      <section
        id="about"
        className="bg-gradient-to-b from-white to-blue-50 px-6 py-20 lg:px-8 lg:py-24"
      >

        <div className="mx-auto max-w-6xl">

          <div className="mx-auto max-w-2xl text-center">

            <div className="mb-5 inline-flex rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-blue-600">
              Simple & Easy
            </div>

            <h2 className="text-4xl font-extrabold text-slate-900">
              Analyze Your Resume in 3 Steps
            </h2>

            <p className="mt-4 text-slate-500">
              No complicated setup. Upload your resume and get actionable
              insights within seconds.
            </p>

          </div>


          <div className="mt-14 grid gap-6 md:grid-cols-3">

            <StepCard
              number="01"
              title="Upload Resume"
              description="Upload your PDF or DOCX resume to ResumeScore."
            />

            <StepCard
              number="02"
              title="Add Job Details"
              description="Choose your career field and optionally add a job description."
            />

            <StepCard
              number="03"
              title="Get Your Score"
              description="Receive your ATS score, job match, keywords and improvement suggestions."
            />

          </div>


          <div className="mt-14 text-center">

            <Link
              href="/analyzer"
              className="inline-flex items-center gap-3 rounded-full bg-blue-600 px-9 py-4 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-1 hover:bg-blue-700"
            >
              Start Analyzing
              <span>→</span>
            </Link>

          </div>

        </div>
      </section>


      {/* ================= FOOTER ================= */}
      <footer className="border-t border-slate-200 bg-white">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-6 py-8 sm:flex-row lg:px-8">

          <div>
            <p className="text-lg font-extrabold">
              <span className="text-slate-900">Resume</span>
              <span className="text-blue-600">Score</span>
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Build a stronger resume. Get hired.
            </p>
          </div>


          

         

        </div>

        <div className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} ResumeScore. All rights reserved.
        </div>

      </footer>

    </main>
  );
}


/* =========================================================
   FEATURE CARD
========================================================= */

function FeatureCard({
  icon,
  title,
  description,
  iconStyle,
}: {
  icon: string;
  title: string;
  description: string;
  iconStyle: "blue" | "green" | "purple" | "orange" | "cyan";
}) {

  const styles = {
    blue: "bg-blue-50 border-blue-100",
    green: "bg-emerald-50 border-emerald-100",
    purple: "bg-purple-50 border-purple-100",
    orange: "bg-orange-50 border-orange-100",
    cyan: "bg-cyan-50 border-cyan-100",
  };

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">

      <div
        className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full border ${styles[iconStyle]} text-2xl transition group-hover:scale-110`}
      >
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-500">
        {description}
      </p>

    </div>
  );
}


/* =========================================================
   STEP CARD
========================================================= */

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {

  return (
    <div className="relative rounded-2xl border border-blue-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-sm font-extrabold text-white shadow-md shadow-blue-600/20">
        {number}
      </div>

      <h3 className="mt-6 text-xl font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-slate-500">
        {description}
      </p>

    </div>
  );
}