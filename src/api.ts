import type { ApiResponse, Match, LiveStreamsResponse, LiveMatch, MatchStatus } from './types';

const SCOREBAT_API = 'https://www.scorebat.com/video-api/v3/';
const LIVE_STREAMS_API = 'https://api.embedsportex.site/api/streams';

// --- ScoreBat Highlights API ---
export async function fetchMatches(): Promise<Match[]> {
  try {
    const response = await fetch(SCOREBAT_API);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const data: ApiResponse = await response.json();
    return data.response || [];
  } catch (error) {
    console.error('Failed to fetch matches:', error);
    return [];
  }
}

// --- EmbedSportex Live Streams API ---
export async function fetchLiveStreams(): Promise<LiveMatch[]> {
  try {
    const response = await fetch(`${LIVE_STREAMS_API}?cache=${Date.now()}`);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const data: LiveStreamsResponse = await response.json();
    return data.football || [];
  } catch (error) {
    console.error('Failed to fetch live streams:', error);
    return [];
  }
}

export function getMatchStatus(match: LiveMatch): MatchStatus {
  const now = Date.now();
  const start = new Date(match.kickoff.replace(' ', 'T') + '+07:00').getTime();
  const end = new Date(match.endTime.replace(' ', 'T') + '+07:00').getTime();

  if (now < start) return 'upcoming';
  if (now <= end) return 'live';
  return 'ended';
}

export function parseLiveMatchTeams(tag: string): { home: string; away: string } {
  const parts = tag.split(' vs ');
  return {
    home: parts[0]?.trim() || 'Home',
    away: parts[1]?.trim() || 'Away',
  };
}

export function formatLiveDate(dateString: string): string {
  const date = new Date(dateString.replace(' ', 'T') + '+07:00');
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

// --- Shared Utilities ---
export function extractLeagues(matches: Match[]): { name: string; count: number }[] {
  const leagueMap = new Map<string, number>();
  matches.forEach((match) => {
    const league = match.competition;
    leagueMap.set(league, (leagueMap.get(league) || 0) + 1);
  });
  return Array.from(leagueMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function sanitizeEmbed(embed: string): string {
  const srcMatch = embed.match(/src=["']([^"']+)["']/);
  if (srcMatch) return srcMatch[1];
  return embed;
}
