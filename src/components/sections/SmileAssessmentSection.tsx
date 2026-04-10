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
    successTitle: string;
    successBody: string;
    savePhotoLabel: string;
    savePhotoHint: string;
    whatsappLabel: string;
    tryAgainLabel: string;
    fileSizeError: string;
    fileTypeError: string;
  };
  whatsappNumber: string;
  whatsappSuccessMessage: string;
};

type Step = "idle" | "previewing" | "validating" | "success" | "error";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

export default function SmileAssessmentSection({
  content,
  labels,
  whatsappNumber,
  whatsappSuccessMessage
}: SmileAssessmentSectionProps) {
  const [step, setStep] = useState<Step>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

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
    // Reset so same file can be re-selected
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
  }

  function savePhoto() {
    if (!preview) return;
    const a = document.createElement("a");
    a.href = preview;
    a.download = "my-smile.jpg";
    a.click();
  }

  async function validate() {
    if (!preview) return;
    setStep("validating");
    try {
      // Fetch a short-lived challenge token before submitting.
      // This stops bots that call /api/validate-smile directly without loading the page.
      const tokenRes = await fetch("/api/challenge-token");
      if (!tokenRes.ok) throw new Error("token_fetch_failed");
      const { token } = (await tokenRes.json()) as { token: string };

      const res = await fetch("/api/validate-smile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Challenge-Token": token
        },
        body: JSON.stringify({ image: preview })
      });
      const data = (await res.json()) as { valid: boolean; reason: string };
      if (data.valid) {
        setStep("success");
      } else {
        setErrorMsg(data.reason);
        setStep("error");
      }
    } catch {
      setErrorMsg(
        "Something went wrong. Please check your connection and try again."
      );
      setStep("error");
    }
  }

  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappSuccessMessage)}`;

  return (
    <section id="assessment" className="section section-ivory scroll-mt-24">
      <div className="container">
        <RevealOnScroll>
          <div className="card mx-auto max-w-3xl p-6 sm:p-10">
            <p className="intro-label">{content.eyebrow}</p>
            <h2 className="section-title mt-4">{content.headline}</h2>
            <p className="section-lead">{content.body}</p>

            <div className="mt-8 space-y-5">
              {/* ── IDLE: upload area ── */}
              {step === "idle" && (
                <>
                  {/* Hidden inputs */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPTED.join(",")}
                    className="hidden"
                    onChange={onFileChange}
                  />
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept={ACCEPTED.join(",")}
                    capture="user"
                    className="hidden"
                    onChange={onFileChange}
                  />

                  {/* Drop zone */}
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label={labels.uploadLabel}
                    className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-brand-border bg-brand-warm-white px-6 py-10 text-center transition hover:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold"
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        fileInputRef.current?.click();
                    }}
                    onDrop={onDrop}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    {/* Upload icon */}
                    <svg
                      className="h-10 w-10 text-brand-muted"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                      />
                    </svg>
                    <p className="text-sm font-medium text-brand-deep">
                      {labels.uploadLabel}
                    </p>
                    <p className="text-xs text-brand-muted">
                      JPG, PNG, WEBP · max 5 MB
                    </p>
                  </div>

                  {/* Camera button (most useful on mobile) */}
                  <button
                    type="button"
                    className="btn-secondary w-full"
                    onClick={() => cameraInputRef.current?.click()}
                  >
                    {labels.cameraLabel}
                  </button>

                  {errorMsg && (
                    <p className="text-sm text-red-600">{errorMsg}</p>
                  )}
                </>
              )}

              {/* ── PREVIEWING ── */}
              {step === "previewing" && preview && (
                <>
                  <div className="overflow-hidden rounded-2xl border border-brand-border bg-brand-warm-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={preview}
                      alt="Your smile preview"
                      className="mx-auto max-h-72 w-full object-contain"
                    />
                  </div>
                  <button
                    type="button"
                    className="btn-primary w-full"
                    onClick={validate}
                  >
                    {labels.checkLabel}
                  </button>
                  <button
                    type="button"
                    className="w-full text-center text-sm text-brand-muted underline underline-offset-2 hover:text-brand-deep"
                    onClick={reset}
                  >
                    {labels.changePhotoLabel}
                  </button>
                </>
              )}

              {/* ── VALIDATING ── */}
              {step === "validating" && (
                <div className="flex flex-col items-center gap-4 py-8">
                  <svg
                    className="h-10 w-10 animate-spin text-brand-gold"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  <p className="text-sm font-medium text-brand-deep">
                    {labels.validatingLabel}
                  </p>
                </div>
              )}

              {/* ── SUCCESS ── */}
              {step === "success" && (
                <>
                  <div className="flex flex-col items-center gap-3 rounded-2xl bg-emerald-50 px-6 py-8 text-center">
                    <svg
                      className="h-12 w-12 text-emerald-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-lg font-semibold text-emerald-800">
                      {labels.successTitle}
                    </p>
                    <p className="text-sm text-emerald-700">
                      {labels.successBody}
                    </p>
                  </div>

                  {/* Step 1: Save photo */}
                  <button
                    type="button"
                    className="btn-secondary flex w-full items-center justify-center gap-2"
                    onClick={savePhoto}
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M12 3v13.5m0 0l-4.5-4.5M12 16.5l4.5-4.5"
                      />
                    </svg>
                    {labels.savePhotoLabel}
                  </button>
                  <p className="text-center text-xs text-brand-muted">
                    {labels.savePhotoHint}
                  </p>

                  {/* Step 2: Open WhatsApp */}
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary flex w-full items-center justify-center gap-2"
                  >
                    {/* WhatsApp icon */}
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    {labels.whatsappLabel}
                  </a>
                  <button
                    type="button"
                    className="w-full text-center text-sm text-brand-muted underline underline-offset-2 hover:text-brand-deep"
                    onClick={reset}
                  >
                    {labels.tryAgainLabel}
                  </button>
                </>
              )}

              {/* ── ERROR ── */}
              {step === "error" && (
                <>
                  <div className="flex flex-col items-center gap-3 rounded-2xl bg-amber-50 px-6 py-8 text-center">
                    <svg
                      className="h-12 w-12 text-amber-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                      />
                    </svg>
                    <p className="text-sm font-medium text-amber-800">
                      {errorMsg}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn-primary w-full"
                    onClick={reset}
                  >
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
