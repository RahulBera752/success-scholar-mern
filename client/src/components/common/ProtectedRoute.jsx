import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function ProtectedRoute({ admin = false, accountType, children }) {
  const { user, loading } = useAuth();
  const loc = useLocation();
  if (loading) return <p className="center-note">Loading…</p>;
  if (!user) return <Navigate to={admin ? '/signin/admin' : '/signin'} state={{ from: loc.pathname }} replace />;
  if (admin && user.role !== 'admin') {
    return (
      <div className="center-note">
        <h2>Admin access required</h2>
        <p>You are signed in as a student. Log in with the demo admin account to view the dashboard.</p>
      </div>
    );
  }
  if (accountType && user.accountType !== accountType) {
    return <Navigate to={`/signin/${accountType}`} state={{ from: loc.pathname }} replace />;
  }
  return children;
}
