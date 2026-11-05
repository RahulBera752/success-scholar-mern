
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/register.css';

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:5000'
).replace(/\/+$/, '');

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
      ['companyName', 'Company Name', 'text', 'Enter company name'],
      ['employeeName', 'Employee Name', 'text', 'Enter employee name'],
      ['designation', 'Employee Designation', 'text', 'Enter designation'],
      ['email', 'Employee Email ID', 'email', 'Enter employee email'],
      ['district', 'Company District', 'text', 'Enter company district'],
      ['password', 'Password', 'password', 'Create a password'],
      ['confirmPassword', 'Confirm Password', 'password', 'Confirm password'],
    ],
  },
  college: {
    title: 'College Registration',
    fields: [
      ['collegeName', 'College Name', 'text', 'Enter college name'],
      ['district', 'College District', 'text', 'Enter district'],
      ['state', 'College State', 'text', 'Enter state'],
      ['phone', 'College Phone Number', 'tel', 'Enter phone number'],
      ['email', 'College Email ID', 'email', 'Enter college email'],
      ['affiliation', 'Affiliated To', 'text', 'Enter affiliation'],
      ['stream', 'College Stream', 'select', 'Select stream'],
      ['studentCount', 'Expected Student Count', 'number', 'Enter student count'],
      ['budget', 'Approx Budget Per Student', 'number', 'Enter budget'],
      ['contactName', 'Contact Person Name', 'text', 'Enter contact name'],
      ['employeeId', 'Contact Person Employee ID (Optional)', 'text', 'Enter employee ID'],
      ['department', 'Department', 'text', 'Enter department'],
      ['designation', 'Designation', 'text', 'Enter designation'],
      ['contactPhone', 'Contact Person Phone', 'tel', 'Enter phone number'],
      ['programType', 'Program Type', 'select', 'Select program'],
      ['duration', 'Start Time Frame', 'select', 'Select duration'],
      ['contactEmail', 'Contact Email (for OTP)', 'email', 'Enter contact email'],
      ['password', 'Password', 'password', 'Create a password'],
      ['confirmPassword', 'Confirm Password', 'password', 'Confirm password'],
    ],
  },
  school: {
    title: 'School Registration',
    fields: [
      ['schoolName', 'School Name', 'text', 'Enter school name'],
      ['district', 'District', 'text', 'Enter district'],
      ['state', 'State', 'text', 'Enter state'],
      ['phone', 'Phone Number', 'tel', 'Enter phone number'],
      ['email', 'School Email ID', 'email', 'Enter school email'],
      ['affiliation', 'Affiliated To', 'text', 'Enter affiliation'],
      ['studentCount', 'Expected Student Count', 'number', 'Enter student count'],
      ['budget', 'Approx Budget Per Student', 'number', 'Enter budget'],
      ['contactName', 'Contact Person Name', 'text', 'Enter contact name'],
      ['employeeId', 'Employee ID (Optional)', 'text', 'Enter employee ID'],
      ['department', 'Department', 'text', 'Enter department'],
      ['designation', 'Designation', 'text', 'Enter designation'],
      ['contactPhone', 'Contact Person Phone', 'tel', 'Enter phone number'],
      ['programType', 'Program Type', 'select', 'Select program'],
      ['duration', 'Start Time Frame', 'select', 'Select duration'],
      ['contactEmail', 'Contact Email (for OTP)', 'email', 'Enter contact email'],
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
  duration: [
    'Immediately',
    'Within 1 Month',
    'Within 3 Months',
    'Within 6 Months',
  ],
};

function isStrongPassword(password) {
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
  const { register } = useAuth();

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

  const showMessage = (text, type = 'error') => {
    setMessage(text);
    setMessageType(type);
  };

  const validateForm = () => {
    for (const [name, label] of config.fields) {
      if (name === 'employeeId') continue;

      if (!String(form[name] || '').trim()) {
        showMessage(`${label} is required.`);
        return false;
      }
    }

    const password = form.password || '';

    if (!isStrongPassword(password)) {
      showMessage(
        'Password must contain at least 8 characters, including uppercase and lowercase letters, a number, and a special character.'
      );
      return false;
    }

    if (password !== form.confirmPassword) {
      showMessage('Passwords do not match.');
      return false;
    }

    const email = accountType === 'college' || accountType === 'school'
      ? form.contactEmail
      : form.email;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '')) {
      showMessage('Please enter a valid email address.');
      return false;
    }

    const phoneFields = ['phone', 'contactPhone'];

    for (const field of phoneFields) {
      if (form[field] && !/^\d{10}$/.test(form[field])) {
        showMessage(`${field === 'phone' ? 'Phone number' : 'Contact phone'} must contain exactly 10 digits.`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (busy) return;

    setMessage('');

    if (accountType === 'student') {
      if (!isStrongPassword(form.password || '')) {
        showMessage(
          'Password must contain at least 8 characters, including uppercase and lowercase letters, a number, and a special character.'
        );
        return;
      }

      if (form.password !== form.confirmPassword) {
        showMessage('Passwords do not match.');
        return;
      }

      if (!/^\d{10}$/.test(form.phone || '')) {
        showMessage('Please enter a valid 10-digit mobile number.');
        return;
      }

      setBusy(true);

      try {
        await register({
          name: form.fullName.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
          phone: form.phone.trim(),
        });

        showMessage('Registration successful. Redirecting...', 'success');
        navigate('/student', { replace: true });
      } catch (error) {
        showMessage(error.message || 'Registration failed.');
      } finally {
        setBusy(false);
      }

      return;
    }

    if (!validateForm()) return;

    setBusy(true);

    try {
      const dataToSend = {
        ...form,
        accountType,
      };

      if (!otpSent) {
        const result = await postJson('/register-otp/send', dataToSend);

        setOtpSent(true);
        showMessage(
          result.message || 'OTP sent. Check your email.',
          'success'
        );
      } else {
        if (!/^\d{6}$/.test(otp)) {
          showMessage('Enter the 6-digit OTP sent to your email.');
          return;
        }

        const result = await postJson('/register-otp/verify', {
          ...dataToSend,
          otp,
        });

        showMessage(
          result.message || 'Registration successful. Please sign in.',
          'success'
        );

        navigate(`/signin/${accountType}`, { replace: true });
      }
    } catch (error) {
      showMessage(error.message || 'Registration failed.');
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
                required
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
                  type === 'password' ? 'new-password' : 'off'
                }
                minLength={name === 'password' ? 8 : undefined}
                disabled={busy || otpSent}
              />
            )}
          </div>
        ))}

        {accountType !== 'student' && otpSent && (
          <div className="registration-field">
            <label htmlFor="otp">Email Verification OTP *</label>
            <input
              id="otp"
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
              Verification code sent to {otpEmail || 'your email'}.
            </small>
          </div>
        )}

        {accountType === 'student' && (
          <small className="registration-help">
            Use at least 8 characters with uppercase, lowercase, a number,
            and a special character.
          </small>
        )}

        <button
          className="registration-submit"
          type="submit"
          disabled={busy}
        >
          {busy
            ? 'Please wait...'
            : accountType === 'student'
              ? 'Register'
              : otpSent
                ? 'Verify OTP & Register'
                : 'Send OTP'}
        </button>

        {otpSent && accountType !== 'student' && (
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
