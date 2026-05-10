import { useState } from 'react';
import type { Match } from '../types';
import { formatDate, sanitizeEmbed } from '../api';

interface MatchCardProps {
  match: Match;
  isFeatured?: boolean;
}

export default function MatchCard({ match, isFeatured = false }: MatchCardProps) {
  const [showVideo, setShowVideo] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);
  const hasVideos = match.videos && match.videos.length > 0;

  return (
    <div
      className={`group relative overflow-hidden rounded-sm border border-white/[0.06] bg-[#0A0A0A] card-hover ${
        isFeatured ? 'md:col-span-2 lg:col-span-2' : ''
      }`}
    >
      {/* Thumbnail Section */}
      <div className={`relative overflow-hidden ${isFeatured ? 'aspect-video md:aspect-[21/9]' : 'aspect-video'}`}>
        {!thumbnailError && match.thumbnail ? (
          <img
            src={match.thumbnail}
            alt={match.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setThumbnailError(true)}
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#0F0F0F]">
            <div className="flex h-16 w-16 items-center justify-center rounded-sm bg-white/[0.04]">
              <svg className="h-8 w-8 text-white/10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.5 14.5v-9l6 4.5-6 4.5z"/>
              </svg>
            </div>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />

        {/* Competition badge — DAZN style */}
        <div className="absolute left-3 top-3">
          <span className="inline-flex items-center rounded-sm bg-[#D7FF00] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-black">
            {match.competition}
          </span>
        </div>

        {/* Date */}
        <div className="absolute right-3 top-3">
          <span className="inline-flex items-center rounded-sm bg-black/70 px-2.5 py-1 text-[10px] font-medium text-white/60 backdrop-blur-sm uppercase tracking-wider">
            {formatDate(match.date)}
          </span>
        </div>

        {/* Teams overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-sm bg-white/[0.08] text-xs font-bold text-white uppercase border border-white/[0.08]">
                {match.homeTeam.name.slice(0, 3)}
              </div>
              <span className="text-sm font-bold text-white truncate">{match.homeTeam.name}</span>
            </div>
            <div className="flex-shrink-0">
              <span className="text-[11px] font-black text-[#D7FF00] tracking-widest">VS</span>
            </div>
            <div className="flex items-center gap-2 min-w-0 flex-row-reverse">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-sm bg-white/[0.08] text-xs font-bold text-white uppercase border border-white/[0.08]">
                {match.awayTeam.name.slice(0, 3)}
              </div>
              <span className="text-sm font-bold text-white truncate">{match.awayTeam.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="text-sm font-semibold text-white/80 line-clamp-1" title={match.title}>
          {match.title}
        </h3>

        {/* Video count */}
        {hasVideos && (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/30">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.5 14.5v-9l6 4.5-6 4.5z"/>
              </svg>
              {match.videos.length} {match.videos.length === 1 ? 'Highlight' : 'Highlights'}
            </span>
          </div>
        )}

        {/* Watch button */}
        {hasVideos && (
          <button
            onClick={() => setShowVideo(!showVideo)}
            className="w-full btn-dazn-outline rounded-sm py-2.5 text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2"
          >
            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            {showVideo ? 'Hide' : 'Watch Highlights'}
          </button>
        )}

        {/* Video Player */}
        {showVideo && hasVideos && (
          <div className="space-y-3 pt-1">
            {/* Video tabs */}
            {match.videos.length > 1 && (
              <div className="flex flex-wrap gap-1.5">
                {match.videos.map((video, idx) => (
                  <button
                    key={video.id}
                    onClick={() => {
                      const iframe = document.getElementById(`video-${match.matchviewUrl}-${idx}`);
                      if (iframe) {
                        (iframe as HTMLIFrameElement).src = sanitizeEmbed(video.embed);
                      }
                    }}
                    className="rounded-sm bg-white/[0.06] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/50 hover:bg-white/[0.1] hover:text-white transition-colors"
                  >
                    {video.title}
                  </button>
                ))}
              </div>
            )}

            {/* Player */}
            <div className="overflow-hidden rounded-sm border border-white/[0.08] bg-black">
              <div className="aspect-video">
                <iframe
                  id={`video-${match.matchviewUrl}-0`}
                  src={sanitizeEmbed(match.videos[0].embed)}
                  className="h-full w-full"
                  allowFullScreen
                  allow="autoplay; fullscreen"
                  title={`${match.title} - ${match.videos[0].title}`}
                />
              </div>
            </div>

            <a
              href={match.matchviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-[10px] uppercase tracking-wider text-white/20 hover:text-white/40 transition-colors"
            >
              Open in ScoreBat ↗
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
