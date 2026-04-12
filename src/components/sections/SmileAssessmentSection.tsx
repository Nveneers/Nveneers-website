"use client";

import { useRef, useState } from "react";
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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

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
    setName("");
    setPhone("");
  }

  // Step 1: AI validation
  async function validate() {
    if (!preview) return;
    setStep("validating");
    try {
      const tokenRes = await fetch("/api/challenge-token");
      if (!tokenRes.ok) throw new Error("token_fetch_failed");
      const { token } = (await tokenRes.json()) as { token: string };

      const res = await fetch("/api/validate-smile", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Challenge-Token": token },
        body: JSON.stringify({ image: preview })
      });
      const data = (await res.json()) as { valid: boolean; reason: string };
      if (data.valid) {
        setStep("contact-form");
      } else {
        setErrorMsg(data.reason);
        setStep("error");
      }
    } catch {
      setErrorMsg("Something went wrong. Please check your connection and try again.");
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
      if (!tokenRes.ok) throw new Error("token_fetch_failed");
      const { token } = (await tokenRes.json()) as { token: string };

      const res = await fetch("/api/submit-smile", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Challenge-Token": token },
        body: JSON.stringify({ image: preview, name: name.trim(), phone: phone.trim() })
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (data.ok) {
        setStep("done");
      } else {
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
        setStep("error");
      }
    } catch {
      setErrorMsg("Something went wrong. Please check your connection and try again.");
      setStep("error");
    }
  }

  return (
    <section id="assessment" className="section section-ivory scroll-mt-24">
      <div className="container">
        <RevealOnScroll>
          <div className="card mx-auto max-w-3xl p-6 sm:p-10">
            <p className="intro-label">{content.eyebrow}</p>
            <h2 className="section-title mt-4">{content.headline}</h2>
            <p className="section-lead">{content.body}</p>

            <div className="mt-8 space-y-5">
              {/* ── IDLE ── */}
              {step === "idle" && (
                <>
                  <input ref={fileInputRef} type="file" accept={ACCEPTED.join(",")} className="hidden" onChange={onFileChange} />
                  <input ref={cameraInputRef} type="file" accept={ACCEPTED.join(",")} capture="user" className="hidden" onChange={onFileChange} />

                  <div
                    role="button"
                    tabIndex={0}
                    aria-label={labels.uploadLabel}
                    className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-brand-border bg-brand-warm-white px-6 py-10 text-center transition hover:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold"
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
                    onDrop={onDrop}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <svg className="h-10 w-10 text-brand-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <p className="text-sm font-medium text-brand-deep">{labels.uploadLabel}</p>
                    <p className="text-xs text-brand-muted">JPG, PNG, WEBP · max 5 MB</p>
                  </div>

                  <button type="button" className="btn-secondary w-full" onClick={() => cameraInputRef.current?.click()}>
                    {labels.cameraLabel}
                  </button>

                  {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
                </>
              )}

              {/* ── PREVIEWING ── */}
              {step === "previewing" && preview && (
                <>
                  <div className="overflow-hidden rounded-2xl border border-brand-border bg-brand-warm-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt="Your smile preview" className="mx-auto max-h-72 w-full object-contain" />
                  </div>
                  <button type="button" className="btn-primary w-full" onClick={validate}>
                    {labels.checkLabel}
                  </button>
                  <button type="button" className="w-full text-center text-sm text-brand-muted underline underline-offset-2 hover:text-brand-deep" onClick={reset}>
                    {labels.changePhotoLabel}
                  </button>
                </>
              )}

              {/* ── VALIDATING ── */}
              {(step === "validating" || step === "submitting") && (
                <div className="flex flex-col items-center gap-4 py-8">
                  <svg className="h-10 w-10 animate-spin text-brand-gold" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  <p className="text-sm font-medium text-brand-deep">
                    {step === "validating" ? labels.validatingLabel : labels.submittingLabel}
                  </p>
                </div>
              )}

              {/* ── CONTACT FORM ── */}
              {step === "contact-form" && preview && (
                <>
                  {/* Thumbnail of approved photo */}
                  <div className="flex items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt="Your smile" className="h-12 w-12 rounded-lg object-cover" />
                    <div>
                      <p className="text-sm font-semibold text-emerald-800">Great smile photo!</p>
                      <p className="text-xs text-emerald-700">Fill in your details and we&apos;ll be in touch.</p>
                    </div>
                  </div>

                  <form onSubmit={submitContact} className="space-y-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-brand-deep">
                        {labels.nameLabel}
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={labels.namePlaceholder}
                        required
                        maxLength={80}
                        className="w-full rounded-xl border border-brand-border bg-brand-warm-white px-4 py-2.5 text-sm outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-brand-deep">
                        {labels.phoneLabel}
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={labels.phonePlaceholder}
                        required
                        maxLength={30}
                        className="w-full rounded-xl border border-brand-border bg-brand-warm-white px-4 py-2.5 text-sm outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
                      />
                    </div>
                    <button type="submit" className="btn-primary w-full">
                      {labels.submitLabel}
                    </button>
                  </form>

                  <button type="button" className="w-full text-center text-sm text-brand-muted underline underline-offset-2 hover:text-brand-deep" onClick={reset}>
                    {labels.changePhotoLabel}
                  </button>
                </>
              )}

              {/* ── DONE ── */}
              {step === "done" && (
                <>
                  <div className="flex flex-col items-center gap-3 rounded-2xl bg-emerald-50 px-6 py-10 text-center">
                    <svg className="h-12 w-12 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-lg font-semibold text-emerald-800">{labels.doneTitle}</p>
                    <p className="text-sm text-emerald-700">{labels.doneBody}</p>
                  </div>
                  <button type="button" className="w-full text-center text-sm text-brand-muted underline underline-offset-2 hover:text-brand-deep" onClick={reset}>
                    {labels.tryAgainLabel}
                  </button>
                </>
              )}

              {/* ── ERROR ── */}
              {step === "error" && (
                <>
                  <div className="flex flex-col items-center gap-3 rounded-2xl bg-amber-50 px-6 py-8 text-center">
                    <svg className="h-12 w-12 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    <p className="text-sm font-medium text-amber-800">{errorMsg}</p>
                  </div>
                  <button type="button" className="btn-primary w-full" onClick={reset}>
                    {labels.tryAgainLabel}
                  </button>
                </>
              )}

              <p className="text-xs text-brand-muted">{content.disclaimer}</p>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
