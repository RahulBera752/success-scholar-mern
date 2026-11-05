import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../api.js';
import '../styles/student-dashboard.css';

const courseNames = {
  'soft-skills': 'Soft Skills',
  'interview-prep': 'Interview Preparation',
  'personality-dev': 'Personality Development',
  'adv-comm': 'Advanced Communication Skills',
  'spoken-english': 'Spoken English',
  'campus-readiness': 'Campus Readiness Training',
};

export default function MyCourseLearning() {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    api('/payment/my-courses', { auth: true })
      .then((result) => {
        if (active) setAllowed((result?.courses || []).some((course) => course.courseId === courseId));
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || 'Could not verify course access.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [courseId]);

  return (
    <main className="student-dashboard student-learning-page">
      <div className="student-learning-panel">
        <Link to="/student#my-courses" className="student-learning-back">← Back to My Courses</Link>
        {loading ? <p>Checking your course access…</p> : error ? (
          <p role="alert">{error}</p>
        ) : !allowed ? (
          <>
            <h1>Course not purchased</h1>
            <p>You need to purchase this course before you can access the learning page.</p>
            <Link to={`/student/courses/${courseId}`} className="student-course-button">View course plans</Link>
          </>
        ) : (
          <>
            <p className="student-learning-kicker">SUCCESS SCHOLAR · MY LEARNING</p>
            <h1>{courseNames[courseId] || 'Your Course'}</h1>
            <p>Your purchase is confirmed. This is your course learning page.</p>
            <div className="student-learning-placeholder">
              <h2>Course content</h2>
              <p>Add your lesson videos, modules, notes, and assessments here. Access is restricted to students who purchased this course.</p>
            </div>
          </>
        )}
      </div>
      <style>{`
        .student-learning-page { min-height:100vh; padding:48px 20px; background:#f3f6fb; }
        .student-learning-panel { width:min(900px,100%); margin:0 auto; padding:clamp(24px,5vw,56px); background:#fff; border-radius:20px; box-shadow:0 12px 40px rgba(8,36,95,.10); color:#20314f; }
        .student-learning-back { display:inline-block; margin-bottom:28px; color:#1647b8; font-weight:700; text-decoration:none; }
        .student-learning-kicker { color:#1647b8; font-size:12px; font-weight:800; letter-spacing:1.6px; }
        .student-learning-panel h1 { color:#08245f; font-size:clamp(30px,5vw,46px); margin:8px 0 16px; }
        .student-learning-placeholder { margin-top:28px; padding:24px; border-radius:14px; background:#f3f6fb; }
        .student-learning-placeholder h2 { color:#08245f; margin-top:0; }
      `}</style>
    </main>
  );
}
