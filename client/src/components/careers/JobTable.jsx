import { useState } from 'react';
import useFetch from '../common/useFetch.js';
import ApplyModal from './ApplyModal.jsx';

export default function JobTable({ query }) {
  const qs = new URLSearchParams();
  if (query.q) qs.set('q', query.q);
  if (query.location) qs.set('location', query.location);
  const { data: jobs, error, loading } = useFetch(`/jobs${qs.toString() ? `?${qs}` : ''}`);
  const [applyTo, setApplyTo] = useState(null);

  return (
    <section className="container jobs-wrap">
      <div className="table-scroll">
        <table className="table jobs">
          <thead>
            <tr><th>Job Title</th><th>Date Posted</th><th>Location</th><th>Description</th><th>Apply</th></tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan="5" className="empty">Loading…</td></tr>}
            {error && <tr><td colSpan="5" className="empty error-text">{error}</td></tr>}
            {jobs && jobs.length === 0 && <tr><td colSpan="5" className="empty">No job listings are currently available.</td></tr>}
            {jobs?.map((j) => (
              <tr key={j._id}>
                <td><strong>{j.title}</strong><br /><small>{j.department} · {j.type}</small></td>
                <td>{new Date(j.createdAt).toLocaleDateString('en-IN')}</td>
                <td>{j.location}</td>
                <td>{j.description}</td>
                <td><button className="btn btn-primary btn-sm" onClick={() => setApplyTo(j)}>Apply</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ApplyModal job={applyTo} onClose={() => setApplyTo(null)} />
    </section>
  );
}
