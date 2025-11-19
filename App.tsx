import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { PublicView } from './pages/PublicView';
import { AdminView } from './pages/AdminView';
import { loadData } from './services/dataService';
import { AppData } from './types';

// Admin Guard Component
const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const authCode = queryParams.get('auth');
  
  // IMPORTANT: Simple query param auth as requested.
  if (authCode !== 'mysecretcode') {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  const [data, setData] = useState<AppData>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const loadedData = await loadData();
      setData(loadedData);
      setLoading(false);
    };
    init();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<PublicView data={data} />} />
        <Route 
          path="/admin" 
          element={
            <AdminGuard>
              <AdminView data={data} setData={setData} />
            </AdminGuard>
          } 
        />
      </Routes>
    </HashRouter>
  );
};

export default App;