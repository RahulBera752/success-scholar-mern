import { useEffect, useState } from 'react';
import { api } from '../../api.js';
import Alert from '../common/Alert.jsx';

const items = [
  ['users', 'Registered students'], ['enquiries', 'Course enquiries'], ['newEnquiries', 'New enquiries'],
  ['messages', 'Contact messages'], ['jobs', 'Active jobs'], ['applications', 'Job applications'], ['pendingTestimonials', 'Testimonials to review'],
];

export default function Overview() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    api('/admin/stats', { auth: true }).then(setStats).catch((e) => setError(e.message));
  }, []);
  return (
    <div>
      <h2>Overview</h2>
      <Alert>{error}</Alert>
      <div className="stat-cards">
        {items.map(([k, label]) => (
          <div className="card stat-card" key={k}><strong>{stats ? stats[k] : '–'}</strong><span>{label}</span></div>
        ))}
      </div>
    </div>
  );
}
