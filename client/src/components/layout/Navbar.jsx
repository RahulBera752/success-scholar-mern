
import { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from '../common/Logo.jsx';
import Icon from '../common/Icon.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/expertise', label: 'Expertise' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/testimonials', label: 'Testimonials' },
  { to: '/contact', label: 'Contact' },
  { to: '/careers', label: 'Careers' },
  { to: '/admin', label: 'Admin' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isHome = pathname === '/' || pathname === '/home';

  // Corporate account page: only Home and Contact.
  const isCorporatePage =
    pathname === '/corporate' ||
    pathname.startsWith('/corporate/');

  const close = () => setOpen(false);

  const corporateLinks = [
    { to: '/', label: 'HOME', end: true },
    { to: '/contact', label: 'CONTACT' },
  ];

  const visibleLinks = isCorporatePage ? corporateLinks : links;

  return (
    <header
      className={`navbar${isHome ? ' home-navbar' : ''}${
        isCorporatePage ? ' corporate-navbar' : ''
      }`}
    >
      <div className="container navbar-inner">
        <Logo />

        <button
          type="button"
          className="nav-toggle"
          onClick={() => setOpen((previous) => !previous)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <Icon name={open ? 'close' : 'menu'} />
        </button>

        <nav className={`nav-links ${open ? 'open' : ''}`}>
          {visibleLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={close}
            >
              {link.label}
            </NavLink>
          ))}

          {!isCorporatePage && (
            <>
              {user ? (
                <button
                  type="button"
                  className="nav-user"
                  onClick={() => {
                    logout();
                    close();
                    navigate('/');
                  }}
                >
                  Log out ({user.name?.split(' ')[0] || 'User'})
                </button>
              ) : !isHome ? (
                <Link
                  to="/login"
                  className="nav-user"
                  onClick={close}
                >
                  Log in
                </Link>
              ) : null}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
