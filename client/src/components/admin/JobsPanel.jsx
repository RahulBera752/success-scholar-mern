import { useState } from 'react';
import ResourcePanel from './ResourcePanel.jsx';
import Alert from '../common/Alert.jsx';
import { api } from '../../api.js';

const empty = { title: '', department: '', location: '', type: 'Full-time', description: '' };

function JobForm({ reload }) {
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    try {
      await api('/admin/jobs', { method: 'POST', auth: true, body: form });
      setForm(empty); setError(''); reload();
    } catch (err) { setError(err.message); }
  };
  return (
    <form className="inline-form" onSubmit={submit}>
      <input required placeholder="Job title" value={form.title} onChange={set('title')} />
      <input placeholder="Department" value={form.department} onChange={set('department')} />
      <input required placeholder="Location" value={form.location} onChange={set('location')} />
      <select value={form.type} onChange={set('type')}>
        {['Full-time', 'Part-time', 'Internship', 'Contract'].map((t) => <option key={t}>{t}</option>)}
      </select>
      <input required className="wide" placeholder="Short description" value={form.description} onChange={set('description')} />
      <button className="btn btn-primary btn-sm">Add job</button>
      <Alert>{error}</Alert>
    </form>
  );
}

export default function JobsPanel() {
  return (
    <ResourcePanel
      title="Jobs"
      path="/jobs"
      header={(reload) => <JobForm reload={reload} />}
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'location', label: 'Location' },
        { key: 'type', label: 'Type' },
        { label: 'Active', render: (r) => (r.active ? 'Yes' : 'No') },
      ]}
      actions={(r, load) => (
        <button
          className="btn btn-outline btn-sm"
          onClick={async () => { await api(`/admin/jobs/${r._id}`, { method: 'PUT', auth: true, body: { active: !r.active } }); load(); }}
        >
          {r.active ? 'Unpublish' : 'Publish'}
        </button>
      )}
    />
  );
}
