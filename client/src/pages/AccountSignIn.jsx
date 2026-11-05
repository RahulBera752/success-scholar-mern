import { useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Alert from '../components/common/Alert.jsx';

const accountLabels = {
  student: 'Student',
  corporate: 'Corporate',
  college: 'College',
  school: 'School',
  admin: 'Administrator',
};

export default function AccountSignIn() {
  const { accountType } = useParams();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!accountLabels[accountType]) return <Navigate to="/signin" replace />;
  const label = accountLabels[accountType];

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const user = await login(form.email, form.password, accountType);
      navigate(accountType === 'admin' ? '/admin' : `/${user.accountType}`, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="account-signin">
      <form className="card form account-signin__card" onSubmit={submit} noValidate>
        <p className="account-signin__eyebrow">Success Scholar</p>
        <h1>{label} Sign-in</h1>
        <label>
          Email address
          <input
            required
            autoComplete="email"
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
        </label>
        <label>
          Password
          <span className="password-field">
            <input
              required
              autoComplete="current-password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
            />
            <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-pressed={showPassword}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </span>
        </label>
        <Alert>{error}</Alert>
        <button className="btn btn-primary btn-block" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
        <p className="hint"><Link to="/signin">← Choose another account type</Link></p>
      </form>
    </section>
  );
}
