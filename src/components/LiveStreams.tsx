import { useState, useEffect, useCallback } from 'react';
import type { LiveMatch, StreamIframe } from '../types';
import { fetchLiveStreams, getMatchStatus, parseLiveMatchTeams, formatLiveDate } from '../api';

export default function LiveStreams() {
  const [matches, setMatches] = useState<LiveMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStream, setActiveStream] = useState<{
    match: LiveMatch;
    server: StreamIframe;
  } | null>(null);
  const [selectedServer, setSelectedServer] = useState<Record<string, number>>({});

  const loadStreams = useCallback(async () => {
    try {
      const data = await fetchLiveStreams();
      setMatches(data);
      setError(null);
    } catch {
      setError('Failed to load live streams.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStreams();
    const interval = setInterval(loadStreams, 60000);
    return () => clearInterval(interval);
  }, [loadStreams]);

  const liveMatches = matches.filter((m) => getMatchStatus(m) === 'live');
  const upcomingMatches = matches.filter((m) => getMatchStatus(m) === 'upcoming');
  const endedMatches = matches.filter((m) => getMatchStatus(m) === 'ended').slice(0, 6);

  const sortedLive = [...liveMatches].sort((a, b) => {
    const leagues = ['Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1', 'Eredivisie'];
    const aIdx = leagues.findIndex((l) => a.league.includes(l));
    const bIdx = leagues.findIndex((l) => b.league.includes(l));
    if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
    if (aIdx !== -1) return -1;
    if (bIdx !== -1) return 1;
    return 0;
  });

  return (
    <section className="relative">
      {/* DAZN-style section accent line */}
      <div className="absolute top-0 left-0 w-12 h-[2px] bg-[#D7FF00]/60" />

      <div className="relative space-y-8 pt-4">
        {/* Section header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-extrabold tracking-tight text-white uppercase">
                Live Football
              </h2>
              {liveMatches.length > 0 && (
                <span className="flex items-center gap-2 rounded-sm bg-red-500/10 px-3 py-1 text-[10px] font-bold tracking-wider uppercase text-red-400 border border-red-500/20 live-pulse">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                  </span>
                  {liveMatches.length} LIVE
                </span>
              )}
            </div>
            <p className="text-xs text-white/25 uppercase tracking-wider">Select a match to watch</p>
          </div>
          <button
            onClick={loadStreams}
            className="text-[10px] font-bold tracking-wider uppercase text-white/30 hover:text-[#D7FF00] transition-colors flex items-center gap-2"
            disabled={loading}
          >
            <svg className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-sm border border-white/[0.06] bg-[#0A0A0A] p-5 animate-pulse space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-2 w-20 rounded-sm bg-white/[0.06]" />
                  <div className="h-2 w-12 rounded-sm bg-white/[0.04]" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-3/4 rounded-sm bg-white/[0.06]" />
                  <div className="h-3 w-1/2 rounded-sm bg-white/[0.04]" />
                </div>
                <div className="h-9 w-full rounded-sm bg-white/[0.06]" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-sm border border-red-500/20 bg-red-500/[0.03] p-8 text-center">
            <p className="text-sm text-red-400">{error}</p>
            <button
              onClick={loadStreams}
              className="mt-4 px-6 py-2 text-xs font-bold tracking-wider uppercase text-red-400 border border-red-500/30 rounded-sm hover:bg-red-500/10 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <div className="space-y-10">
            {/* LIVE MATCHES */}
            {liveMatches.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                  </span>
                  <span className="text-xs font-bold tracking-[0.15em] uppercase text-red-400">Live Now</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {sortedLive.map((match) => (
                    <LiveMatchCard
                      key={match.slug}
                      match={match}
                      isActive={activeStream?.match.slug === match.slug}
                      selectedServerIdx={selectedServer[match.slug] ?? 0}
                      onSelectServer={(idx) => setSelectedServer((prev) => ({ ...prev, [match.slug]: idx }))}
                      onWatch={(server) =>
                        setActiveStream((prev) =>
                          prev?.match.slug === match.slug && prev?.server.url === server.url
                            ? null
                            : { match, server }
                        )
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            {/* UPCOMING */}
            {upcomingMatches.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="h-2 w-2 rounded-sm bg-amber-500" />
                  <span className="text-xs font-bold tracking-[0.15em] uppercase text-amber-400">Upcoming</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {upcomingMatches.slice(0, 9).map((match) => (
                    <LiveMatchCard
                      key={match.slug}
                      match={match}
                      isActive={activeStream?.match.slug === match.slug}
                      selectedServerIdx={selectedServer[match.slug] ?? 0}
                      onSelectServer={(idx) => setSelectedServer((prev) => ({ ...prev, [match.slug]: idx }))}
                      onWatch={(server) =>
                        setActiveStream((prev) =>
                          prev?.match.slug === match.slug && prev?.server.url === server.url
                            ? null
                            : { match, server }
                        )
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ENDED */}
            {endedMatches.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="h-2 w-2 rounded-sm bg-white/20" />
                  <span className="text-xs font-bold tracking-[0.15em] uppercase text-white/25">Recently Ended</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {endedMatches.map((match) => (
                    <LiveMatchCard
                      key={match.slug}
                      match={match}
                      isActive={activeStream?.match.slug === match.slug}
                      selectedServerIdx={selectedServer[match.slug] ?? 0}
                      onSelectServer={(idx) => setSelectedServer((prev) => ({ ...prev, [match.slug]: idx }))}
                      onWatch={(server) =>
                        setActiveStream((prev) =>
                          prev?.match.slug === match.slug && prev?.server.url === server.url
                            ? null
                            : { match, server }
                        )
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty */}
            {matches.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-sm bg-white/[0.04] mb-6">
                  <svg className="h-8 w-8 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">No matches available</h3>
                <p className="mt-2 text-sm text-white/30">Check back later for live football action</p>
              </div>
            )}
          </div>
        )}

        {/* Fullscreen player modal */}
        {activeStream && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4" onClick={() => setActiveStream(null)}>
            <div className="relative w-full max-w-5xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
              {/* Close bar */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-2 rounded-sm bg-red-500/10 px-3 py-1 text-[10px] font-bold tracking-wider uppercase text-red-400 border border-red-500/20">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
                    </span>
                    LIVE
                  </span>
                  <span className="text-sm font-bold text-white">{activeStream.match.tag}</span>
                </div>
                <button
                  onClick={() => setActiveStream(null)}
                  className="text-white/40 hover:text-white transition-colors p-1"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Match info bar */}
              <div className="flex items-center justify-between rounded-t-sm border border-white/[0.06] bg-[#0A0A0A] px-5 py-3">
                <div className="flex items-center gap-4 text-xs text-white/30 font-medium uppercase tracking-wider">
                  <span>{activeStream.match.league}</span>
                  <span className="text-white/10">•</span>
                  <span>{activeStream.server.server}</span>
                </div>
                <div className="text-xs text-white/20 uppercase tracking-wider">
                  {formatLiveDate(activeStream.match.kickoff)}
                </div>
              </div>

              {/* Player */}
              <div className="aspect-video bg-black border-x border-white/[0.06]">
                <iframe
                  src={activeStream.server.url}
                  className="h-full w-full"
                  allowFullScreen
                  allow="autoplay; fullscreen; encrypted-media"
                  title={`${activeStream.match.tag} - ${activeStream.server.server}`}
                />
              </div>

              {/* Server switcher */}
              {activeStream.match.iframes.length > 1 && (
                <div className="rounded-b-sm border border-t-0 border-white/[0.06] bg-[#0A0A0A] px-5 py-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/20 mr-2">Servers:</span>
                    {activeStream.match.iframes.map((srv, idx) => (
                      <button
                        key={srv.server}
                        onClick={() => {
                          setSelectedServer((prev) => ({ ...prev, [activeStream.match.slug]: idx }));
                          setActiveStream((prev) => (prev ? { ...prev, server: srv } : null));
                        }}
                        className={`rounded-sm px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all ${
                          activeStream.server.server === srv.server
                            ? 'bg-[#D7FF00]/10 text-[#D7FF00] border border-[#D7FF00]/30'
                            : 'bg-white/[0.04] text-white/40 hover:bg-white/[0.08] hover:text-white/70 border border-white/[0.06]'
                        }`}
                      >
                        {srv.server}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// --- Live Match Card ---
function LiveMatchCard({
  match,
  isActive,
  selectedServerIdx,
  onSelectServer,
  onWatch,
}: {
  match: LiveMatch;
  isActive: boolean;
  selectedServerIdx: number;
  onSelectServer: (idx: number) => void;
  onWatch: (server: StreamIframe) => void;
}) {
  const status = getMatchStatus(match);
  const teams = parseLiveMatchTeams(match.tag);
  const serverIdx = Math.min(selectedServerIdx, match.iframes.length - 1);
  const activeServer = match.iframes[serverIdx];

  const isLive = status === 'live';
  const isUpcoming = status === 'upcoming';

  const statusStyle = isLive
    ? 'border-red-500/20 bg-red-500/[0.02]'
    : isUpcoming
      ? 'border-amber-500/10 bg-amber-500/[0.02]'
      : 'border-white/[0.04] bg-[#080808]';

  const statusDot = isLive ? 'bg-red-500' : isUpcoming ? 'bg-amber-500' : 'bg-white/20';
  const statusLabel = isLive ? 'LIVE' : isUpcoming ? formatLiveDate(match.kickoff) : 'ENDED';
  const statusColor = isLive ? 'text-red-400' : isUpcoming ? 'text-amber-400' : 'text-white/25';

  return (
    <div className={`rounded-sm border p-5 transition-all duration-300 card-hover ${statusStyle} ${isActive ? 'border-[#D7FF00]/40 ring-1 ring-[#D7FF00]/10' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-white/25 truncate max-w-[60%]" title={match.league}>
          {match.league}
        </span>
        <span className={`flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase ${statusColor}`}>
          <span className="relative flex h-1.5 w-1.5">
            {isLive && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            )}
            <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${statusDot}`} />
          </span>
          {statusLabel}
        </span>
      </div>

      {/* Teams */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-sm bg-white/[0.06] text-[10px] font-bold text-white uppercase border border-white/[0.08]">
            {teams.home.slice(0, 3)}
          </div>
          <span className="text-sm font-bold text-white truncate" title={teams.home}>
            {teams.home}
          </span>
        </div>
        <span className="flex-shrink-0 text-[10px] font-black text-[#D7FF00] tracking-widest">VS</span>
        <div className="flex items-center gap-2 min-w-0 flex-row-reverse">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-sm bg-white/[0.06] text-[10px] font-bold text-white uppercase border border-white/[0.08]">
            {teams.away.slice(0, 3)}
          </div>
          <span className="text-sm font-bold text-white truncate" title={teams.away}>
            {teams.away}
          </span>
        </div>
      </div>

      {/* Server selector */}
      {match.iframes.length > 1 && (
        <div className="flex gap-1 flex-wrap mb-3">
          {match.iframes.map((srv, idx) => (
            <button
              key={srv.server}
              onClick={() => onSelectServer(idx)}
              className={`rounded-sm px-2 py-1 text-[9px] font-bold uppercase tracking-wider transition-all ${
                idx === serverIdx
                  ? 'bg-[#D7FF00]/10 text-[#D7FF00] border border-[#D7FF00]/30'
                  : 'bg-white/[0.03] text-white/30 hover:bg-white/[0.06] hover:text-white/50 border border-white/[0.06]'
              }`}
            >
              {srv.server}
            </button>
          ))}
        </div>
      )}

      {/* Watch button */}
      <button
        onClick={() => activeServer && onWatch(activeServer)}
        className={`w-full rounded-sm py-2.5 text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
          isActive
            ? 'bg-[#D7FF00]/10 text-[#D7FF00] border border-[#D7FF00]/30'
            : isLive
              ? 'bg-red-500 text-white hover:bg-red-400 glow-red'
              : 'bg-white/[0.04] text-white/40 hover:bg-white/[0.08] hover:text-white/60 border border-white/[0.06]'
        }`}
        disabled={!activeServer}
      >
        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z"/>
        </svg>
        {isActive ? 'Hide' : isLive ? 'Watch Live' : 'Watch'}
      </button>
    </div>
  );
}
