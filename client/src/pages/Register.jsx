import { useNavigate } from 'react-router-dom';
import '../styles/register.css';

const accountTypes = [
  { label: 'Student Registration', type: 'student' },
  { label: 'Corporate Registration', type: 'corporate' },
  { label: 'College Registration', type: 'college' },
  { label: 'School Registration', type: 'school' },
];

export default function Register() {
  const navigate = useNavigate();

  return (
    <main className="registration-selection">
      <div className="registration-selection__container">
        {accountTypes.map(({ label, type }) => (
          <button
            key={type}
            type="button"
            className="registration-selection__button"
            onClick={() => navigate(`/register/${type}`)}
          >
            {label}
          </button>
        ))}
      </div>
    </main>
  );
}