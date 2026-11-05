import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Alert from '../components/common/Alert.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const u = await login(form.email, form.password);
      navigate(loc.state?.from || (u.role === 'admin' ? '/admin' : '/'), { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-wrap">
      <form className="card form auth-card" onSubmit={submit}>
        <h1>Log in</h1>
        <label>Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label>Password<input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
        <Alert>{error}</Alert>
        <button className="btn btn-primary" disabled={busy}>{busy ? 'Signing in…' : 'Log in'}</button>
        <p className="hint">New here? <Link to="/register">Create an account</Link></p>
        <p className="hint demo-hint">Demo admin: admin@successscholar.demo / Admin@12345 (after running the seed script)</p>
      </form>
    </div>
  );
}
