
import { Navigate, Routes, Route } from 'react-router-dom';

import Layout from './components/layout/Layout.jsx';
import ChatbotWidget from './components/ChatbotWidget.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';

// Public pages
import Home from './pages/Home.jsx';
import ExpertisePage from './pages/ExpertisePage.jsx';
import PortfolioPage from './pages/PortfolioPage.jsx';
import TestimonialsPage from './pages/TestimonialsPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import Careers from './pages/Careers.jsx';

// Authentication and registration
import SignInSelection from './pages/SignInSelection.jsx';
import AccountSignIn from './pages/AccountSignIn.jsx';
import Register from './pages/Register.jsx';
import RegistrationForm from './pages/RegistrationForm.jsx';

// Account dashboards
import AccountDashboard from './pages/AccountDashboard.jsx';
import CollegeDashboard from './pages/CollegeDashboard.jsx';
import CorporateDashboard from './pages/CorporateDashboard.jsx';
import SchoolDashboard from './pages/SchoolDashboard.jsx';
import StudentProfile from './pages/StudentProfile.jsx';
import StudentAnnouncements from './pages/StudentAnnouncements.jsx';

// Student enrollment and courses
import {
  StudentBooking,
  StudentCoursePricing,
} from './pages/StudentEnrollment.jsx';

import CertificatePortal from './pages/CertificatePortal.jsx';
import MyCoursesPage from './pages/MyCoursesPage.jsx';
import MyCourseLearning from './pages/MyCourseLearning.jsx';

// Other pages
import Internship from './pages/Internship.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import Admin from './pages/Admin.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <>
    <Routes>
      {/* =========================================
          STUDENT DASHBOARD
      ========================================= */}

      <Route
        path="/student"
        element={
          <ProtectedRoute accountType="student">
            <AccountDashboard accountType="student" />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/profile"
        element={
          <ProtectedRoute accountType="student">
            <StudentProfile />
          </ProtectedRoute>
        }
      />

      <Route
  path="/student/announcements"
  element={
    <ProtectedRoute accountType="student">
      <StudentAnnouncements />
    </ProtectedRoute>
  }
/>

      <Route
        path="/student/my-courses"
        element={
          <ProtectedRoute accountType="student">
            <MyCoursesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/learn/:courseId"
        element={
          <ProtectedRoute accountType="student">
            <MyCourseLearning />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/courses/:courseId"
        element={
          <ProtectedRoute accountType="student">
            <StudentCoursePricing />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/booking/:courseId"
        element={
          <ProtectedRoute accountType="student">
            <StudentBooking />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/certifications"
        element={
          <ProtectedRoute accountType="student">
            <CertificatePortal />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/certificate-download"
        element={
          <ProtectedRoute accountType="student">
            <CertificatePortal />
          </ProtectedRoute>
        }
      />

      {/* =========================================
          COLLEGE DASHBOARD
      ========================================= */}

      <Route
        path="/college"
        element={
          <ProtectedRoute accountType="college">
            <CollegeDashboard />
          </ProtectedRoute>
        }
      />

      {/* =========================================
          CORPORATE DASHBOARD
      ========================================= */}

      <Route
        path="/corporate"
        element={
          <ProtectedRoute accountType="corporate">
            <CorporateDashboard />
          </ProtectedRoute>
        }
      />

      {/* =========================================
          SCHOOL DASHBOARD
          Uses its own redesigned component
      ========================================= */}

      <Route
        path="/school"
        element={
          <ProtectedRoute accountType="school">
            <SchoolDashboard />
          </ProtectedRoute>
        }
      />

      {/* =========================================
          PUBLIC WEBSITE
      ========================================= */}

      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />

        <Route path="/expertise" element={<ExpertisePage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/testimonials" element={<TestimonialsPage />} />
        <Route path="/contact" element={<ContactPage />} />

        <Route path="/internship" element={<Internship />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        {/* Sign in */}

        <Route
          path="/login"
          element={<Navigate to="/signin" replace />}
        />

        <Route
          path="/signin"
          element={<SignInSelection />}
        />

        <Route
          path="/signin/:accountType"
          element={<AccountSignIn />}
        />

        {/* Admin sign in */}

        <Route
          path="/admin/login"
          element={<Navigate to="/signin/admin" replace />}
        />

        {/* Registration */}

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/register/:accountType"
          element={<RegistrationForm />}
        />

        {/* Admin */}

        <Route
          path="/admin"
          element={<Admin />}
        />

        {/* Unknown routes */}

        <Route
          path="*"
          element={<NotFound />}
        />
      </Route>

      {/* Careers page */}

      <Route
        path="/careers"
        element={<Careers />}
      />
    </Routes>
    <ChatbotWidget />
    </>
  );
}
