import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import AppPage from './pages/AppPage';

function Router() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        className="flex h-screen items-center justify-center"
        style={{ background: '#030a18' }}
      >
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl animate-pulse"
          style={{ background: 'linear-gradient(135deg, #06b6d4, #0e7490)' }}
        >
          ✦
        </div>
      </div>
    );
  }

  return user ? <AppPage /> : <Landing />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}
