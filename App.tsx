import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import DashboardPage from './pages/DashboardPage';
import AuthPage from './pages/AuthPage';
import { useAuth } from './hooks/useAuth';

const App: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col font-sans bg-brand-light">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8">
        {user ? <DashboardPage /> : <AuthPage />}
      </main>
      <Footer />
    </div>
  );
};

export default App;
