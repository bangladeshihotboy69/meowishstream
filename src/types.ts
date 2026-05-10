export interface Team {
  name: string;
  slug: string;
  id: number;
}

export interface Video {
  id: string;
  title: string;
  embed: string;
}

export interface Match {
  title: string;
  competition: string;
  matchviewUrl: string;
  competitionUrl: string;
  thumbnail: string;
  date: string;
  homeTeam: Team;
  awayTeam: Team;
  videos: Video[];
}

export interface ApiResponse {
  warning?: string;
  response: Match[];
}

export interface League {
  name: string;
  count: number;
}

// Live stream types from EmbedSportex
export interface StreamIframe {
  server: string;
  url: string;
}

export interface LiveMatch {
  slug: string;
  tag: string;
  kickoff: string;
  endTime: string;
  league: string;
  iframes: StreamIframe[];
}

export interface LiveStreamsResponse {
  success: boolean;
  timestamp: number;
  READ_ME?: string;
  football: LiveMatch[];
  basketball?: LiveMatch[];
  amfootball?: LiveMatch[];
  baseball?: LiveMatch[];
  badminton?: LiveMatch[];
  volleyball?: LiveMatch[];
  tennis?: LiveMatch[];
  race?: LiveMatch[];
  fight?: LiveMatch[];
  other?: LiveMatch[];
}

export type MatchStatus = 'live' | 'upcoming' | 'ended';
