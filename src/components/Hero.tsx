import type { Match } from '../types';

interface HeroProps {
  featuredMatch: Match | null;
  onWatchClick: () => void;
}

export default function Hero({ featuredMatch, onWatchClick }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#060606]">
      {/* DAZN-style subtle hexagonal pattern */}
      <div className="absolute inset-0 bg-hex-pattern opacity-40" />
      <div className="absolute inset-0 bg-grid-pattern" />
      <div className="absolute inset-0 hero-gradient" />

      {/* Sharp diagonal accent */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] opacity-[0.03]">
        <svg viewBox="0 0 500 500" fill="none">
          <path d="M500 0L0 500H500V0Z" fill="#D7FF00" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="max-w-3xl space-y-8">
          {/* DAZN-style label */}
          <div className="flex items-center gap-3">
            <div className="h-px w-8 bg-[#D7FF00]/40" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#D7FF00]">
              Free Football Streaming
            </span>
          </div>

          {/* Title — bold, punchy DAZN style */}
          <h1 className="text-5xl font-extrabold tracking-tighter text-white leading-[0.95] sm:text-6xl md:text-7xl lg:text-8xl">
            WATCH LIVE<br />
            <span className="text-[#D7FF00]">FOOTBALL</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base text-white/40 sm:text-lg max-w-xl leading-relaxed">
            Stream the biggest matches from{' '}
            <span className="text-white/70 font-semibold">Premier League</span>,{' '}
            <span className="text-white/70 font-semibold">La Liga</span>,{' '}
            <span className="text-white/70 font-semibold">Serie A</span>,{' '}
            <span className="text-white/70 font-semibold">Bundesliga</span>,{' '}
            <span className="text-white/70 font-semibold">Ligue 1</span> and more.
            All live. All free.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={onWatchClick}
              className="btn-dazn px-8 py-4 text-sm tracking-wider uppercase rounded-sm flex items-center gap-3"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Start Watching
            </button>
            <button
              onClick={onWatchClick}
              className="btn-dazn-outline px-8 py-4 text-sm tracking-wider uppercase rounded-sm"
            >
              View Schedule
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 pt-4">
            <div>
              <div className="text-2xl font-bold text-white">50+</div>
              <div className="text-xs text-white/30 uppercase tracking-wider">Leagues</div>
            </div>
            <div className="h-8 w-px bg-white/[0.08]" />
            <div>
              <div className="text-2xl font-bold text-white">HD</div>
              <div className="text-xs text-white/30 uppercase tracking-wider">Quality</div>
            </div>
            <div className="h-8 w-px bg-white/[0.08]" />
            <div>
              <div className="text-2xl font-bold text-[#D7FF00]">FREE</div>
              <div className="text-xs text-white/30 uppercase tracking-wider">Forever</div>
            </div>
          </div>

          {/* Featured match preview */}
          {featuredMatch && (
            <div className="inline-flex items-center gap-6 rounded-sm border border-white/[0.08] bg-white/[0.03] px-6 py-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-white/[0.06] text-sm font-bold text-white border border-white/[0.1]">
                  {featuredMatch.homeTeam.name.slice(0, 3).toUpperCase()}
                </div>
                <span className="text-sm font-bold text-white">{featuredMatch.homeTeam.name}</span>
              </div>
              <div className="text-center">
                <span className="text-xs font-black text-[#D7FF00]">VS</span>
              </div>
              <div className="flex items-center gap-3 flex-row-reverse">
                <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-white/[0.06] text-sm font-bold text-white border border-white/[0.1]">
                  {featuredMatch.awayTeam.name.slice(0, 3).toUpperCase()}
                </div>
                <span className="text-sm font-bold text-white">{featuredMatch.awayTeam.name}</span>
              </div>
              <div className="h-6 w-px bg-white/[0.1]" />
              <span className="text-xs text-white/30 uppercase tracking-wider">{featuredMatch.competition}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
