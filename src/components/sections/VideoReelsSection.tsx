"use client";

import { useState } from "react";
import Image from "next/image";
import VideoModal from "@/components/ui/VideoModal";
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

// Reels-style video proof grid with modal playback.
export default function VideoReelsSection({
  videos,
  labels
}: VideoReelsSectionProps) {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

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
          {videos.map((video) => (
            <button
              key={video.id}
              type="button"
              onClick={() => setActiveVideo(video)}
              aria-label={`${labels.playLabel} ${video.title}`}
              className="group relative overflow-hidden rounded-3xl border border-brand-teal/10 bg-white text-start"
            >
              <div className="relative aspect-[9/16]">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-[1.02]"
                  sizes="(min-width: 1024px) 20vw, (min-width: 640px) 45vw, 90vw"
                />
                <div className="absolute inset-0 bg-brand-teal/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-brand-gold bg-white text-xs font-semibold text-brand-teal">
                    {labels.playLabel}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-sm font-semibold text-white">
                    {video.title}
                  </p>
                  <p className="text-xs text-white/80">{video.duration}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <VideoModal
        open={Boolean(activeVideo)}
        video={activeVideo}
        onClose={() => setActiveVideo(null)}
        labels={{
          closeLabel: labels.closeLabel,
          durationLabel: labels.durationLabel
        }}
      />
    </section>
  );
}
