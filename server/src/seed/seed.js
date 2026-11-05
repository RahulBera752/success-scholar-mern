require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });
const connectDB = require('../config/db');
const User = require('../models/User');
const Course = require('../models/Course');

const courses = [
  ['personality-development', 'Personality Development', 'user', 'Enhancing self-awareness, confidence, and positive attitude for an impactful professional presence.', ['Self-awareness and Self-analysis', 'Building Confidence and Positive Thinking', 'Body Language and Personal Grooming', 'Emotional Intelligence and Stress Management', 'Goal Setting, Time Management and Work-life Balance']],
  ['posh-training', 'POSH Training', 'shield', 'Educates employees on legal compliance, prevention and redressal of sexual harassment.', ['Understanding Sexual Harassment: Definition and Scope', 'The POSH Act 2013: Legal Framework and Guidelines', 'Roles and Responsibilities of ICC (Internal Complaints Committee)', 'Complaint Handling Process and Redressal Mechanism', 'Awareness, Sensitization and Workplace Ethics']],
  ['competitive-aptitude', 'Competitive Aptitude', 'target', 'Sharpening numerical, logical reasoning, and verbal skills for competitive exams and placements.', ['Quantitative Aptitude (Arithmetic, Algebra, Geometry)', 'Logical Reasoning and Analytical Ability', 'Data Interpretation and Data Sufficiency', 'Verbal Ability and Reading Comprehension', 'Test-taking Strategies and Time Management']],
  ['sales-marketing-branding', 'Sales Marketing & Branding', 'chart', 'Learn to identify target audiences, develop marketing strategies, drive sales, and build a brand.', ['Fundamentals of Sales and Marketing', 'Consumer Behavior and Market Research', 'Branding and Brand Positioning Strategies', 'Digital Marketing and CRM', 'Sales Techniques, Negotiation and Performance Metrics']],
  ['leadership-training', 'Leadership Training', 'flag', 'Develop future leaders with strategic thinking, decision-making, team motivation, and conflict resolution skills.', ['Understanding Leadership Styles and Theories', 'Decision Making and Problem Solving', 'Communication, Motivation and Team Building', 'Conflict Management and Emotional Intelligence', 'Strategic Vision, Innovation and Ethical Leadership']],
  ['gdpi', 'Group Discussion & Personal Interview', 'users', 'Techniques for communication, persuasive arguments, and structured responses in GD and interviews.', ['GD Techniques: Types, Structure and Evaluation Criteria', 'Communication Skills and Body Language in GD', 'Personal Interview Preparation: Common and Behavioral Questions', 'Resume Building and Presentation Skills', 'Mock GDPI Sessions and Feedback']],
  ['spoken-english', 'Spoken English & Language Skill', 'chat', 'Improve fluency, vocabulary, pronunciation, and communication effectiveness.', ['Grammar, Vocabulary and Sentence Construction', 'Spoken English and Pronunciation Practice', 'Business Communication: Emails, Reports and Presentations', 'Listening and Comprehension Skills', 'Personality-based Communication and Confidence Building']],
  ['corporate-training', 'Corporate Training', 'briefcase', 'Align employee skills with organizational goals, ethics, teamwork, and business etiquette.', ['Workplace Etiquette and Professionalism', 'Effective Communication and Team Collaboration', 'Time and Stress Management', 'Problem Solving, Creativity and Innovation', 'Leadership and Career Development in Corporate Culture']],
  ['c2c', 'C2C (Campus to Corporate)', 'cap', 'Prepare students for the professional world with resume building and workplace decorum.', ['Transition from Student to Professional Mindset', 'Resume Writing and Interview Etiquette', 'Professional Communication and Workplace Culture', 'Corporate Etiquette, Dress Code and Team Behavior', 'Goal Setting, Adaptability and Continuous Learning']],
  ['nlp-fundamentals', 'NLP Fundamentals', 'brain', 'Learn basic NLP principles to improve communication and achieve personal goals.', ['Introduction to NLP: Concepts and Principles', 'Understanding Human Behavior and Communication Models', 'Anchoring, Reframing and Rapport Building Techniques', 'Goal Setting and Motivation through NLP', 'Applying NLP in Personal and Professional Life']],
  ['film-making', 'Film Making', 'film', 'Practical introduction to scriptwriting, cinematography, directing, and post-production techniques.', ['Introduction to Cinema: History and Film Theories', 'Scriptwriting and Storyboarding', 'Cinematography and Lighting Techniques', 'Sound Design, Editing and Post-production', 'Film Direction, Production and Distribution']],
].map(([slug, title, icon, summary, modules], order) => ({ slug, title, icon, summary, modules, order }));

(async () => {
  await connectDB();

  const email = (process.env.ADMIN_EMAIL || 'admin@successscholar.demo').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'Admin@12345';
  let admin = await User.findOne({ email }).select('+password');

  if (!admin) {
    admin = new User({ name: 'Demo Admin', email, password, role: 'admin', accountType: 'admin' });
  } else {
    admin.name = 'Demo Admin';
    admin.role = 'admin';
    admin.accountType = 'admin';
    admin.password = password;
  }

  // Saving uses User's bcrypt pre-save hook, matching the login comparison.
  await admin.save();

  // Upsert only the known expertise records. Existing users and other collections remain untouched.
  await Course.bulkWrite(courses.map((course) => ({
    updateOne: {
      filter: { slug: course.slug },
      update: { $set: course },
      upsert: true,
    },
  })));

  console.log(`Demo admin and ${courses.length} expertise courses are ready.`);
  await require('mongoose').disconnect();
})().catch(async (error) => {
  console.error('Could not seed the demo admin:', error.message);
  await require('mongoose').disconnect().catch(() => {});
  process.exitCode = 1;
});
