
import { useEffect, useState } from 'react';
import Modal from '../common/Modal.jsx';
import Icon from '../common/Icon.jsx';
import EnquiryForm from './EnquiryForm.jsx';

export default function CourseModal({ course, onClose }) {
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setShowForm(false);
  }, [course]);

  const handleClose = () => {
    setShowForm(false);
    onClose?.();
  };

  return (
    <Modal
      open={Boolean(course)}
      onClose={handleClose}
      label={course?.title || 'Course details'}
    >
      {course && !showForm && (
        <div className="course-modal">
          <h3>{course.title} Modules</h3>
          <hr />

          <ul className="check-list">
            {(course.modules || []).map((module) => (
              <li key={module}>
                <Icon name="check" size={18} />
                {module}
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            Enquire Now
          </button>
        </div>
      )}

      {course && showForm && (
        <EnquiryForm
          courseName={course.title}
          onDone={handleClose}
        />
      )}
    </Modal>
  );
}
