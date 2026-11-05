import { Link } from 'react-router-dom';

const accounts = [
  ['student', 'Student Sign-in'],
  ['corporate', 'Corporate Sign-in'],
  ['college', 'College Sign-in'],
  ['school', 'School Sign-in'],
];

export default function SignInSelection() {
  return (
    <section className="signin-selection" aria-labelledby="signin-selection-title">
      <div className="signin-selection__content">
        <h1 id="signin-selection-title">Sign in to Success Scholar</h1>
        <div className="signin-selection__actions">
          {accounts.map(([accountType, label]) => (
            <Link key={accountType} to={`/signin/${accountType}`} className="signin-selection__button">
              {label}
            </Link>
          ))}
        </div>
        <Link className="signin-selection__admin" to="/signin/admin">Administrator sign-in</Link>
      </div>
    </section>
  );
}
