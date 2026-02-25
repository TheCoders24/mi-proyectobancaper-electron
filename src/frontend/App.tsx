import React, { useState } from 'react';
import LoginPage from './pages/login/LoginPage';
import DashboardPage from './pages/Dashboard/DashboardPages';



function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
      {isAuthenticated ? (
        <DashboardPage />
      ) : (
        <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />
      )}
    </>
  );
}

export default App;