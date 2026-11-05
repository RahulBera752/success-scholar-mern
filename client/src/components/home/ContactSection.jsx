import { useState } from 'react';
import SectionTitle from '../common/SectionTitle.jsx';
import Alert from '../common/Alert.jsx';
import Icon from '../common/Icon.jsx';
import SocialLinks from '../common/SocialLinks.jsx';
import { api } from '../../api.js';

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const d = await api('/contact', { method: 'POST', body: form });
      setMsg({ type: 'success', text: d.message });
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="section" id="contact">
      <SectionTitle sub="Questions about a program? Send us a message and we will reply.">Contact Us</SectionTitle>
      <div className="container contact-grid">
        <div className="card contact-info">
          <h3>Get in touch</h3>
          <p><Icon name="mail" size={20} /> info@successscholar.in</p>
          <p><Icon name="phone" size={20} /> +91 8276040204</p>
          <p><Icon name="pin" size={20} /> 57/4N, Netaji Subhash Chandra Bose Rd, Nehru Colony, Ashok Nagar, Tollygunge, Kolkata, West Bengal 700040</p>
          <SocialLinks />
        </div>
        <form className="card form" onSubmit={submit}>
          <label>Name<input required value={form.name} onChange={set('name')} /></label>
          <label>Email<input required type="email" value={form.email} onChange={set('email')} /></label>
          <label>Phone<input value={form.phone} onChange={set('phone')} /></label>
          <label>Message<textarea required rows="4" maxLength="2000" value={form.message} onChange={set('message')} /></label>
          <Alert type={msg.type}>{msg.text}</Alert>
          <button className="btn btn-primary" disabled={busy}>{busy ? 'Sending…' : 'Send Message'}</button>
        </form>
      </div>
    </section>
  );
}
