import axios, { AxiosError } from 'axios';
import type {
  CompetitionsResponse,
  TeamsResponse,
  MatchesResponse,
  TeamResponse,
  CompetitionResponse,
} from '../types/api';

// Прямой API запрос. Для dev-сервера используем Vite Proxy (/api/football), для PROD - прямую ссылку.
// Внимание: на GitHub Pages запросы к api.football-data.org будут блокироваться политикой CORS браузера
// (это ограничение самого провайдера API). Для просмотра на GH Pages нужен CORS Unblocker plugin.
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://api.football-data.org/v4' 
  : '/api/football';

const API_KEY = import.meta.env.VITE_FOOTBALL_API_KEY || '';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: API_KEY ? { 'X-Auth-Token': API_KEY } : {},
});

// ── In-memory cache (5 minutes TTL) ─────────────────────────────────────────
const cache = new Map<string, { data: unknown; ts: number }>();
const CACHE_TTL = 5 * 60 * 1000;

function getCache<T>(key: string): T | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.ts < CACHE_TTL) return entry.data as T;
  cache.delete(key);
  return null;
}

function setCache(key: string, data: unknown) {
  cache.set(key, { data, ts: Date.now() });
}

// ── In-flight deduplication (prevents double-fetch on same key) ──────────────
const inFlight = new Map<string, Promise<unknown>>();

async function cachedGet<T>(url: string, params?: Record<string, string>): Promise<T> {
  const key = url + (params ? JSON.stringify(params) : '');

  const cached = getCache<T>(key);
  if (cached) return cached;

  if (inFlight.has(key)) return inFlight.get(key) as Promise<T>;

  const promise = apiClient
    .get<T>(url, { params })
    .then((res) => {
      setCache(key, res.data);
      inFlight.delete(key);
      return res.data;
    })
    .catch((err: unknown) => {
      inFlight.delete(key);
      throw err;
    });

  inFlight.set(key, promise);
  return promise;
}

// ── Error handling ───────────────────────────────────────────────────────────
export interface ApiError {
  message: string;
  errorCode?: number;
}

const handleApiError = (error: AxiosError): ApiError => {
  if (error.response) {
    const status = error.response.status;
    switch (status) {
      case 400:
        return { message: 'Неверный запрос. Проверьте параметры.', errorCode: 400 };
      case 401:
        return {
          message: 'Требуется авторизация. Пропишите API ключ в .env',
          errorCode: 401,
        };
      case 403:
        return {
          message: 'CORS Блокировка или Доступ запрещен. Если вы на GitHub Pages, используйте CORS Unblocker плагин или запустите проект локально.',
          errorCode: 403,
        };
      case 404:
        return { message: 'Данные не найдены.', errorCode: 404 };
      case 429:
        return {
          message: 'Превышен лимит запросов (10/мин). Подождите минуту и обновите страницу.',
          errorCode: 429,
        };
      default:
        return { message: 'Произошла ошибка при загрузке данных.', errorCode: status };
    }
  }
  if (error.request) {
    return { message: 'Сервер не отвечает или запрос заблокирован браузером (CORS). Пожалуйста, запустите проект локально.' };
  }
  return { message: 'Произошла неизвестная ошибка.' };
};

// ── API Methods ──────────────────────────────────────────────────────────────

export const getCompetitions = async (): Promise<CompetitionsResponse> => {
  try {
    const res = await cachedGet<CompetitionsResponse>('/competitions');
    return { ...res, competitions: res?.competitions || [] };
  } catch (error) {
    throw handleApiError(error as AxiosError);
  }
};

export const getCompetition = async (id: number): Promise<CompetitionResponse> => {
  try {
    return await cachedGet<CompetitionResponse>(`/competitions/${id}`);
  } catch (error) {
    throw handleApiError(error as AxiosError);
  }
};

export const getCompetitionMatches = async (
  competitionId: number,
  dateFrom?: string,
  dateTo?: string
): Promise<MatchesResponse> => {
  try {
    const params: Record<string, string> = {};
    if (dateFrom) params.dateFrom = dateFrom;
    if (dateTo) params.dateTo = dateTo;
    const res = await cachedGet<MatchesResponse>(`/competitions/${competitionId}/matches`, params);
    return { ...res, matches: res?.matches || [] };
  } catch (error) {
    throw handleApiError(error as AxiosError);
  }
};

export const getTeams = async (): Promise<TeamsResponse> => {
  try {
    const res = await cachedGet<TeamsResponse>('/teams');
    return { ...res, teams: res?.teams || [] };
  } catch (error) {
    throw handleApiError(error as AxiosError);
  }
};

export const getTeam = async (id: number): Promise<TeamResponse> => {
  try {
    return await cachedGet<TeamResponse>(`/teams/${id}`);
  } catch (error) {
    throw handleApiError(error as AxiosError);
  }
};

export const getTeamMatches = async (
  teamId: number,
  dateFrom?: string,
  dateTo?: string
): Promise<MatchesResponse> => {
  try {
    const params: Record<string, string> = {};
    if (dateFrom) params.dateFrom = dateFrom;
    if (dateTo) params.dateTo = dateTo;
    const res = await cachedGet<MatchesResponse>(`/teams/${teamId}/matches`, params);
    return { ...res, matches: res?.matches || [] };
  } catch (error) {
    throw handleApiError(error as AxiosError);
  }
};
