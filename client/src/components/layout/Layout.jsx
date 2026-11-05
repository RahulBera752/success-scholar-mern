import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import AnnouncementBar from './AnnouncementBar.jsx';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

export default function Layout() {
  const { pathname, hash } = useLocation();

  const isStudentDashboard =
    pathname === '/student' || pathname.startsWith('/student/');

  const isCorporateAccount =
    pathname === '/corporate' || pathname.startsWith('/corporate/');

  const isHome = pathname === '/' || pathname === '/home';

  useEffect(() => {
    if (hash) {
      const timeoutId = window.setTimeout(() => {
        try {
          document
            .querySelector(hash)
            ?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
        } catch {
          // Ignore an invalid URL hash.
        }
      }, 80);

      return () => window.clearTimeout(timeoutId);
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto',
    });
  }, [pathname, hash]);

  // Student dashboard uses its own header and footer.
  if (isStudentDashboard) {
    return <Outlet />;
  }

  // Corporate accounts use the shared website header and footer.
  // The corporate dashboard content is rendered by the matched route.
  return (
    <div
      className={[
        isHome ? 'home-shell' : '',
        isCorporateAccount ? 'corporate-shell' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <AnnouncementBar home={isHome} />

      <Navbar />

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
