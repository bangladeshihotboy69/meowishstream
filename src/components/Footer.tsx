export default function Footer() {
  const leagues = [
    'Premier League', 'La Liga', 'Bundesliga', 'Serie A',
    'Ligue 1', 'Eredivisie', 'Liga Portugal', 'FA Cup',
  ];

  return (
    <footer className="border-t border-white/[0.06] bg-[#060606]">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <svg className="h-6 w-6 text-[#D7FF00]" viewBox="0 0 28 28" fill="currentColor">
                <path d="M9 4.5v19L24 14z"/>
              </svg>
              <span className="text-lg font-extrabold tracking-tighter text-white uppercase">
                FOOT<span className="text-[#D7FF00]">STREAM</span>
              </span>
            </div>
            <p className="text-sm text-white/25 leading-relaxed max-w-xs">
              Watch free football streams and highlights from top leagues worldwide. Powered by EmbedSportex & ScoreBat.
            </p>
          </div>

          {/* Leagues */}
          <div>
            <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/20 mb-5">
              Top Leagues
            </h4>
            <ul className="space-y-2.5">
              {leagues.map((league) => (
                <li key={league}>
                  <span className="text-xs font-medium text-white/30 hover:text-[#D7FF00] transition-colors cursor-pointer uppercase tracking-wider">
                    {league}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/20 mb-5">
              Disclaimer
            </h4>
            <p className="text-xs text-white/15 leading-relaxed">
              FootStream aggregates publicly available football content. We do not host any video files.
              All streams and highlights are embedded directly from official third-party sources.
              For personal, non-commercial use only.
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-medium uppercase tracking-wider text-white/15">
            &copy; {new Date().getFullYear()} FootStream
          </p>
          <div className="flex items-center gap-4 text-[10px] font-medium uppercase tracking-wider text-white/10">
            <span>Data by EmbedSportex & ScoreBat</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
