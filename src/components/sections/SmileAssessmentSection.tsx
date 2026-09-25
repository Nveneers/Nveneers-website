"use client";

import { useEffect, useRef, useState } from "react";
import { readStorage, writeStorage } from "@/lib/browserStorage";

const COUNTRY_CODES = [
  { code: "+964", label: "🇮🇶 +964" },
  { code: "+962", label: "🇯🇴 +962" },
  { code: "+966", label: "🇸🇦 +966" },
  { code: "+971", label: "🇦🇪 +971" },
  { code: "+961", label: "🇱🇧 +961" },
  { code: "+963", label: "🇸🇾 +963" },
  { code: "+90",  label: "🇹🇷 +90"  },
  { code: "+20",  label: "🇪🇬 +20"  },
  { code: "+44",  label: "🇬🇧 +44"  },
  { code: "+1",   label: "🇺🇸 +1"   },
];
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import type { AssessmentContent } from "@/content/home";

type SmileAssessmentSectionProps = {
  content: AssessmentContent;
  labels: {
    uploadLabel: string;
    cameraLabel: string;
    checkLabel: string;
    changePhotoLabel: string;
    validatingLabel: string;
    nameLabel: string;
    namePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    submitLabel: string;
    submittingLabel: string;
    doneTitle: string;
    doneBody: string;
    tryAgainLabel: string;
    fileSizeError: string;
    fileTypeError: string;
  };
};

type Step = "idle" | "previewing" | "validating" | "contact-form" | "submitting" | "done" | "error";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

export default function SmileAssessmentSection({
  content,
  labels
}: SmileAssessmentSectionProps) {
  const [step, setStep] = useState<Step>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+964");
  const [hardLocked, setHardLocked] = useState(false);
  const [softLocked, setSoftLocked] = useState(false);
  const [errorContact, setErrorContact] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Check hard lock on mount (2 submissions per calendar day)
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const savedDate = readStorage("smile_submit_date");
    const count = savedDate === today
      ? Number(readStorage("smile_submit_count") ?? "0")
      : 0;
    if (count >= 2) setHardLocked(true);
  }, []);

  function handleFile(file: File) {
    if (!ACCEPTED.includes(file.type)) {
      setErrorMsg(labels.fileTypeError);
      return;
    }
    if (file.size > MAX_BYTES) {
      setErrorMsg(labels.fileSizeError);
      return;
    }
    setErrorMsg("");
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
      setStep("previewing");
    };
    reader.readAsDataURL(file);
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function reset() {
    setStep("idle");
    setPreview(null);
    setErrorMsg("");
    setErrorContact(false);
    setName("");
    setPhone("");
    setCountryCode("+964");
  }

  // Step 1: AI validation
  async function validate() {
    if (!preview) return;

    // Soft rate limit: 5 AI checks per day
    const today = new Date().toISOString().slice(0, 10);
    const savedDate = readStorage("smile_validate_date");
    let count = savedDate === today
      ? Number(readStorage("smile_validate_count") ?? "0")
      : 0;
    if (count >= 5) {
      setSoftLocked(true);
      return;
    }

    setStep("validating");
    try {
      const tokenRes = await fetch("/api/challenge-token");
      if (!tokenRes.ok) {
        setErrorMsg("Our system is a little busy right now. Please contact us directly to help.");
        setErrorContact(true);
        setStep("error");
        return;
      }
      const { token } = (await tokenRes.json()) as { token: string };

      const res = await fetch("/api/validate-smile", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Challenge-Token": token },
        body: JSON.stringify({ image: preview })
      });

      // Increment counter after the API call (valid or invalid)
      count++;
      writeStorage("smile_validate_count", String(count));
      writeStorage("smile_validate_date", today);

      if (res.status === 429) {
        setErrorMsg("Our system is a little busy right now. Please wait a moment and try again.");
        setErrorContact(false);
        setStep("error");
        return;
      }
      if (!res.ok) {
        setErrorMsg("Our system is a little busy right now. Please contact us directly to help.");
        setErrorContact(true);
        setStep("error");
        return;
      }

      const data = (await res.json()) as { valid: boolean; reason: string };
      if (data.valid) {
        setStep("contact-form");
      } else {
        setErrorMsg(data.reason);
        setErrorContact(false);
        setStep("error");
      }
    } catch {
      setErrorMsg("Our system is a little busy right now. Please contact us directly to help.");
      setErrorContact(true);
      setStep("error");
    }
  }

  // Step 2: Submit name + phone + photo
  async function submitContact(e: React.FormEvent) {
    e.preventDefault();
    if (!preview || !name.trim() || !phone.trim()) return;
    setStep("submitting");
    try {
      const tokenRes = await fetch("/api/challenge-token");
      if (!tokenRes.ok) {
        setErrorMsg("Our system is a little busy right now. Please contact us directly to help.");
        setErrorContact(true);
        setStep("error");
        return;
      }
      const { token } = (await tokenRes.json()) as { token: string };

      const res = await fetch("/api/submit-smile", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Challenge-Token": token },
        body: JSON.stringify({ image: preview, name: name.trim(), phone: countryCode + phone.trim() })
      });
      if (res.status === 429) {
        setErrorMsg("Our system is a little busy right now. Please wait a moment and try again.");
        setErrorContact(false);
        setStep("error");
        return;
      }

      const data = (await res.json()) as { ok: boolean; error?: string };
      if (data.ok) {
        const today = new Date().toISOString().slice(0, 10);
        const savedDate = readStorage("smile_submit_date");
        const prevCount = savedDate === today
          ? Number(readStorage("smile_submit_count") ?? "0")
          : 0;
        const newCount = prevCount + 1;
        writeStorage("smile_submit_count", String(newCount));
        writeStorage("smile_submit_date", today);
        if (newCount >= 2) setHardLocked(true);
        setStep("done");
      } else {
        setErrorMsg("Our system is a little busy right now. Please contact us directly to help.");
        setErrorContact(true);
        setStep("error");
      }
    } catch {
      setErrorMsg("Our system is a little busy right now. Please contact us directly to help.");
      setErrorContact(true);
      setStep("error");
    }
  }

  return (
    <section id="assessment" className="section section-soft scroll-mt-24">
      <div className="container">
        <RevealOnScroll>
          <div className="card mx-auto max-w-3xl p-6 sm:p-10">
            <p className="intro-label">{content.eyebrow}</p>
            <h2 className="section-title mt-4">{content.headline}</h2>
            <p className="section-lead">{content.body}</p>

            <div className="mt-8 space-y-5">
              {/* ── HARD LOCKED (already submitted within 24h) ── */}
              {hardLocked && step !== "done" && (
                <div className="flex flex-col items-center gap-3 rounded-2xl bg-brand-success-soft px-6 py-10 text-center">
                  <svg className="h-12 w-12 text-brand-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-lg font-semibold text-brand-success">You&apos;ve already submitted a photo</p>
                  <p className="text-sm text-brand-success">Our team will be in touch with you soon. If you&apos;d like to reach us sooner, <a href="#contact" className="underline underline-offset-2 hover:text-brand-success">please contact us</a>.</p>
                </div>
              )}

              {/* ── SOFT LOCKED (3 AI checks used today) ── */}
              {!hardLocked && softLocked && (
                <div className="flex flex-col items-center gap-3 rounded-2xl bg-brand-warning-soft px-6 py-10 text-center">
                  <svg className="h-12 w-12 text-brand-warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  <p className="text-lg font-semibold text-brand-warning">Daily limit reached</p>
                  <p className="text-sm text-brand-warning">You&apos;ve used all 5 free photo checks for today. To get an assessment, <a href="#contact" className="underline underline-offset-2 hover:text-brand-warning">please contact us</a>.</p>
                </div>
              )}

              {/* ── Normal flow (only shown when not locked) ── */}
              {!hardLocked && !softLocked && <>

              {/* ── IDLE ── */}
              {step === "idle" && (
                <>
                  <input ref={fileInputRef} type="file" accept={ACCEPTED.join(",")} className="hidden" onChange={onFileChange} />
                  <input ref={cameraInputRef} type="file" accept={ACCEPTED.join(",")} capture="user" className="hidden" onChange={onFileChange} />

                  <div
                    role="button"
                    tabIndex={0}
                    aria-label={labels.uploadLabel}
                    className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-brand-border bg-brand-surface px-6 py-10 text-center transition hover:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent"
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
                    onDrop={onDrop}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <svg className="h-10 w-10 text-brand-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <p className="text-sm font-medium text-brand-heading">{labels.uploadLabel}</p>
                    <p className="text-xs text-brand-muted">JPG, PNG, WEBP · max 5 MB</p>
                  </div>

                  <button type="button" className="btn-secondary w-full" onClick={() => cameraInputRef.current?.click()}>
                    {labels.cameraLabel}
                  </button>

                  {errorMsg && <p className="text-sm text-brand-danger">{errorMsg}</p>}
                </>
              )}

              {/* ── PREVIEWING ── */}
              {step === "previewing" && preview && (
                <>
                  <div className="overflow-hidden rounded-2xl border border-brand-border bg-brand-surface">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt="Your smile preview" className="mx-auto max-h-72 w-full object-contain" />
                  </div>
                  <button type="button" className="btn-primary w-full" onClick={validate}>
                    {labels.checkLabel}
                  </button>
                  <button type="button" className="w-full text-center text-sm text-brand-muted underline underline-offset-2 hover:text-brand-heading" onClick={reset}>
                    {labels.changePhotoLabel}
                  </button>
                </>
              )}

              {/* ── VALIDATING ── */}
              {(step === "validating" || step === "submitting") && (
                <div className="flex flex-col items-center gap-4 py-8">
                  <svg className="h-10 w-10 animate-spin text-brand-accent" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  <p className="text-sm font-medium text-brand-heading">
                    {step === "validating" ? labels.validatingLabel : labels.submittingLabel}
                  </p>
                </div>
              )}

              {/* ── CONTACT FORM ── */}
              {step === "contact-form" && preview && (
                <>
                  {/* Thumbnail of approved photo */}
                  <div className="flex items-center gap-3 rounded-xl bg-brand-success-soft px-4 py-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt="Your smile" className="h-12 w-12 rounded-lg object-cover" />
                    <div>
                      <p className="text-sm font-semibold text-brand-success">Great smile photo!</p>
                      <p className="text-xs text-brand-success">Fill in your details and we&apos;ll be in touch.</p>
                    </div>
                  </div>

                  <form onSubmit={submitContact} className="space-y-4">
                    <div>
                      <label htmlFor="assessment-name" className="mb-1 block text-sm font-medium text-brand-heading">
                        {labels.nameLabel}
                      </label>
                      <input
                        id="assessment-name"
                        autoComplete="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={labels.namePlaceholder}
                        required
                        maxLength={80}
                        className="w-full rounded-xl border border-brand-border bg-brand-surface px-4 py-2.5 text-sm outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20"
                      />
                    </div>
                    <div>
                      <label htmlFor="assessment-phone" className="mb-1 block text-sm font-medium text-brand-heading">
                        {labels.phoneLabel}
                      </label>
                      <div className="flex gap-2" dir="ltr">
                        <div className="relative shrink-0">
                          <select
                            aria-label={labels.phoneLabel + " (+)"}
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            className="h-full appearance-none rounded-xl border border-brand-border bg-brand-surface py-2.5 pl-3 pr-8 text-sm text-brand-heading outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 cursor-pointer"
                          >
                            {COUNTRY_CODES.map(({ code, label }) => (
                              <option key={code} value={code}>{label}</option>
                            ))}
                          </select>
                          <svg
                            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-muted"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <input
                          id="assessment-phone"
                          autoComplete="tel-national"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder={labels.phonePlaceholder}
                          required
                          maxLength={20}
                          className="min-w-0 flex-1 rounded-xl border border-brand-border bg-brand-surface px-4 py-2.5 text-sm outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20"
                        />
                      </div>
                    </div>
                    <button type="submit" className="btn-primary w-full">
                      {labels.submitLabel}
                    </button>
                  </form>

                  <button type="button" className="w-full text-center text-sm text-brand-muted underline underline-offset-2 hover:text-brand-heading" onClick={reset}>
                    {labels.changePhotoLabel}
                  </button>
                </>
              )}

              {/* ── DONE ── */}
              {step === "done" && (
                <div className="flex flex-col items-center gap-3 rounded-2xl bg-brand-success-soft px-6 py-10 text-center">
                  <svg className="h-12 w-12 text-brand-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-lg font-semibold text-brand-success">{labels.doneTitle}</p>
                  <p className="text-sm text-brand-success">{labels.doneBody}</p>
                </div>
              )}

              {/* ── ERROR ── */}
              {step === "error" && (
                <>
                  <div className="flex flex-col items-center gap-3 rounded-2xl bg-brand-warning-soft px-6 py-8 text-center">
                    <svg className="h-12 w-12 text-brand-warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    <p className="text-sm font-medium text-brand-warning">
                      {errorMsg}
                      {errorContact && (
                        <> If this keeps happening, <a href="#contact" className="underline underline-offset-2 hover:text-brand-warning">please contact us</a> directly.</>
                      )}
                    </p>
                  </div>
                  <button type="button" className="btn-primary w-full" onClick={reset}>
                    {labels.tryAgainLabel}
                  </button>
                </>
              )}

              </>}

              <p className="text-xs text-brand-muted">{content.disclaimer}</p>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
