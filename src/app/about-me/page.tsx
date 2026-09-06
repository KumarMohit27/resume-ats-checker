"use client";

import Link from "next/link";

export default function AboutMe() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 text-slate-900">

      {/* ================= NAVBAR ================= */}
      <nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">

          {/* Logo */}
          <Link href="/" className="text-2xl font-extrabold tracking-tight">
            <span className="text-slate-900">Resume</span>
            <span className="text-blue-600">Score</span>
          </Link>

          {/* Navigation */}
          <div className="hidden items-center gap-8 md:flex">

            <Link
              href="/"
              className="font-medium text-slate-600 transition hover:text-blue-600"
            >
              Home
            </Link>

            <Link
              href="/analyzer"
              className="font-medium text-slate-600 transition hover:text-blue-600"
            >
              Analyzer
            </Link>

            <a
              href="/#features"
              className="font-medium text-slate-600 transition hover:text-blue-600"
            >
              Features
            </a>

            <span className="font-semibold text-blue-600">
              About Me
            </span>

          </div>

          {/* Profile */}
          <div className="flex items-center gap-3">

            <div className="h-11 w-11 overflow-hidden rounded-full border-2 border-white bg-slate-100 shadow-md ring-1 ring-slate-200">
              <img
                src="/profile.jpeg"
                alt="Kumar Mohit"
                className="h-full w-full object-cover object-top"
              />
            </div>

            <div className="hidden leading-tight sm:block">
              <p className="text-xs font-medium text-slate-500">
                Made by
              </p>

              <p className="text-sm font-bold text-blue-600">
                KUMAR MOHIT
              </p>
            </div>

          </div>

        </div>
      </nav>


      {/* ================= MAIN PROFILE ================= */}
      <section className="px-6 py-16 sm:py-20 lg:px-8 lg:py-24">

        <div className="mx-auto max-w-5xl">

          {/* Back */}
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
          >
            ← Back to Home
          </Link>


          {/* Profile Card */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-blue-900/5">

            {/* Top gradient */}
            <div className="h-36 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 sm:h-44" />

            {/* Profile content */}
            <div className="px-6 pb-10 sm:px-10 lg:px-14">

              {/* Photo */}
              <div className="-mt-16 flex justify-center sm:-mt-20 sm:justify-start">

                <div className="h-32 w-32 overflow-hidden rounded-full border-8 border-white bg-slate-100 shadow-xl sm:h-40 sm:w-40">

                  <img
                    src="/profile.jpeg"
                    alt="Kumar Mohit"
                    className="h-full w-full object-cover object-top"
                  />

                </div>

              </div>


              {/* Name */}
              <div className="mt-6 text-center sm:text-left">

                <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                  About Me
                </p>

                <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                  Kumar Mohit
                </h1>

                <p className="mt-3 text-lg font-medium text-slate-500">
                  B.Tech — Artificial Intelligence & Machine Learning
                </p>

              </div>


              {/* Divider */}
              <div className="my-8 h-px bg-slate-200" />


              {/* Introduction */}
              <div>

                <h2 className="text-2xl font-extrabold text-slate-900">
                  Introduction
                </h2>

                <p className="mt-4 text-base leading-8 text-slate-600 sm:text-lg">
                  Fourth-year B.Tech student specializing in Artificial
                  Intelligence and Machine Learning at the University School
                  of Automation and Robotics. Passionate about Frontend
                  Development and Machine Learning, with a strong foundation
                  in Data Structures and Algorithms, Python, and C++.
                  Experienced in developing problem-solving skills through DSA
                  and building practical projects in AI and web technologies.
                  A quick learner with strong analytical, communication, and
                  teamwork abilities, eager to contribute to innovative
                  software development and data-driven solutions while
                  continuously expanding technical expertise.
                </p>

              </div>


              {/* Skills */}
              <div className="mt-10">

                <h2 className="text-2xl font-extrabold text-slate-900">
                  Areas of Interest
                </h2>

                <div className="mt-5 flex flex-wrap gap-3">

                  <SkillTag text="Artificial Intelligence" />
                  <SkillTag text="Machine Learning" />
                  <SkillTag text="Frontend Development" />
                  <SkillTag text="Data Structures & Algorithms" />
                  <SkillTag text="Python" />
                  <SkillTag text="C++" />
                  <SkillTag text="Web Technologies" />

                </div>

              </div>


              {/* Social Profiles */}
              <div className="mt-12">

                <h2 className="text-2xl font-extrabold text-slate-900">
                  Connect With Me
                </h2>

                <p className="mt-2 text-slate-500">
                  Feel free to connect with me through my professional and
                  social profiles.
                </p>


                <div className="mt-6 grid gap-4 sm:grid-cols-3">

                  {/* GitHub */}
                  <a
                    href="https://github.com/KumarMohit27"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:bg-white hover:shadow-lg"
                  >

                    <div className="flex items-center gap-4">

                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-xl text-white">
                        ◉
                      </div>

                      <div>
                        <p className="font-bold text-slate-900">
                          GitHub
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          View my projects
                        </p>
                      </div>

                    </div>

                    <p className="mt-4 text-sm font-semibold text-blue-600 group-hover:underline">
                      KumarMohit27 →
                    </p>

                  </a>


                  {/* LinkedIn */}
                  <a
                    href="https://www.linkedin.com/in/kumar-mohit-148b66292/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-2xl border border-blue-100 bg-blue-50/50 p-5 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg"
                  >

                    <div className="flex items-center gap-4">

                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-lg font-extrabold text-white">
                        in
                      </div>

                      <div>
                        <p className="font-bold text-slate-900">
                          LinkedIn
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Connect with me
                        </p>
                      </div>

                    </div>

                    <p className="mt-4 text-sm font-semibold text-blue-600 group-hover:underline">
                      View Profile →
                    </p>

                  </a>


                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/Kumar_Mohit_27/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-2xl border border-pink-100 bg-pink-50/50 p-5 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg"
                  >

                    <div className="flex items-center gap-4">

                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-xl font-bold text-white">
                        ◎
                      </div>

                      <div>
                        <p className="font-bold text-slate-900">
                          Instagram
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Follow me
                        </p>
                      </div>

                    </div>

                    <p className="mt-4 text-sm font-semibold text-blue-600 group-hover:underline">
                      @Kumar_Mohit_27 →
                    </p>

                  </a>

                </div>

              </div>


              {/* Back / Analyzer */}
              <div className="mt-12 flex flex-col gap-4 sm:flex-row">

                <Link
                  href="/analyzer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-3.5 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-1 hover:bg-blue-700"
                >
                  Analyze Your Resume
                  <span>→</span>
                </Link>

                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-7 py-3.5 font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-600"
                >
                  ← Back to Home
                </Link>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= FOOTER ================= */}
      <footer className="border-t border-slate-200 bg-white">

        <div className="mx-auto max-w-7xl px-6 py-8 text-center lg:px-8">

          <p className="text-lg font-extrabold">
            <span className="text-slate-900">Resume</span>
            <span className="text-blue-600">Score</span>
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Build a stronger resume. Get hired.
          </p>

        </div>

        <div className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} ResumeScore. All rights reserved.
        </div>

      </footer>

    </main>
  );
}


/* ================= SKILL TAG ================= */

function SkillTag({ text }: { text: string }) {
  return (
    <span className="rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
      {text}
    </span>
  );
}