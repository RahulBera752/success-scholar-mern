import ResourcePanel from './ResourcePanel.jsx';
import { api } from '../../api.js';

const date = (r) => new Date(r.createdAt).toLocaleDateString('en-IN');

export const EnquiriesPanel = () => (
  <ResourcePanel
    title="Course Enquiries" path="/enquiries" statusOptions={['new', 'contacted', 'closed']}
    columns={[
      { label: 'Date', render: date }, { key: 'course', label: 'Course' }, { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' }, { key: 'phone', label: 'Phone' }, { key: 'bestTime', label: 'Best time' },
    ]}
  />
);

export const MessagesPanel = () => (
  <ResourcePanel
    title="Contact Messages" path="/messages" statusOptions={['new', 'read', 'closed']}
    columns={[{ label: 'Date', render: date }, { key: 'name', label: 'Name' }, { key: 'email', label: 'Email' }, { key: 'message', label: 'Message' }]}
  />
);

export const ApplicationsPanel = () => (
  <ResourcePanel
    title="Job Applications" path="/applications"
    columns={[
      { label: 'Date', render: date }, { label: 'Job', render: (r) => r.job?.title || '(removed)' },
      { key: 'name', label: 'Name' }, { key: 'email', label: 'Email' }, { key: 'note', label: 'Note' },
    ]}
  />
);

export const UsersPanel = () => (
  <ResourcePanel
    title="Users" path="/users"
    columns={[{ key: 'name', label: 'Name' }, { key: 'email', label: 'Email' }, { key: 'college', label: 'College' }, { key: 'role', label: 'Role' }, { label: 'Joined', render: date }]}
  />
);

export const TestimonialsPanel = () => (
  <ResourcePanel
    title="Testimonials" path="/testimonials"
    columns={[
      { key: 'name', label: 'Name' }, { key: 'quote', label: 'Quote' },
      { label: 'Visible', render: (r) => (r.approved ? 'Approved' : 'Pending') },
    ]}
    actions={(r, load) => (
      <button
        className="btn btn-outline btn-sm"
        onClick={async () => { await api(`/admin/testimonials/${r._id}/approve`, { method: 'PATCH', auth: true, body: { approved: !r.approved } }); load(); }}
      >
        {r.approved ? 'Hide' : 'Approve'}
      </button>
    )}
  />
);
