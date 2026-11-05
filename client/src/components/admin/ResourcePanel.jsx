import { useCallback, useEffect, useState } from 'react';
import { api } from '../../api.js';
import Alert from '../common/Alert.jsx';
import Icon from '../common/Icon.jsx';

// Generic admin list: loads rows, optional status dropdown, optional delete, optional extra actions.
export default function ResourcePanel({ title, path, columns, statusOptions, canDelete = true, actions, header }) {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    api(`/admin${path}`, { auth: true })
      .then((d) => { setRows(d); setError(''); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [path]);

  useEffect(load, [load]);

  const setStatus = async (id, status) => {
    try { await api(`/admin${path}/${id}/status`, { method: 'PATCH', auth: true, body: { status } }); load(); }
    catch (e) { setError(e.message); }
  };
  const remove = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try { await api(`/admin${path}/${id}`, { method: 'DELETE', auth: true }); load(); }
    catch (e) { setError(e.message); }
  };

  return (
    <div>
      <h2>{title} <small>({rows.length})</small></h2>
      {header?.(load)}
      <Alert>{error}</Alert>
      <div className="table-scroll">
        <table className="table">
          <thead>
            <tr>
              {columns.map((c) => <th key={c.label}>{c.label}</th>)}
              {statusOptions && <th>Status</th>}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan="20" className="empty">Loading…</td></tr>}
            {!loading && rows.length === 0 && <tr><td colSpan="20" className="empty">Nothing here yet.</td></tr>}
            {rows.map((r) => (
              <tr key={r._id}>
                {columns.map((c) => <td key={c.label}>{c.render ? c.render(r) : r[c.key]}</td>)}
                {statusOptions && (
                  <td>
                    <select value={r.status} onChange={(e) => setStatus(r._id, e.target.value)}>
                      {statusOptions.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                )}
                <td className="row-actions">
                  {actions?.(r, load)}
                  {canDelete && (
                    <button className="icon-btn danger" onClick={() => remove(r._id)} title="Delete" aria-label="Delete">
                      <Icon name="trash" size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
