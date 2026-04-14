import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCompetition, getCompetitionMatches } from '../../services/api';
import { Match, Competition } from '../../types/api';
import { formatDate, formatTime, translateStatus } from '../../utils/formatters';
import Pagination from '../../components/Pagination/Pagination';
import DateInput from '../../components/DateInput/DateInput';
import './LeagueCalendar.css';

const ITEMS_PER_PAGE = 10;

const LeagueCalendar: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const competitionId = parseInt(id || '0', 10);

  const [competition, setCompetition] = useState<Competition | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadCompetition = async () => {
      try {
        const data = await getCompetition(competitionId);
        setCompetition(data);
      } catch {
        // ignore
      }
    };
    if (competitionId) {
      loadCompetition();
    }
  }, [competitionId]);

  useEffect(() => {
    const loadMatches = async (from?: string, to?: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await getCompetitionMatches(competitionId, from, to);
        setMatches(response.matches);
        setCurrentPage(1);
      } catch (err: unknown) {
        const e = err as { message?: string };
        setError(e.message || 'Не удалось загрузить матчи.');
      } finally {
        setLoading(false);
      }
    };

    if (dateFrom && dateTo) {
      loadMatches(dateFrom, dateTo);
    } else if (!dateFrom && !dateTo) {
      loadMatches();
    }
  }, [competitionId, dateFrom, dateTo]);

  const totalPages = Math.ceil(matches.length / ITEMS_PER_PAGE);
  const paginated = matches.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="calendar-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span className="breadcrumb-link" onClick={() => navigate('/leagues')}>
          Лиги
        </span>
        <span className="breadcrumb-sep"> {' > '} </span>
        <span className="breadcrumb-current">{competition?.name || '...'}</span>
      </div>

      {/* Date filters */}
      <div className="date-filter-row">
        <span className="date-label">Матчи с</span>
        <DateInput value={dateFrom} onChange={setDateFrom} />
        <span className="date-label">по</span>
        <DateInput value={dateTo} onChange={setDateTo} />
      </div>

      {/* Error */}
      {error && <div className="cal-error">{error}</div>}

      {/* Matches table */}
      {loading ? (
        <div className="cal-loading">Загрузка...</div>
      ) : (
        <>
          {paginated.length === 0 ? (
            <div className="cal-empty">Матчи не найдены</div>
          ) : (
            <table className="matches-table">
              <tbody>
                {paginated.map((match) => (
                  <tr key={match.id} className="match-row">
                    <td className="match-date">{formatDate(match.utcDate)}</td>
                    <td className="match-time">{formatTime(match.utcDate)}</td>
                    <td className="match-status">{translateStatus(match.status)}</td>
                    <td className="match-teams">
                      {match.homeTeam.name} - {match.awayTeam.name}
                    </td>
                    <td className="match-score">
                      {match.score.fullTime.home !== null
                        ? `${match.score.fullTime.home}:${match.score.fullTime.away}`
                        : '-'}
                      {match.score.extraTime?.home !== null &&
                      match.score.extraTime?.home !== undefined
                        ? ` (${match.score.extraTime.home}:${match.score.extraTime.away})`
                        : ''}
                      {match.score.penalties?.home !== null &&
                      match.score.penalties?.home !== undefined
                        ? ` (${match.score.penalties.home}:${match.score.penalties.away})`
                        : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {totalPages > 1 && (
            <Pagination current={currentPage} total={totalPages} onChange={setCurrentPage} />
          )}
        </>
      )}
    </div>
  );
};

export default LeagueCalendar;
