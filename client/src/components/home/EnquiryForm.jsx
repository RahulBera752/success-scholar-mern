import { useState } from 'react';
import { api } from '../../api.js';
import Alert from '../common/Alert.jsx';

const times = ['Morning (9am - 12pm)', 'Afternoon (12pm - 4pm)', 'Evening (4pm - 8pm)', 'Anytime'];

export default function EnquiryForm({ courseName, onDone }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', bestTime: times[0], message: '' });
  const [status, setStatus] = useState({ type: '', text: '' });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setStatus({ type: '', text: '' });
    try {
      const d = await api('/enquiries', { method: 'POST', body: { ...form, course: courseName } });
      setStatus({ type: 'success', text: d.message });
      setForm({ name: '', email: '', phone: '', bestTime: times[0], message: '' });
      onDone?.();
    } catch (err) {
      setStatus({ type: 'error', text: err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="form" onSubmit={submit}>
      <h3>Enquiry for {courseName}</h3>
      <p className="contact-lines">
        <span>📞 Call Us: +91 8276040204</span>
        <span>📧 Email Us: info@successscholar.in</span>
      </p>
      <label>Name<input required value={form.name} onChange={set('name')} placeholder="Your name" /></label>
      <label>Email<input required type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" /></label>
      <label>Phone<input required value={form.phone} onChange={set('phone')} placeholder="Mobile number" /></label>
      <label>Best Time to Reach You
        <select value={form.bestTime} onChange={set('bestTime')}>
          {times.map((t) => <option key={t}>{t}</option>)}
        </select>
      </label>
      <label>Message (optional)<textarea rows="3" value={form.message} onChange={set('message')} /></label>
      <Alert type={status.type}>{status.text}</Alert>
      <button className="btn btn-primary" disabled={busy}>{busy ? 'Sending…' : 'Submit Enquiry'}</button>
    </form>
  );
}
