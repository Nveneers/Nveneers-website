"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

const RESUME_DELAY_MS = 8000;
const SECTION_VISIBILITY_THRESHOLD = 0.45;

// Reels-style video proof grid with inline playback.
export default function VideoReelsSection({
  videos,
  labels
}: VideoReelsSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const clearResumeTimer = useCallback(() => {
    if (!resumeTimerRef.current) {
      return;
    }

    clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      clearResumeTimer();
    };
  }, [clearResumeTimer]);

  const setVideoRef =
    (id: string) => (node: HTMLVideoElement | null) => {
      videoRefs.current[id] = node;
    };

  const setCardRef =
    (id: string) => (node: HTMLDivElement | null) => {
      cardRefs.current[id] = node;
    };

  const pauseOtherVideos = useCallback((currentId: string) => {
    Object.entries(videoRefs.current).forEach(([id, video]) => {
      if (!video || id === currentId) {
        return;
      }

      if (!video.paused) {
        video.pause();
      }
      video.currentTime = 0;
    });
  }, []);

  const pauseAllVideos = useCallback(() => {
    Object.values(videoRefs.current).forEach((video) => {
      if (!video) {
        return;
      }

      if (!video.paused) {
        video.pause();
      }
      video.currentTime = 0;
    });
  }, []);

  const playVideoById = useCallback(
    async (id: string, resetToStart: boolean) => {
      const video = videoRefs.current[id];
      if (!video) {
        return;
      }

      pauseOtherVideos(id);
      if (resetToStart) {
        video.currentTime = 0;
      }

      try {
        await video.play();
        setPlayingId(id);
      } catch {
        setPlayingId(null);
      }
    },
    [pauseOtherVideos]
  );

  const pauseAutoWithResume = useCallback(() => {
    clearResumeTimer();
    setIsAutoRunning(false);

    if (isReducedMotion) {
      return;
    }

    resumeTimerRef.current = setTimeout(() => {
      if (!isSectionVisible || videos.length === 0) {
        return;
      }

      setIsAutoRunning(true);
    }, RESUME_DELAY_MS);
  }, [clearResumeTimer, isReducedMotion, isSectionVisible, videos.length]);

  useEffect(() => {
    if (videos.length === 0) {
      setPlayingId(null);
      setIsAutoRunning(false);
      return;
    }

    setActiveIndex((previous) => (previous < videos.length ? previous : 0));
    setPlayingId((previous) => {
      if (!previous) {
        return previous;
      }

      return videos.some((video) => video.id === previous) ? previous : null;
    });
  }, [videos]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateReducedMotion = () => {
      setIsReducedMotion(mediaQuery.matches);
    };

    updateReducedMotion();

    mediaQuery.addEventListener("change", updateReducedMotion);

    return () => {
      mediaQuery.removeEventListener("change", updateReducedMotion);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible =
          entry.isIntersecting &&
          entry.intersectionRatio >= SECTION_VISIBILITY_THRESHOLD;
        setIsSectionVisible(visible);
      },
      { threshold: [0, SECTION_VISIBILITY_THRESHOLD, 0.75] }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isReducedMotion || videos.length === 0) {
      clearResumeTimer();
      setIsAutoRunning(false);
      return;
    }

    if (!isSectionVisible) {
      clearResumeTimer();
      setIsAutoRunning(false);
      return;
    }

    setIsAutoRunning((previous) => (previous ? previous : true));
  }, [clearResumeTimer, isReducedMotion, isSectionVisible, videos.length]);

  useEffect(() => {
    if (isSectionVisible) {
      return;
    }

    pauseAllVideos();
    setPlayingId(null);
  }, [isSectionVisible, pauseAllVideos]);

  const activeVideoId = videos[activeIndex]?.id ?? null;

  useEffect(() => {
    if (!activeVideoId || !isSectionVisible) {
      return;
    }

    const card = cardRefs.current[activeVideoId];
    if (!card) {
      return;
    }

    card.scrollIntoView({
      behavior: isReducedMotion ? "auto" : "smooth",
      block: "nearest",
      inline: "start"
    });
  }, [activeVideoId, isReducedMotion, isSectionVisible]);

  useEffect(() => {
    if (
      !activeVideoId ||
      !isAutoRunning ||
      !isSectionVisible ||
      isReducedMotion
    ) {
      return;
    }

    void playVideoById(activeVideoId, true);
  }, [
    activeVideoId,
    isAutoRunning,
    isReducedMotion,
    isSectionVisible,
    playVideoById
  ]);

  const handleReelInteraction = async (index: number) => {
    const selectedVideo = videos[index];
    if (!selectedVideo) {
      return;
    }

    const selectedId = selectedVideo.id;
    const video = videoRefs.current[selectedId];
    if (!video) {
      return;
    }

    pauseAutoWithResume();
    setActiveIndex(index);

    const isSelectedPlaying =
      playingId === selectedId && !video.paused && !video.ended;

    if (isSelectedPlaying) {
      video.pause();
      setPlayingId(null);
      return;
    }

    await playVideoById(selectedId, true);
  };

  const handleEnded = async (id: string) => {
    const video = videoRefs.current[id];
    if (video) {
      video.currentTime = 0;
    }
    setPlayingId((prev) => (prev === id ? null : prev));

    if (!isAutoRunning || isReducedMotion || videos.length === 0) {
      return;
    }

    const endedIndex = videos.findIndex((entry) => entry.id === id);
    if (endedIndex !== activeIndex) {
      return;
    }

    if (videos.length === 1) {
      await playVideoById(id, true);
      return;
    }

    setActiveIndex((previous) => (previous + 1) % videos.length);
  };

  return (
    <section
      id="videos"
      ref={sectionRef}
      className="section section-surface-soft-1 scroll-mt-24"
    >
      <div className="container">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brand-teal/70">
              {labels.eyebrow}
            </p>
            <h2 className="section-title mt-4">{labels.headline}</h2>
          </div>
          <p className="text-sm text-brand-teal/70 sm:text-right">
            {labels.hint}
          </p>
        </div>
        <div className="mt-10 -mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-4 md:mx-0 md:px-0 md:pb-0">
          {videos.map((video, index) => {
            const isPlaying = playingId === video.id;
            const actionLabel = isPlaying ? labels.closeLabel : labels.playLabel;

            return (
              <div
                key={video.id}
                ref={setCardRef(video.id)}
                className="group relative min-w-[14rem] snap-start overflow-hidden rounded-3xl border border-brand-teal/10 bg-white text-start"
              >
                <div className="relative aspect-[9/16]">
                  <video
                    ref={setVideoRef(video.id)}
                    className="h-full w-full object-cover"
                    muted
                    playsInline
                    preload={index === activeIndex ? "auto" : "metadata"}
                    poster={video.thumbnail}
                    onClick={() => void handleReelInteraction(index)}
                    onPlay={() => setPlayingId(video.id)}
                    onPause={() =>
                      setPlayingId((previous) =>
                        previous === video.id ? null : previous
                      )
                    }
                    onEnded={() => handleEnded(video.id)}
                  >
                    <source src={video.src} type="video/mp4" />
                  </video>
                  <div
                    className={`absolute inset-0 pointer-events-none transition-colors ${
                      isPlaying ? "bg-transparent" : "bg-brand-teal/10"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => void handleReelInteraction(index)}
                    aria-label={`${actionLabel} ${video.title}`}
                    aria-pressed={isPlaying}
                    className={`absolute z-10 transition ${
                      isPlaying
                        ? "right-3 top-3 opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
                        : "inset-0 flex items-center justify-center opacity-100"
                    }`}
                  >
                    <span
                      className={`flex items-center justify-center rounded-full border shadow-lg transition-colors ${
                        isPlaying
                          ? "h-10 w-10 border-white/70 bg-black/55 text-white"
                          : "h-12 w-12 border-brand-gold bg-white text-brand-teal"
                      }`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="h-4 w-4 fill-current"
                      >
                        {isPlaying ? (
                          <path d="M7 5h4v14H7V5zm6 0h4v14h-4V5z" />
                        ) : (
                          <path d="M8 5l11 7-11 7V5z" />
                        )}
                      </svg>
                      <span className="sr-only">{actionLabel}</span>
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
