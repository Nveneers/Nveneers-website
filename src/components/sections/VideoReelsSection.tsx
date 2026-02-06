"use client";

import { useRef, useState } from "react";
import type { VideoItem } from "@/content/home";

type VideoReelsSectionProps = {
  videos: VideoItem[];
  labels: {
    eyebrow: string;
    headline: string;
    hint: string;
    playLabel: string;
    closeLabel: string;
    durationLabel: string;
  };
};

// Reels-style video proof grid with inline playback.
export default function VideoReelsSection({
  videos,
  labels
}: VideoReelsSectionProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const setVideoRef =
    (id: string) => (node: HTMLVideoElement | null) => {
      videoRefs.current[id] = node;
    };

  const pauseOtherVideos = (currentId: string) => {
    Object.entries(videoRefs.current).forEach(([id, video]) => {
      if (!video || id === currentId) {
        return;
      }

      if (!video.paused) {
        video.pause();
      }
      video.currentTime = 0;
    });
  };

  const togglePlayback = async (id: string) => {
    const video = videoRefs.current[id];
    if (!video) {
      return;
    }

    if (video.paused || video.ended) {
      pauseOtherVideos(id);
      try {
        await video.play();
        setPlayingId(id);
      } catch {
        // Ignore playback failures (e.g. browser restrictions).
      }
      return;
    }

    video.pause();
    setPlayingId(null);
  };

  const handleEnded = (id: string) => {
    const video = videoRefs.current[id];
    if (video) {
      video.currentTime = 0;
    }
    setPlayingId((prev) => (prev === id ? null : prev));
  };

  return (
    <section id="videos" className="section scroll-mt-24 bg-white">
      <div className="container">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brand-teal/70">
              {labels.eyebrow}
            </p>
            <h2 className="section-title mt-4">{labels.headline}</h2>
          </div>
          <p className="text-sm text-brand-teal/70">
            {labels.hint}
          </p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {videos.map((video) => {
            const isPlaying = playingId === video.id;

            return (
              <div
                key={video.id}
                className="group relative overflow-hidden rounded-3xl border border-brand-teal/10 bg-white text-start"
              >
                <div className="relative aspect-[9/16]">
                  <video
                    ref={setVideoRef(video.id)}
                    className="h-full w-full object-cover"
                    preload="auto"
                    playsInline
                    onClick={() => togglePlayback(video.id)}
                    onEnded={() => handleEnded(video.id)}
                  >
                    <source src={video.src} type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-brand-teal/10 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => togglePlayback(video.id)}
                    aria-label={`${labels.playLabel} ${video.title}`}
                    className={`absolute inset-0 flex items-center justify-center transition ${
                      isPlaying
                        ? "pointer-events-none opacity-0"
                        : "opacity-100"
                    }`}
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-brand-gold bg-white text-brand-teal shadow-lg">
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="h-4 w-4 fill-current"
                      >
                        <path d="M8 5l11 7-11 7V5z" />
                      </svg>
                      <span className="sr-only">{labels.playLabel}</span>
                    </span>
                  </button>
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-sm font-semibold text-white">
                      {video.title}
                    </p>
                    <p className="text-xs text-white/80">
                      {labels.durationLabel} {video.duration}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
