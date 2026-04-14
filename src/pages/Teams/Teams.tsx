import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { getTeams } from '../../services/api';
import { Team } from '../../types/api';
import Pagination from '../../components/Pagination/Pagination';
import './Teams.css';

const ITEMS_PER_PAGE = 16;

interface OutletContext {
  searchQuery: string;
}

const Teams: React.FC = () => {
  const navigate = useNavigate();
  const { searchQuery } = useOutletContext<OutletContext>();

  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    loadTeams();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const loadTeams = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getTeams();
      setTeams(response.teams);
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message || 'Не удалось загрузить данные.');
    } finally {
      setLoading(false);
    }
  };

  const filtered = searchQuery
    ? teams.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.shortName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : teams;

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleCardClick = (team: Team) => {
    setSelectedId(team.id);
    navigate(`/team/${team.id}`);
  };

  if (loading) {
    return <div className="loading-wrap">Загрузка...</div>;
  }

  if (error) {
    return <div className="error-wrap">{error}</div>;
  }

  return (
    <div className="teams-page">
      {paginated.length === 0 ? (
        <div className="empty">Ничего не найдено</div>
      ) : (
        <div className="grid">
          {paginated.map((team) => (
            <div
              key={team.id}
              className={`card ${selectedId === team.id ? 'selected' : ''}`}
              onClick={() => handleCardClick(team)}
            >
              {team.crest ? (
                <img src={team.crest} alt={team.name} />
              ) : (
                <div className="card-no-img" />
              )}
              <div className="card-title">{team.name}</div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination current={currentPage} total={totalPages} onChange={setCurrentPage} />
      )}
    </div>
  );
};

export default Teams;
