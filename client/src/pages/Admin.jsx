import { useState } from 'react';
import ProtectedRoute from '../components/common/ProtectedRoute.jsx';
import Overview from '../components/admin/Overview.jsx';
import JobsPanel from '../components/admin/JobsPanel.jsx';
import { EnquiriesPanel, MessagesPanel, ApplicationsPanel, UsersPanel, TestimonialsPanel } from '../components/admin/AdminPanels.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import FeedbackPanel from '../components/admin/FeedbackPanel.jsx';

const tabs = [
  ['overview', 'Overview', Overview],
  ['enquiries', 'Enquiries', EnquiriesPanel],
  ['messages', 'Messages', MessagesPanel],
  ['feedback', 'Student Feedback', FeedbackPanel],
  ['jobs', 'Jobs', JobsPanel],
  ['applications', 'Applications', ApplicationsPanel],
  ['testimonials', 'Testimonials', TestimonialsPanel],
  ['users', 'Users', UsersPanel],
];

function Dashboard() {
  const [tab, setTab] = useState('overview');
  const { user } = useAuth();
  const Active = tabs.find((t) => t[0] === tab)[2];
  return (
    <div className="admin">
      <aside className="admin-side">
        <p className="admin-user">Signed in as<br /><strong>{user.name}</strong></p>
        {tabs.map(([key, label]) => (
          <button key={key} className={tab === key ? 'active' : ''} onClick={() => setTab(key)}>{label}</button>
        ))}
      </aside>
      <section className="admin-main"><Active /></section>
    </div>
  );
}

export default function Admin() {
  return (
    <ProtectedRoute admin>
      <Dashboard />
    </ProtectedRoute>
  );
}
