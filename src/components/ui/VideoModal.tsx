"use client";

import { useEffect, useRef } from "react";
import type { VideoItem } from "@/content/home";

type VideoModalProps = {
  open: boolean;
  video: VideoItem | null;
  onClose: () => void;
};

// Modal video player with focus trap and escape key close.
export default function VideoModal({ open, video, onClose }: VideoModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    lastFocusedRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    const focusableElements = () =>
      modalRef.current?.querySelectorAll<HTMLElement>(
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
      );

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusable = focusableElements();
      if (!focusable || focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    const focusable = focusableElements();
    if (focusable && focusable.length > 0) {
      focusable[0].focus();
    } else {
      modalRef.current?.focus();
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
      lastFocusedRef.current?.focus();
    };
  }, [open, onClose]);

  if (!open || !video) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-teal/70 px-6 py-10"
      role="dialog"
      aria-modal="true"
      aria-label={video.title}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full border border-brand-teal/20 bg-white px-3 py-2 text-xs font-semibold text-brand-teal"
        >
          Close
        </button>
        <div className="relative aspect-video bg-black">
          <video
            className="h-full w-full"
            controls
            autoPlay
            playsInline
            poster={video.thumbnail}
          >
            <source src={video.src} type="video/mp4" />
          </video>
        </div>
        <div className="p-6">
          <p className="text-sm font-semibold text-brand-teal">{video.title}</p>
          <p className="text-xs text-brand-teal/60">
            Duration {video.duration}
          </p>
        </div>
      </div>
    </div>
  );
}
