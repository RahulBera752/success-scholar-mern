
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/register.css';

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:5000'
)
  .replace(/\/+$/, '')
  .replace(/\/api$/i, '');

const configurations = {
  student: {
    title: 'Student Registration',
    fields: [
      ['fullName', 'Full Name', 'text', 'Enter your full name'],
      ['email', 'Email', 'email', 'Enter your email'],
      ['phone', 'Mobile Number', 'tel', 'Enter your 10-digit mobile'],
      ['dob', 'Date of Birth', 'date', ''],
      ['password', 'Password', 'password', 'Enter password'],
      ['confirmPassword', 'Confirm Password', 'password', 'Confirm password'],
    ],
  },
  corporate: {
    title: 'Corporate Registration',
    fields: [
      ['companyName', 'Company Name', 'text', 'Enter Company Name'],
      ['employeeName', 'Employee Name', 'text', 'Enter Employee Name'],
      ['designation', 'Employee Designation', 'text', 'Enter Designation'],
      ['email', 'Employee Email ID', 'email', 'Enter Email ID'],
      ['district', 'Company District', 'text', 'Enter Company District'],
    ],
  },
  college: {
    title: 'College Registration',
    fields: [
      ['collegeName', 'College Name', 'text', 'Enter College Name'],
      ['district', 'College District', 'text', 'Enter Location'],
      ['state', 'College State', 'text', 'Enter State'],
      ['phone', 'College Phone Number', 'tel', 'Enter Phone Number'],
      ['email', 'College Email ID', 'email', 'Enter College Email'],
      ['affiliation', 'Affiliated To', 'text', 'Enter Affiliation'],
      ['stream', 'College Stream', 'select', 'Select Stream'],
      ['studentCount', 'Expected Student Count', 'number', 'Enter Student Count'],
      ['budget', 'Approx Budget Per Student', 'number', 'Enter Budget'],
      ['contactName', 'Contact Person Name', 'text', 'Enter Name'],
      ['employeeId', 'Contact Person Employee ID (Optional)', 'text', 'Enter Employee ID'],
      ['department', 'Department', 'text', 'Enter Department'],
      ['designation', 'Designation', 'text', 'Enter Designation'],
      ['contactPhone', 'Contact Person Phone', 'tel', 'Enter Phone Number'],
      ['programType', 'Program Type', 'select', 'Select Program Type'],
      ['duration', 'Start Time Frame', 'select', 'Select Duration'],
      ['contactEmail', 'Contact Email (for OTP)', 'email', 'Enter Email'],
      ['password', 'Password', 'password', 'Create a password'],
      ['confirmPassword', 'Confirm Password', 'password', 'Confirm password'],
    ],
  },
  school: {
    title: 'School Registration',
    fields: [
      ['schoolName', 'School Name', 'text', 'Enter School Name'],
      ['district', 'District', 'text', 'Enter District'],
      ['state', 'State', 'text', 'Enter State'],
      ['phone', 'Phone Number', 'tel', 'Enter Phone Number'],
      ['email', 'School Email ID', 'email', 'Enter School Email'],
      ['affiliation', 'Affiliated To', 'text', 'Enter Affiliation'],
      ['studentCount', 'Expected Student Count', 'number', 'Enter Student Count'],
      ['budget', 'Approx Budget Per Student', 'number', 'Enter Budget'],
      ['contactName', 'Contact Person Name', 'text', 'Enter Name'],
      ['employeeId', 'Employee ID (Optional)', 'text', 'Enter Employee ID'],
      ['department', 'Department', 'text', 'Enter Department'],
      ['designation', 'Designation', 'text', 'Enter Designation'],
      ['contactPhone', 'Contact Person Phone', 'tel', 'Enter Phone Number'],
      ['programType', 'Program Type', 'select', 'Select Program'],
      ['duration', 'Start Time Frame', 'select', 'Select Duration'],
      ['contactEmail', 'Contact Email (for OTP)', 'email', 'Enter Email'],
      ['password', 'Password', 'password', 'Create a password'],
      ['confirmPassword', 'Confirm Password', 'password', 'Confirm password'],
    ],
  },
};

const selectOptions = {
  stream: ['Engineering', 'Management', 'Science', 'Commerce', 'Arts', 'Other'],
  programType: [
    'Soft Skills',
    'Campus to Corporate',
    'Communication Skills',
    'Leadership Training',
    'Other',
  ],
  duration: ['Immediately', 'Within 1 Month', 'Within 3 Months', 'Within 6 Months'],
};

function isStrongPassword(password = '') {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

async function postJson(path, body) {
  const response = await fetch(`${API_BASE_URL}/api/auth${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Request failed. Please try again.');
  }
  return data;
}

export default function RegistrationForm() {
  const { accountType } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const config = configurations[accountType];
  const [form, setForm] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('error');
  const [busy, setBusy] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  if (!config) {
    return (
      <main className="registration-form-page">
        <div className="registration-form-card">
          <h1>Registration type not found</h1>
          <Link to="/register">Choose an account type</Link>
        </div>
      </main>
    );
  }

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setMessage('');
  };

  const validateForm = () => {
    for (const [name, label] of config.fields) {
      if (name === 'employeeId') continue;
      if (!String(form[name] || '').trim()) {
        setMessage(`${label} is required.`);
        setMessageType('error');
        return false;
      }
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email || '')) {
      setMessage('Please enter a valid email address.');
      setMessageType('error');
      return false;
    }

    if (!isStrongPassword(form.password || '')) {
      setMessage(
        'Password must contain at least 8 characters, including uppercase and lowercase letters, a number, and a special character.'
      );
      setMessageType('error');
      return false;
    }

    if (form.password !== form.confirmPassword) {
      setMessage('Passwords do not match.');
      setMessageType('error');
      return false;
    }

    for (const field of ['phone', 'contactPhone']) {
      if (form[field] && !/^\d{10}$/.test(String(form[field]))) {
        setMessage('Please enter a valid 10-digit phone number.');
        setMessageType('error');
        return false;
      }
    }

    if (accountType === 'college' || accountType === 'school') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail || '')) {
        setMessage('Please enter a valid contact email for OTP verification.');
        setMessageType('error');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (busy) return;
    setMessage('');

    if (!otpSent) {
      if (!validateForm()) return;

      setBusy(true);
      try {
        const result = await postJson('/register-otp/send', {
          ...form,
          accountType,
        });
        setOtpSent(true);
        setMessage(
          result.message || 'A 6-digit OTP has been sent to your email address.'
        );
        setMessageType('success');
      } catch (error) {
        setMessage(error.message || 'Unable to send OTP.');
        setMessageType('error');
      } finally {
        setBusy(false);
      }
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setMessage('Please enter the 6-digit OTP sent to your email.');
      setMessageType('error');
      return;
    }

    setBusy(true);
    try {
      const result = await postJson('/register-otp/verify', {
        ...form,
        accountType,
        otp,
      });

      if (accountType === 'student') {
        await login(form.email.trim().toLowerCase(), form.password, 'student');
        setMessage('Email verified! Registration successful. Redirecting...');
        setMessageType('success');
        navigate('/student', { replace: true });
        return;
      }

      setMessage(
        result.message || 'Registration successful. Please sign in.'
      );
      setMessageType('success');
      navigate(`/signin/${accountType}`, { replace: true });
    } catch (error) {
      setMessage(error.message || 'OTP verification failed. Please try again.');
      setMessageType('error');
    } finally {
      setBusy(false);
    }
  };

  const otpEmail =
    accountType === 'college' || accountType === 'school'
      ? form.contactEmail
      : form.email;

  return (
    <main className="registration-form-page">
      <form
        className="registration-form-card"
        onSubmit={handleSubmit}
        noValidate
      >
        <h1>{config.title}</h1>

        {config.fields.map(([name, label, type, placeholder]) => (
          <div className="registration-field" key={name}>
            <label htmlFor={name}>
              {label}
              {name !== 'employeeId' && (
                <span className="required-mark"> *</span>
              )}
            </label>

            {type === 'select' ? (
              <select
                id={name}
                name={name}
                value={form[name] || ''}
                onChange={updateField}
                required={name !== 'employeeId'}
                disabled={busy || otpSent}
              >
                <option value="">{placeholder}</option>
                {(selectOptions[name] || []).map((option) => (
                  <option value={option} key={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                value={form[name] || ''}
                onChange={updateField}
                required={name !== 'employeeId'}
                min={type === 'number' ? 0 : undefined}
                maxLength={
                  name === 'phone' || name === 'contactPhone'
                    ? 10
                    : undefined
                }
                autoComplete={
                  type === 'password'
                    ? 'new-password'
                    : name === 'email'
                      ? 'email'
                      : name === 'fullName'
                        ? 'name'
                        : 'off'
                }
                minLength={name === 'password' ? 8 : undefined}
                disabled={busy || otpSent}
              />
            )}

            {name === 'password' && accountType === 'student' && (
              <small className="registration-help">
                Use at least 8 characters with uppercase, lowercase, a number,
                and a special character.
              </small>
            )}
          </div>
        ))}

        {otpSent && (
          <div className="registration-field">
            <label htmlFor="registrationOtp">Email Verification OTP *</label>
            <input
              id="registrationOtp"
              name="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(event) => {
                setOtp(event.target.value.replace(/\D/g, '').slice(0, 6));
                setMessage('');
              }}
              minLength={6}
              maxLength={6}
              required
              disabled={busy}
            />
            <small className="registration-help">
              Verification code sent to {otpEmail || 'your email'}. The OTP
              expires in 10 minutes.
            </small>
          </div>
        )}

        <button className="registration-submit" type="submit" disabled={busy}>
          {busy
            ? 'Please wait...'
            : otpSent
              ? 'Verify OTP & Register'
              : 'Register'}
        </button>

        {otpSent && (
          <button
            className="registration-submit"
            type="button"
            disabled={busy}
            onClick={() => {
              setOtpSent(false);
              setOtp('');
              setMessage('');
            }}
            style={{
              marginTop: 10,
              background: '#ffffff',
              color: '#10295f',
              border: '1px solid #10295f',
            }}
          >
            Edit Registration Details
          </button>
        )}

        {message && (
          <p
            className={`registration-message registration-message--${messageType}`}
            role="status"
            aria-live="polite"
          >
            {message}
          </p>
        )}

        <p className="registration-login-link">
          Already registered?{' '}
          <Link to={`/signin/${accountType}`}>Sign In Here</Link>
        </p>

        <p className="registration-back-link">
          <Link to="/register">← Back to registration options</Link>
        </p>
      </form>
    </main>
  );
}
