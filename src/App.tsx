import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Leagues from './pages/Leagues/Leagues';
import LeagueCalendar from './pages/LeagueCalendar/LeagueCalendar';
import Teams from './pages/Teams/Teams';
import TeamCalendar from './pages/TeamCalendar/TeamCalendar';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/leagues" replace />} />
          <Route path="leagues" element={<Leagues />} />
          <Route path="league/:id" element={<LeagueCalendar />} />
          <Route path="teams" element={<Teams />} />
          <Route path="team/:id" element={<TeamCalendar />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
