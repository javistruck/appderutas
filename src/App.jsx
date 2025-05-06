
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import HomePage from '@/pages/HomePage';
import MapPage from '@/pages/MapPage';
import RoutesPage from '@/pages/RoutesPage';
import SavedRoutesPage from '@/pages/SavedRoutesPage';
import Layout from '@/components/Layout';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/saved-routes" element={<SavedRoutesPage />} />
        </Routes>
      </Layout>
      <Toaster />
    </Router>
  );
}

export default App;
