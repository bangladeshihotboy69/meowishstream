interface LeagueFilterProps {
  leagues: { name: string; count: number }[];
  selectedLeague: string;
  onSelectLeague: (league: string) => void;
}

export default function LeagueFilter({ leagues, selectedLeague, onSelectLeague }: LeagueFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {/* All button */}
      <button
        onClick={() => onSelectLeague('')}
        className={`flex-shrink-0 rounded-sm px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition-all ${
          selectedLeague === ''
            ? 'bg-[#D7FF00] text-black'
            : 'border border-white/[0.08] bg-white/[0.03] text-white/40 hover:border-white/[0.15] hover:text-white/70'
        }`}
      >
        All
      </button>

      {leagues.map((league) => (
        <button
          key={league.name}
          onClick={() => onSelectLeague(league.name)}
          className={`flex-shrink-0 rounded-sm px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition-all ${
            selectedLeague === league.name
              ? 'bg-[#D7FF00] text-black'
              : 'border border-white/[0.08] bg-white/[0.03] text-white/40 hover:border-white/[0.15] hover:text-white/70'
          }`}
        >
          {league.name}
        </button>
      ))}
    </div>
  );
}
