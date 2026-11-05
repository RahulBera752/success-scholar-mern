import { useState, useEffect } from 'react';
import Modal from '../common/Modal.jsx';
import Alert from '../common/Alert.jsx';
import { api } from '../../api.js';

export default function ApplyModal({ job, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', note: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });
  useEffect(() => setMsg({ type: '', text: '' }), [job]);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const d = await api(`/jobs/${job._id}/apply`, { method: 'POST', body: form });
      setMsg({ type: 'success', text: d.message });
      setForm({ name: '', email: '', phone: '', note: '' });
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    }
  };

  return (
    <Modal open={!!job} onClose={onClose} label="Apply">
      {job && (
        <form className="form" onSubmit={submit}>
          <h3>Apply: {job.title}</h3>
          <label>Name<input required value={form.name} onChange={set('name')} /></label>
          <label>Email<input required type="email" value={form.email} onChange={set('email')} /></label>
          <label>Phone<input value={form.phone} onChange={set('phone')} /></label>
          <label>Note<textarea rows="3" value={form.note} onChange={set('note')} /></label>
          <Alert type={msg.type}>{msg.text}</Alert>
          <button className="btn btn-primary">Submit application</button>
        </form>
      )}
    </Modal>
  );
}
