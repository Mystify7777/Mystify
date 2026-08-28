"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { getProjects, getRegistryCounts } from "@/data/registry/store";
import {
  CATEGORY_INTEGRITY,
  getCategoryIntegrityExamples,
  getRecruiterQuickSignals,
  RECRUITER_CREDENTIALS,
  RECRUITER_IDENTITY,
} from "@/features/recruiter/recruiter-content";

const RESUME_PATH = "/resume.pdf";

export function RecruiterEvidenceCard() {
  const [showExplanation, setShowExplanation] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const counts = getRegistryCounts();
  const examples = useMemo(() => getCategoryIntegrityExamples(getProjects()), []);

  return (
    <div className="w-full max-w-5xl space-y-5">
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]"
      >
        <div className="rounded-3xl border border-white/10 bg-observatory-panel p-6 shadow-2xl sm:p-8">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-observatory-muted">
            Evidence Card
          </p>
          <h1 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
            {RECRUITER_IDENTITY.name}
          </h1>
          <p className="mt-2 text-sm text-observatory-muted">
            {RECRUITER_IDENTITY.role}
          </p>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-observatory-ink sm:text-xl">
            {RECRUITER_IDENTITY.thesis}
          </p>

          <div className="mt-6 rounded-2xl border border-observatory-amber/20 bg-observatory-amber/5 p-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-observatory-muted">
              Engineering identity
            </p>
            <p className="mt-2 text-base font-medium text-observatory-ink">
              {RECRUITER_IDENTITY.engineeringIdentity}
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {RECRUITER_CREDENTIALS.map((credential) => (
              <div key={credential.label} className="rounded-2xl border border-white/10 p-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-observatory-muted">
                  {credential.label}
                </p>
                <p className="mt-2 text-sm leading-6 text-observatory-ink">
                  {credential.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={RESUME_PATH}
              download
              className="rounded-xl bg-observatory-amber px-4 py-2 font-mono text-xs text-black transition duration-observatory hover:brightness-110"
            >
              Resume
            </a>
            <button
              type="button"
              onClick={() => setContactOpen((current) => !current)}
              aria-expanded={contactOpen}
              className="rounded-xl border border-white/10 px-4 py-2 font-mono text-xs text-observatory-ink transition duration-observatory hover:bg-white/5"
            >
              Contact
            </button>
          </div>

          {contactOpen ? (
            <div className="mt-4 rounded-2xl border border-white/10 p-4">
              <p className="text-sm text-observatory-ink">Start a conversation.</p>
              <p className="mt-2 text-xs leading-5 text-observatory-muted">
                Contact delivery is not configured yet. The contact surface is kept
                intentionally minimal until a delivery path exists.
              </p>
            </div>
          ) : null}
        </div>

        <div className="rounded-3xl border border-white/10 bg-observatory-panel p-6 shadow-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-observatory-muted">
            Quick signals
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {getRecruiterQuickSignals(counts).map((signal) => (
              <div key={signal.label} className="rounded-2xl border border-white/10 p-4">
                <p className="text-2xl font-medium tracking-tight">{signal.value}</p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-observatory-muted">
                  {signal.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 p-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-observatory-muted">
              {CATEGORY_INTEGRITY.title}
            </p>
            <p className="mt-2 text-sm leading-6 text-observatory-ink">
              {CATEGORY_INTEGRITY.statement}
            </p>
          </div>
        </div>
      </motion.section>

      <section className="rounded-3xl border border-white/10 bg-observatory-panel p-6 shadow-2xl sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-observatory-muted">
              Why this emerged
            </p>
            <h2 className="mt-2 text-xl font-medium">Cross-project signal</h2>
          </div>
          <button
            type="button"
            aria-expanded={showExplanation}
            onClick={() => setShowExplanation((current) => !current)}
            className="rounded-xl border border-white/10 px-4 py-2 font-mono text-xs text-observatory-muted transition duration-observatory hover:bg-white/5 hover:text-observatory-ink"
          >
            See why this emerged →
          </button>
        </div>

        {showExplanation ? (
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {examples.length > 0 ? (
              examples.map((example) => (
                <article key={example.projectId} className="rounded-2xl border border-white/10 p-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-observatory-muted">
                    {example.projectName}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-observatory-ink">
                    {example.thesis}
                  </p>
                  <p className="mt-3 text-xs text-observatory-muted">
                    {example.engineeringIdentity}
                  </p>
                </article>
              ))
            ) : (
              <p className="rounded-2xl border border-white/10 p-4 text-xs leading-5 text-observatory-muted md:col-span-3">
                No cross-project evidence is currently registered.
              </p>
            )}
          </div>
        ) : null}

        {showExplanation ? (
          <p className="mt-5 text-xs leading-5 text-observatory-muted">
            The pattern is derived from the project theses and engineering identities
            represented in the canonical registry. Deeper evidence belongs to
            Engineer Mode.
          </p>
        ) : null}
      </section>
    </div>
  );
}
