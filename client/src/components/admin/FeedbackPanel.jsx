import { useCallback, useEffect, useState } from 'react';
import { api } from '../../api.js';
import '../../styles/admin-feedback.css';

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
};

export default function FeedbackPanel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [updatingId, setUpdatingId] = useState('');

  const loadFeedback = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await api('/feedback/admin', { auth: true });
      setItems(Array.isArray(result) ? result : result?.feedback || []);
    } catch (requestError) {
      setError(requestError.message || 'Could not load student feedback.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadFeedback(); }, [loadFeedback]);

  const updateStatus = async (item, status) => {
    setUpdatingId(item._id);
    setError('');
    try {
      const result = await api(`/feedback/admin/${item._id}`, {
        method: 'PATCH',
        auth: true,
        body: { status }
      });
      const updated = result?.feedback || { ...item, status };
      setItems((current) => current.map((entry) => entry._id === item._id ? { ...entry, ...updated } : entry));
      setSelected((current) => current?._id === item._id ? { ...current, ...updated } : current);
    } catch (requestError) {
      setError(requestError.message || 'Could not update feedback status.');
    } finally {
      setUpdatingId('');
    }
  };

  const visibleItems = items.filter((item) => filter === 'all' || item.status === filter);
  const newCount = items.filter((item) => item.status === 'new').length;

  return (
    <div className="admin-feedback">
      <div className="admin-feedback-heading">
        <div>
          <p className="admin-feedback-eyebrow">STUDENT VOICE</p>
          <h1>Student Feedback</h1>
          <p>Review feedback submitted from the student dashboard.</p>
        </div>
        <button type="button" className="admin-feedback-refresh" onClick={loadFeedback} disabled={loading}>
          {loading ? 'Refreshing…' : '↻ Refresh'}
        </button>
      </div>

      <div className="admin-feedback-stats">
        <div><span>Total submissions</span><strong>{items.length}</strong></div>
        <div><span>New to review</span><strong>{newCount}</strong></div>
        <div><span>Reviewed</span><strong>{items.filter((item) => item.status === 'reviewed').length}</strong></div>
      </div>

      <div className="admin-feedback-toolbar">
        <div>
          <h2>Submissions</h2>
          <p>Feedback is visible only to authenticated administrators.</p>
        </div>
        <label>
          <span className="sr-only">Filter feedback status</span>
          <select value={filter} onChange={(event) => setFilter(event.target.value)}>
            <option value="all">All feedback</option>
            <option value="new">New</option>
            <option value="reviewed">Reviewed</option>
            <option value="resolved">Resolved</option>
          </select>
        </label>
      </div>

      {error && <div className="admin-feedback-error" role="alert">{error}</div>}

      {loading ? (
        <div className="admin-feedback-empty">Loading feedback…</div>
      ) : visibleItems.length === 0 ? (
        <div className="admin-feedback-empty">
          <span aria-hidden="true">✦</span>
          <h3>No feedback here yet</h3>
          <p>New student submissions will appear in this section.</p>
        </div>
      ) : (
        <div className="admin-feedback-list">
          {visibleItems.map((item) => (
            <article className="admin-feedback-card" key={item._id}>
              <div className="admin-feedback-card-top">
                <div className="admin-feedback-student-avatar">
                  {(item.studentName || item.name || 'S').trim().charAt(0).toUpperCase()}
                </div>
                <div className="admin-feedback-student">
                  <strong>{item.studentName || item.name || 'Student'}</strong>
                  <span>{item.email || 'No email provided'}</span>
                </div>
                <span className={`admin-feedback-status status-${item.status || 'new'}`}>
                  {item.status || 'new'}
                </span>
              </div>

              <div className="admin-feedback-meta">
                <span>{item.category || 'General feedback'}</span>
                <span className="admin-feedback-stars" aria-label={`${item.rating || 0} out of 5 stars`}>
                  {'★'.repeat(Math.max(0, Math.min(5, Number(item.rating) || 0)))}
                  <span>{'★'.repeat(5 - Math.max(0, Math.min(5, Number(item.rating) || 0)))}</span>
                </span>
                <time>{formatDate(item.createdAt)}</time>
              </div>

              <p className="admin-feedback-message">{item.message}</p>
              {item.suggestion && <p className="admin-feedback-suggestion"><strong>Suggestion:</strong> {item.suggestion}</p>}

              <div className="admin-feedback-card-actions">
                <button type="button" className="admin-feedback-view" onClick={() => setSelected(item)}>View details</button>
                <label>
                  <span className="sr-only">Update status</span>
                  <select
                    value={item.status || 'new'}
                    disabled={updatingId === item._id}
                    onChange={(event) => updateStatus(item, event.target.value)}
                  >
                    <option value="new">New</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </label>
              </div>
            </article>
          ))}
        </div>
      )}

      {selected && (
        <div className="admin-feedback-detail-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
          <section className="admin-feedback-detail" role="dialog" aria-modal="true" aria-labelledby="admin-feedback-detail-title">
            <button type="button" className="admin-feedback-detail-close" onClick={() => setSelected(null)} aria-label="Close details">×</button>
            <p className="admin-feedback-eyebrow">FEEDBACK DETAILS</p>
            <h2 id="admin-feedback-detail-title">{selected.category || 'Student feedback'}</h2>
            <p className="admin-feedback-detail-person">{selected.studentName || selected.name || 'Student'} · {selected.email || 'No email'}{selected.phone ? ` · ${selected.phone}` : ''}</p>
            <p className="admin-feedback-detail-rating">{'★'.repeat(Number(selected.rating) || 0)}{'☆'.repeat(5 - (Number(selected.rating) || 0))} <span>{selected.rating || 0}/5</span></p>
            <h3>Feedback</h3>
            <p className="admin-feedback-detail-copy">{selected.message}</p>
            {selected.suggestion && <><h3>Suggestion</h3><p className="admin-feedback-detail-copy">{selected.suggestion}</p></>}
            <p className="admin-feedback-detail-date">Submitted {formatDate(selected.createdAt)}</p>
            <div className="admin-feedback-detail-actions">
              <button type="button" onClick={() => updateStatus(selected, 'reviewed')} disabled={updatingId === selected._id}>Mark reviewed</button>
              <button type="button" onClick={() => updateStatus(selected, 'resolved')} disabled={updatingId === selected._id}>Mark resolved</button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
