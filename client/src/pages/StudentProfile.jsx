
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/student-profile.css';

const STORAGE_PREFIX = 'successScholarStudentProfile:';

const fields = [
  { key: 'name', label: 'Full Name' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
  { key: 'contactNumber', label: 'Contact Number', type: 'tel' },
  { key: 'highestQualification', label: 'Highest Qualification' },
  { key: 'boardUniversity', label: 'Board/University' },
  { key: 'classSemester', label: 'Class/Semester' },
  { key: 'subjectDepartment', label: 'Subject/Department' },
  { key: 'gender', label: 'Gender' },
  { key: 'maritalStatus', label: 'Marital Status' },
  { key: 'working', label: 'Working' },
  { key: 'occupation', label: 'Occupation' },
  { key: 'presentAddress', label: 'Present Address', multiline: true },
  { key: 'permanentAddress', label: 'Permanent Address', multiline: true },
  { key: 'socialMedia', label: 'Social Media' },
  { key: 'guardianName', label: 'Guardian Name' },
  { key: 'guardianRelation', label: 'Relation' },
  { key: 'guardianOccupation', label: 'Guardian Occupation' },
  { key: 'guardianContact', label: 'Guardian Contact' },
];

const readSaved = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || '{}');
  } catch {
    return {};
  }
};

const displayValue = (value) =>
  value !== undefined && value !== null && String(value).trim()
    ? value
    : 'N/A';

function DetailSection({ title, items }) {
  return (
    <section className="profile-detail-card">
      <h2>{title}</h2>
      <div className="profile-detail-list">
        {items.map(([label, value]) => (
          <p className="profile-detail-row" key={label}>
            <span>{label}:</span>{' '}
            <strong>{displayValue(value)}</strong>
          </p>
        ))}
      </div>
    </section>
  );
}

export default function StudentProfile() {
  const { user } = useAuth();
  const photoInputRef = useRef(null);

  const storageKey =
    STORAGE_PREFIX +
    (user?.email || user?._id || user?.id || 'current-user');

  const [saved, setSaved] = useState(() => readSaved(storageKey));
  const [photo, setPhoto] = useState(
    () => readSaved(storageKey).profilePhoto || ''
  );
  const [message, setMessage] = useState('');
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState(() => {
    const initial = readSaved(storageKey);

    return {
      name:
        initial.name ??
        user?.name ??
        [user?.firstName, user?.lastName].filter(Boolean).join(' '),
      email: initial.email ?? user?.email ?? '',
      dateOfBirth:
        initial.dateOfBirth ?? user?.dateOfBirth ?? user?.dob ?? '',
      contactNumber:
        initial.contactNumber ??
        user?.phone ??
        user?.mobile ??
        user?.contactNumber ??
        '',
      highestQualification:
        initial.highestQualification ??
        user?.highestQualification ??
        user?.qualification ??
        '',
      boardUniversity:
        initial.boardUniversity ??
        user?.boardUniversity ??
        user?.university ??
        '',
      classSemester:
        initial.classSemester ??
        user?.classSemester ??
        user?.semester ??
        '',
      subjectDepartment:
        initial.subjectDepartment ??
        user?.subjectDepartment ??
        user?.department ??
        '',
      gender: initial.gender ?? user?.gender ?? '',
      maritalStatus: initial.maritalStatus ?? user?.maritalStatus ?? '',
      working: initial.working ?? user?.working ?? '',
      occupation: initial.occupation ?? user?.occupation ?? '',
      presentAddress:
        initial.presentAddress ??
        user?.presentAddress ??
        user?.address ??
        '',
      permanentAddress:
        initial.permanentAddress ?? user?.permanentAddress ?? '',
      socialMedia: initial.socialMedia ?? user?.socialMedia ?? '',
      guardianName: initial.guardianName ?? user?.guardianName ?? '',
      guardianRelation:
        initial.guardianRelation ??
        user?.guardianRelation ??
        user?.relation ??
        '',
      guardianOccupation:
        initial.guardianOccupation ?? user?.guardianOccupation ?? '',
      guardianContact:
        initial.guardianContact ?? user?.guardianContact ?? '',
    };
  });

  const fullName = form.name || 'Student';
  const profilePhoto =
    photo ||
    user?.profilePic ||
    user?.profilePicture ||
    user?.avatar ||
    '';

  const updateField = (key, value) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const saveToBrowser = (data) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
      setSaved(data);
      return true;
    } catch {
      setMessage(
        'Unable to save. The browser storage may be full; try a smaller photo.'
      );
      return false;
    }
  };

  const handlePhotoSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage('Please select an image file.');
      event.target.value = '';
      return;
    }

    // A small image is more likely to fit in browser storage.
    if (file.size > 2 * 1024 * 1024) {
      setMessage('Please select a photo smaller than 2 MB.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const image = String(reader.result || '');
      const next = { ...saved, ...form, profilePhoto: image };

      if (saveToBrowser(next)) {
        setPhoto(image);
        setMessage('Photo saved in this browser.');
      }
    };

    reader.onerror = () => setMessage('Could not read the selected image.');
    reader.readAsDataURL(file);
  };

  const handleSave = (event) => {
    event.preventDefault();

    const next = {
      ...saved,
      ...form,
      profilePhoto: photo || saved.profilePhoto || '',
    };

    if (saveToBrowser(next)) {
      setEditing(false);
      setMessage('Profile information saved in this browser.');
    }
  };

  const groups = [
    {
      title: 'Academic Details',
      items: [
        ['Highest Qualification', form.highestQualification],
        ['Board/University', form.boardUniversity],
        ['Class/Semester', form.classSemester],
        ['Subject/Department', form.subjectDepartment],
      ],
    },
    {
      title: 'Personal Details',
      items: [
        ['Gender', form.gender],
        ['Marital Status', form.maritalStatus],
        ['Working', form.working],
        ['Occupation', form.occupation],
      ],
    },
    {
      title: 'Contact Information',
      items: [
        ['Present Address', form.presentAddress],
        ['Permanent Address', form.permanentAddress],
        ['Social Media', form.socialMedia],
      ],
    },
    {
      title: 'Guardian Information',
      items: [
        ['Guardian Name', form.guardianName],
        ['Relation', form.guardianRelation],
        ['Guardian Occupation', form.guardianOccupation],
        ['Guardian Contact', form.guardianContact],
      ],
    },
  ];

  return (
    <div className="student-profile-page">
      <header className="profile-header">
        <Link to="/home" className="profile-brand">
          <img
            src="/assets/success-scholar-logo.png"
            alt="Success Scholar"
          />
        </Link>

        <nav className="profile-header-nav">
          <Link to="/home">HOME</Link>
          <Link to="/contact">CONTACT</Link>
        </nav>
      </header>

      <main className="profile-main">
        <div className="profile-heading">
          <span className="profile-heading-accent" />
          <h1>Student Profile</h1>
          <p>
            Manage your personal information and academic details
          </p>
        </div>

        <article className="profile-panel">
          <div className="profile-panel-top" />

          <section className="profile-overview">
            <div className="profile-avatar-wrap">
              <div className="profile-photo-control">
                {profilePhoto ? (
                  <img
                    className="profile-avatar"
                    src={profilePhoto}
                    alt={`${fullName}'s profile`}
                  />
                ) : (
                  <div className="profile-avatar-fallback">
                    <span className="profile-photo-placeholder-icon">
                      ＋
                    </span>
                    <span className="profile-photo-placeholder-text">
                      Add photo
                    </span>
                  </div>
                )}

                <button
                  type="button"
                  className="profile-photo-upload-button"
                  onClick={() => photoInputRef.current?.click()}
                >
                  {profilePhoto ? 'Change Photo' : 'Upload Photo'}
                </button>

                <input
                  ref={photoInputRef}
                  className="profile-photo-file-input"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                />

                {message && (
                  <p className="profile-photo-message" role="status">
                    {message}
                  </p>
                )}
              </div>
            </div>

            <div className="profile-overview-content">
              <h2>Personal Information</h2>
              <div className="profile-overview-list">
                <p>
                  Full Name: <strong>{displayValue(fullName)}</strong>
                </p>
                <p>
                  Email: <strong>{displayValue(form.email)}</strong>
                </p>
                <p>
                  Date of Birth:{' '}
                  <strong>{displayValue(form.dateOfBirth)}</strong>
                </p>
                <p>
                  Contact Number:{' '}
                  <strong>{displayValue(form.contactNumber)}</strong>
                </p>
              </div>
            </div>
          </section>

          <div className="profile-detail-grid">
            {groups.map((group) => (
              <DetailSection
                key={group.title}
                title={group.title}
                items={group.items}
              />
            ))}
          </div>

          {editing && (
            <form className="profile-edit-form" onSubmit={handleSave}>
              <div className="profile-edit-heading">
                <h2>Edit Profile Information</h2>
                <p>Update your details and select Save Changes.</p>
              </div>

              <div className="profile-edit-grid">
                {fields.map((field) => (
                  <label className="profile-edit-field" key={field.key}>
                    <span>{field.label}</span>

                    {field.multiline ? (
                      <textarea
                        rows="2"
                        value={form[field.key] ?? ''}
                        onChange={(event) =>
                          updateField(field.key, event.target.value)
                        }
                      />
                    ) : (
                      <input
                        type={field.type || 'text'}
                        value={form[field.key] ?? ''}
                        onChange={(event) =>
                          updateField(field.key, event.target.value)
                        }
                      />
                    )}
                  </label>
                ))}
              </div>

              <div className="profile-edit-actions">
                <button
                  type="button"
                  className="profile-cancel-button"
                  onClick={() => {
                    setForm({ ...saved, ...form });
                    setEditing(false);
                  }}
                >
                  Cancel
                </button>

                <button type="submit" className="profile-save-button">
                  Save Changes
                </button>
              </div>
            </form>
          )}

          <div className="profile-panel-footer">
            <button
              type="button"
              className="profile-edit-button"
              onClick={() => {
                setForm((previous) => ({ ...previous, ...saved }));
                setEditing((previous) => !previous);
              }}
            >
              {editing ? 'Close Editor' : 'Edit Profile Information'}
            </button>
          </div>
        </article>
      </main>

      <footer className="profile-footer">
        <div className="profile-footer-inner">
          <div className="profile-footer-brand">
            <img src="/assets/success-scholar-logo.png" alt="" />
            <div>
              <h2>Success Scholar</h2>
              <p>Your Vision. Our Mission.</p>
            </div>
          </div>

          <div className="profile-footer-links">
            <h3>Quick Links</h3>
            <Link to="/home">Home</Link>
            <Link to="/expertise">What We Offer</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <div className="profile-footer-contact">
            <h3>Contact Us</h3>
            <p>Email: info@successscholar.in</p>
            <p>Location: Kolkata, West Bengal</p>
          </div>
        </div>

        <div className="profile-footer-bottom">
          © {new Date().getFullYear()} Success Scholar. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
