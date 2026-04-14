// API Response Types for football-data.org

export interface Area {
  id: number;
  name: string;
  code: string;
  flag: string | null;
}

export interface Competition {
  id: number;
  name: string;
  code: string;
  type: string;
  emblem: string | null;
  area: Area;
  currentSeason?: Season;
  numberOfAvailableSeasons?: number;
}

export interface Season {
  id: number;
  startDate: string;
  endDate: string;
  currentMatchday: number | null;
  winner: Team | null;
}

export interface Team {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
  address?: string;
  website?: string;
  founded?: number;
  clubColors?: string;
  venue?: string;
  coach?: Coach;
  squad?: Player[];
  runningCompetitions?: Competition[];
}

export interface Coach {
  id: number;
  firstName: string;
  lastName: string;
  name: string;
  dateOfBirth: string;
  nationality: string;
}

export interface Player {
  id: number;
  name: string;
  position: string;
  dateOfBirth: string;
  nationality: string;
}

export interface Score {
  winner: 'HOME_TEAM' | 'AWAY_TEAM' | 'DRAW' | null;
  duration: 'REGULAR' | 'EXTRA_TIME' | 'PENALTY_SHOOTOUT';
  fullTime: {
    home: number | null;
    away: number | null;
  };
  halfTime: {
    home: number | null;
    away: number | null;
  };
  extraTime?: {
    home: number | null;
    away: number | null;
  };
  penalties?: {
    home: number | null;
    away: number | null;
  };
}

export type MatchStatus =
  | 'SCHEDULED'
  | 'LIVE'
  | 'IN_PLAY'
  | 'PAUSED'
  | 'FINISHED'
  | 'POSTPONED'
  | 'SUSPENDED'
  | 'CANCELED';

export interface Match {
  id: number;
  utcDate: string;
  status: MatchStatus;
  matchday: number | null;
  stage: string;
  group: string | null;
  lastUpdated: string;
  homeTeam: {
    id: number;
    name: string;
    shortName: string;
    tla: string;
    crest: string;
  };
  awayTeam: {
    id: number;
    name: string;
    shortName: string;
    tla: string;
    crest: string;
  };
  score: Score;
  competition?: Competition;
  referees?: Referee[];
}

export interface Referee {
  id: number;
  name: string;
  type: string;
  nationality: string;
}

// API Response wrappers
export interface CompetitionsResponse {
  count: number;
  filters: Record<string, unknown>;
  competitions: Competition[];
}

export interface TeamsResponse {
  count: number;
  filters: Record<string, unknown>;
  teams: Team[];
}

export interface MatchesResponse {
  count: number;
  filters: Record<string, unknown>;
  competition?: Competition;
  matches: Match[];
}

export type TeamResponse = Team;

export type CompetitionResponse = Competition;
