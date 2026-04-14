import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { getCompetitions } from '../../services/api';
import { Competition } from '../../types/api';
import Pagination from '../../components/Pagination/Pagination';
import './Leagues.css';

const ITEMS_PER_PAGE = 16;

interface OutletContext {
  searchQuery: string;
}

const Leagues: React.FC = () => {
  const navigate = useNavigate();
  const { searchQuery } = useOutletContext<OutletContext>();

  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadCompetitions();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const loadCompetitions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCompetitions();
      setCompetitions(response.competitions);
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message || 'Не удалось загрузить данные.');
    } finally {
      setLoading(false);
    }
  };

  const filtered = searchQuery
    ? competitions.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.area?.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : competitions;

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) {
    return (
      <div className="loading-wrap">
        <span>Загрузка...</span>
      </div>
    );
  }

  if (error) {
    return <div className="error-wrap">{error}</div>;
  }

  return (
    <div className="leagues-page">
      {paginated.length === 0 ? (
        <div className="empty">Ничего не найдено</div>
      ) : (
        <div className="grid">
          {paginated.map((competition) => (
            <div
              key={competition.id}
              className="card"
              onClick={() => navigate(`/league/${competition.id}`)}
            >
              {competition.emblem ? (
                <img src={competition.emblem} alt={competition.name} />
              ) : (
                <div className="card-no-img" />
              )}
              <div className="card-title">{competition.name}</div>
              <div className="card-subtitle">{competition.area?.name || ''}</div>
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

export default Leagues;
