import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Match } from './types';
import { fetchMatches, extractLeagues } from './api';
import Header from './components/Header';
import Hero from './components/Hero';
import LiveStreams from './components/LiveStreams';
import LeagueFilter from './components/LeagueFilter';
import MatchCard from './components/MatchCard';
import LoadingSkeleton from './components/LoadingSkeleton';
import Footer from './components/Footer';

export default function App() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeague, setSelectedLeague] = useState('');
  const [activeTab, setActiveTab] = useState<'live' | 'highlights'>('live');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchMatches();
        setMatches(data);
        setError(null);
      } catch {
        setError('Failed to load matches. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const leagues = useMemo(() => extractLeagues(matches), [matches]);

  const filteredMatches = useMemo(() => {
    let result = matches;

    if (selectedLeague) {
      result = result.filter((m) => m.competition === selectedLeague);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.competition.toLowerCase().includes(q) ||
          m.homeTeam.name.toLowerCase().includes(q) ||
          m.awayTeam.name.toLowerCase().includes(q)
      );
    }

    return result;
  }, [matches, selectedLeague, searchQuery]);

  const featuredMatch = useMemo(() => {
    const withVideos = matches.filter((m) => m.videos && m.videos.length > 0);
    if (withVideos.length === 0) return matches[0] || null;
    return withVideos[0];
  }, [matches]);

  const scrollToContent = useCallback(() => {
    document.getElementById('matches-section')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-[#060606] text-white">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <Hero featuredMatch={featuredMatch} onWatchClick={scrollToContent} />

      <main id="matches-section" className="mx-auto max-w-7xl px-4 py-10 sm:py-16">
        {/* DAZN-style tab switcher */}
        <div className="mb-10">
          <div className="flex items-center gap-1 border-b border-white/[0.08] pb-0">
            <button
              onClick={() => setActiveTab('live')}
              className={`relative px-6 py-3 text-sm font-bold tracking-wider uppercase transition-all ${
                activeTab === 'live'
                  ? 'text-[#D7FF00]'
                  : 'text-white/35 hover:text-white/60'
              }`}
            >
              Live Streams
              {activeTab === 'live' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D7FF00]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('highlights')}
              className={`relative px-6 py-3 text-sm font-bold tracking-wider uppercase transition-all ${
                activeTab === 'highlights'
                  ? 'text-[#D7FF00]'
                  : 'text-white/35 hover:text-white/60'
              }`}
            >
              Highlights
              {activeTab === 'highlights' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D7FF00]" />
              )}
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'live' ? (
          <LiveStreams />
        ) : (
          <>
            {/* Filters section */}
            <div className="mb-8 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-white">
                    {selectedLeague || 'All Highlights'}
                  </h2>
                  <p className="mt-1 text-sm text-white/30">
                    {filteredMatches.length} {filteredMatches.length === 1 ? 'match' : 'matches'}
                  </p>
                </div>
                {(selectedLeague || searchQuery) && (
                  <button
                    onClick={() => { setSelectedLeague(''); setSearchQuery(''); }}
                    className="text-xs tracking-wider uppercase text-white/40 hover:text-[#D7FF00] transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>

              <LeagueFilter
                leagues={leagues}
                selectedLeague={selectedLeague}
                onSelectLeague={setSelectedLeague}
              />
            </div>

            {/* Content */}
            {loading ? (
              <LoadingSkeleton />
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-sm bg-red-500/10 mb-6">
                  <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">Something went wrong</h3>
                <p className="mt-2 text-sm text-white/40 max-w-md">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-6 btn-dazn px-6 py-3 text-sm uppercase tracking-wider rounded-sm"
                >
                  Retry
                </button>
              </div>
            ) : filteredMatches.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-sm bg-white/[0.04] mb-6">
                  <svg className="h-8 w-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">No matches found</h3>
                <p className="mt-2 text-sm text-white/40">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredMatches.map((match, index) => (
                  <MatchCard
                    key={`${match.title}-${match.date}-${index}`}
                    match={match}
                    isFeatured={index === 0 && selectedLeague === ''}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
