import { useEffect, useMemo, useState, useCallback } from 'react';

import { Link } from 'react-router-dom';

import './Internship.css';

const internshipTopics = [

  'B.Voc Aquaculture & Fisheries',

  'B.Voc Software Development',

  'B.Com (MDC)',

  'Bengali',

  'Bio-Chemistry',

  'Botany',

  'B.Sc (Human Physiology)',

  'Chemistry',

  'Communicative English',

  'Computer Science',

  'Digital Marketing (Meta Specialization)',

  'Digital Marketing',

  'Economics',

  'Electronics',

  'English',

  'Environmental Science',

  'Food & Nutrition',

  'Geography',

  'Geology',

  'History',

  'Industrial Fish and Fisheries',

  'Journalism & Mass Communication',

  'Machine learning',

  'Management BBA',

  'Mathematics',

  'Microbiology',

  'Philosophy',

  'Physics',

  'Political Science',

  'Psychology',

  'Sanskrit',

  'Sociology',

  'Statistics',

  'Understanding AI',

  'Zoology',

  'Employability Skills',

  'Entrepreneurship',

  'Technical Skills',

];

const topicDescription = (topic) => {

  const normalized = topic.toLowerCase();

  if (

    normalized.includes('software') ||

    normalized.includes('computer') ||

    normalized.includes('machine learning') ||

    normalized.includes('understanding ai') ||

    normalized.includes('electronics')

  ) {

    return `Internship structure for ${topic} covering practical projects, technical skills, employability, and workplace readiness.`;

  }

  if (normalized.includes('marketing')) {

    return `Internship structure for ${topic} covering strategy, social media, content, advertising, and measurement.`;

  }

  if (

    normalized.includes('b.com') ||

    normalized.includes('management') ||

    normalized.includes('entrepreneurship')

  ) {

    return `Comprehensive structure for ${topic} covering employability, entrepreneurship, sustainability, projects, presentations, and case studies.`;

  }

  if (

    normalized.includes('nutrition') ||

    normalized.includes('physiology') ||

    normalized.includes('chemistry') ||

    normalized.includes('biology') ||

    normalized.includes('botany') ||

    normalized.includes('zoology') ||

    normalized.includes('microbiology')

  ) {

    return `Comprehensive structure for ${topic} covering core concepts, practical work, presentations, and case studies.`;

  }

  return `Internship structure for ${topic} covering employability, entrepreneurship, sustainability, and technical skills.`;

};

const aiModules = [

  {

    module: 'Foundations: Math & Computer Science',

    subModules: [

      'Programming (Python, C++)',

      'Data Structures',

      'Algorithms',

      'Object-Oriented Programming (OOP)',

      'Mathematics (Linear Algebra, Calculus, Probability, Statistics)',

      'Computational Logic',

      'Computability',

      'Complexity',

    ],

  },

  {

    module: 'Core AI/ML Concepts',

    subModules: [

      'Introduction to AI',

      'Machine Learning (Supervised, Unsupervised, Reinforcement Learning)',

      'Neural Networks',

      'Deep Learning',

    ],

  },

  {

    module: 'Specialized AI Areas',

    subModules: [

      'Natural Language Processing (NLP) (Tokenization, Sentiment Analysis, Transformer Models, Generative AI)',

      'Computer Vision (Image Processing, Object Detection, Generative Models like GANs)',

      'Reinforcement Learning (Markov Decision Processes, Q-learning, Policy Gradients)',

    ],

  },

  {

    module: 'Engineering & Deployment',

    subModules: [

      'Software Engineering',

      'System Design',

      'Data Engineering (ETL)',

      'Model Deployment (MLOps)',

    ],

  },

];

const courseTemplates = {

  software: [

    {

      module: 'Programming Foundations',

      subModules: [

        'Programming fundamentals',

        'Variables, data types and operators',

        'Conditions and loops',

        'Functions and modular programming',

        'Object-oriented programming',

      ],

    },

    {

      module: 'Web Development',

      subModules: [

        'HTML and CSS',

        'JavaScript fundamentals',

        'Responsive web design',

        'React fundamentals',

        'Frontend form validation',

      ],

    },

    {

      module: 'Backend & Databases',

      subModules: [

        'Node.js and Express fundamentals',

        'REST API development',

        'SQL or NoSQL database concepts',

        'Authentication fundamentals',

        'API testing',

      ],

    },

    {

      module: 'Projects & Deployment',

      subModules: [

        'Git and GitHub',

        'Team-based development',

        'Project implementation',

        'Testing and debugging',

        'Application deployment',

      ],

    },

  ],

  business: [

    {

      module: 'Business Foundations',

      subModules: [

        'Introduction to business and management',

        'Business communication',

        'Organizational structure',

        'Professional ethics',

      ],

    },

    {

      module: 'Marketing & Finance',

      subModules: [

        'Marketing fundamentals',

        'Market research',

        'Financial planning basics',

        'Budgeting and cost analysis',

      ],

    },

    {

      module: 'Operations & Strategy',

      subModules: [

        'Business operations',

        'Customer relationship management',

        'Decision-making',

        'Business strategy and planning',

      ],

    },

    {

      module: 'Practical Learning',

      subModules: [

        'Business case studies',

        'Presentation skills',

        'Team projects',

        'Final project presentation',

      ],

    },

  ],

  science: [

    {

      module: 'Fundamentals',

      subModules: [

        'Introduction to the subject',

        'Core terminology and concepts',

        'Principles and theories',

        'Scientific methods',

      ],

    },

    {

      module: 'Applied Concepts',

      subModules: [

        'Advanced subject concepts',

        'Real-world applications',

        'Research methods',

        'Data collection and interpretation',

      ],

    },

    {

      module: 'Laboratory & Practical Work',

      subModules: [

        'Laboratory safety and procedures',

        'Practical demonstrations',

        'Observation and documentation',

        'Analysis of results',

      ],

    },

    {

      module: 'Research & Assessment',

      subModules: [

        'Scientific report writing',

        'Case studies',

        'Research presentation',

        'Final practical project',

      ],

    },

  ],

  humanities: [

    {

      module: 'Subject Foundations',

      subModules: [

        'Introduction and historical background',

        'Key concepts and terminology',

        'Major theories and perspectives',

        'Important thinkers and contributions',

      ],

    },

    {

      module: 'Analysis & Interpretation',

      subModules: [

        'Critical reading',

        'Source analysis',

        'Research and interpretation',

        'Comparative analysis',

      ],

    },

    {

      module: 'Communication & Research',

      subModules: [

        'Academic writing',

        'Presentation skills',

        'Research methodology',

        'Report preparation',

      ],

    },

    {

      module: 'Practical Applications',

      subModules: [

        'Real-world case studies',

        'Group discussions',

        'Individual assignments',

        'Final research presentation',

      ],

    },

  ],

  digitalMarketing: [

    {

      module: 'Digital Marketing Foundations',

      subModules: [

        'Introduction to digital marketing',

        'Audience and market research',

        'Customer journey and funnels',

        'Marketing goals and KPIs',

      ],

    },

    {

      module: 'Content & Search',

      subModules: [

        'Content strategy',

        'Search engine optimization (SEO)',

        'Social media content',

        'Copywriting and creative planning',

      ],

    },

    {

      module: 'Advertising & Analytics',

      subModules: [

        'Paid advertising fundamentals',

        'Meta Ads concepts',

        'Campaign planning',

        'Performance metrics and reporting',

      ],

    },

    {

      module: 'Campaign Project',

      subModules: [

        'Campaign development',

        'Budget planning',

        'Audience targeting',

        'Campaign evaluation and presentation',

      ],

    },

  ],

  communication: [

    {

      module: 'Communication Foundations',

      subModules: [

        'Verbal and written communication',

        'Grammar and vocabulary',

        'Professional email writing',

        'Reading and comprehension',

      ],

    },

    {

      module: 'Speaking & Presentation',

      subModules: [

        'Public speaking',

        'Presentation preparation',

        'Group discussions',

        'Pronunciation and fluency',

      ],

    },

    {

      module: 'Workplace Communication',

      subModules: [

        'Interview preparation',

        'Meeting etiquette',

        'Team communication',

        'Professional correspondence',

      ],

    },

    {

      module: 'Practical Activities',

      subModules: [

        'Role-play exercises',

        'Presentation practice',

        'Writing assignments',

        'Feedback and improvement',

      ],

    },

  ],

  employability: [

    {

      module: 'Professional Foundations',

      subModules: [

        'Workplace expectations',

        'Professional ethics',

        'Time management',

        'Goal setting and productivity',

      ],

    },

    {

      module: 'Communication & Teamwork',

      subModules: [

        'Verbal and written communication',

        'Team collaboration',

        'Conflict resolution',

        'Problem-solving',

      ],

    },

    {

      module: 'Career Preparation',

      subModules: [

        'Resume preparation',

        'Interview techniques',

        'Job search strategies',

        'Professional networking',

      ],

    },

    {

      module: 'Workplace Readiness',

      subModules: [

        'Mock interviews',

        'Group activities',

        'Workplace scenarios',

        'Career action plan',

      ],

    },

  ],

  entrepreneurship: [

    {

      module: 'Entrepreneurship Foundations',

      subModules: [

        'Entrepreneurial mindset',

        'Identifying business opportunities',

        'Problem and customer discovery',

        'Idea validation',

      ],

    },

    {

      module: 'Business Model Development',

      subModules: [

        'Value proposition',

        'Business model canvas',

        'Market and competitor research',

        'Customer segmentation',

      ],

    },

    {

      module: 'Business Operations',

      subModules: [

        'Basic finance and budgeting',

        'Branding and marketing',

        'Sales fundamentals',

        'Business risk management',

      ],

    },

    {

      module: 'Startup Project',

      subModules: [

        'Business plan development',

        'Pitch deck preparation',

        'Startup case studies',

        'Final business presentation',

      ],

    },

  ],

  technical: [

    {

      module: 'Technical Foundations',

      subModules: [

        'Introduction to relevant tools',

        'Technical terminology',

        'Core concepts and workflows',

        'Problem-solving methods',

      ],

    },

    {

      module: 'Tools & Applications',

      subModules: [

        'Industry tools and software',

        'Practical exercises',

        'Workflow documentation',

        'Quality and safety practices',

      ],

    },

    {

      module: 'Applied Skills',

      subModules: [

        'Task planning and execution',

        'Troubleshooting',

        'Team collaboration',

        'Performance evaluation',

      ],

    },

    {

      module: 'Practical Project',

      subModules: [

        'Project planning',

        'Hands-on implementation',

        'Testing and review',

        'Final project presentation',

      ],

    },

  ],

};

function getCourseModules(topic) {

  const name = topic.toLowerCase();

  if (name.includes('understanding ai') || name === 'machine learning') {

    return aiModules;

  }

  if (name.includes('software') || name.includes('computer science')) {

    return courseTemplates.software;

  }

  if (name.includes('digital marketing')) {

    return courseTemplates.digitalMarketing;

  }

  if (name.includes('b.com') || name.includes('management')) {

    return courseTemplates.business;

  }

  if (name.includes('entrepreneurship')) {

    return courseTemplates.entrepreneurship;

  }

  if (

    name.includes('english') ||

    name.includes('bengali') ||

    name.includes('journalism')

  ) {

    return courseTemplates.communication;

  }

  if (

    name.includes('skill') ||

    name.includes('employability') ||

    name.includes('technical')

  ) {

    return courseTemplates.employability;

  }

  if (

    name.includes('history') ||

    name.includes('geography') ||

    name.includes('geology') ||

    name.includes('political') ||

    name.includes('philosophy') ||

    name.includes('psychology') ||

    name.includes('sociology') ||

    name.includes('sanskrit') ||

    name.includes('economics')

  ) {

    return courseTemplates.humanities;

  }

  if (

    name.includes('aquaculture') ||

    name.includes('fisheries') ||

    name.includes('food') ||

    name.includes('nutrition') ||

    name.includes('chemistry') ||

    name.includes('botany') ||

    name.includes('physiology') ||

    name.includes('microbiology') ||

    name.includes('zoology') ||

    name.includes('biology') ||

    name.includes('physics') ||

    name.includes('mathematics') ||

    name.includes('statistics') ||

    name.includes('environmental') ||

    name.includes('electronics')

  ) {

    return courseTemplates.science;

  }

  return courseTemplates.technical;

}

function CourseModal({ topic, onClose }) {

  const description = topicDescription(topic);

  const modules = getCourseModules(topic);

  const handleKeyDown = useCallback(

    (event) => {

      if (event.key === 'Escape') {

        onClose();

      }

    },

    [onClose],

  );

  useEffect(() => {

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', handleKeyDown);

    return () => {

      document.body.style.overflow = previousOverflow;

      window.removeEventListener('keydown', handleKeyDown);

    };

  }, [handleKeyDown]);

  return (

    <div

      className="internship-modal-overlay"

      onMouseDown={(event) => {

        if (event.target === event.currentTarget) {

          onClose();

        }

      }}

    >

      <section

        className="internship-modal"

        role="dialog"

        aria-modal="true"

        aria-labelledby="internship-modal-title"

      >

        <header className="internship-modal-header">

          <h2 id="internship-modal-title">{topic}</h2>

          <button

            type="button"

            className="internship-modal-close"

            onClick={onClose}

            aria-label="Close course details"

          >

            ×

          </button>

        </header>

        <div className="internship-modal-badge">{topic}</div>

        <div className="internship-modal-description">

          <p>{description}</p>

        </div>

        <div className="internship-modal-content">

          <h3>Course Structure</h3>

          <div className="internship-modal-table-wrap">

            <table className="internship-modal-table">

              <thead>

                <tr>

                  <th scope="col">Module</th>

                  <th scope="col">Sub-Modules</th>

                </tr>

              </thead>

              <tbody>

                {modules.map((module) => (

                  <tr key={module.module}>

                    <td className="internship-modal-module">

                      {module.module}

                    </td>

                    <td>

                      <ul>

                        {module.subModules.map((subModule) => (

                          <li key={subModule}>{subModule}</li>

                        ))}

                      </ul>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

        <footer className="internship-modal-footer">

          <Link

            className="internship-modal-apply"

            to={`/register?course=${encodeURIComponent(topic)}`}

          >

            APPLY NOW (PROCEED TO APPLICATION)

          </Link>

        </footer>

      </section>

      <style>{`

        .internship-modal-overlay {

          position: fixed;

          inset: 0;

          z-index: 99999;

          display: flex;

          align-items: center;

          justify-content: center;

          padding: 24px;

          background: rgba(0, 0, 0, 0.62);

          backdrop-filter: blur(3px);

        }

        .internship-modal {

          position: relative;

          display: flex;

          flex-direction: column;

          width: min(925px, 100%);

          max-height: min(88vh, 820px);

          overflow: hidden;

          border-radius: 0 0 10px 10px;

          background: #fff;

          color: #444;

          box-shadow: 0 16px 55px rgba(0, 0, 0, 0.28);

        }

        .internship-modal-header {

          position: relative;

          flex: 0 0 auto;

          padding: 26px 58px 12px;

          text-align: center;

        }

        .internship-modal-header h2 {

          margin: 0;

          color: #08265f;

          font-size: 25px;

          font-weight: 750;

          overflow-wrap: anywhere;

        }

        .internship-modal-close {

          position: absolute;

          top: 12px;

          right: 20px;

          width: 36px;

          height: 36px;

          padding: 0;

          border: 0;

          background: transparent;

          color: #999;

          font-size: 32px;

          line-height: 1;

          cursor: pointer;

        }

        .internship-modal-close:hover {

          color: #172554;

        }

        .internship-modal-badge {

          flex: 0 0 auto;

          align-self: center;

          max-width: calc(100% - 36px);

          margin: 14px auto 0;

          padding: 7px 12px;

          border-radius: 6px;

          background: #e0f7fa;

          color: #08265f;

          font-size: 13px;

          font-weight: 700;

          overflow-wrap: anywhere;

          text-align: center;

        }

        .internship-modal-description {

          flex: 0 0 auto;

          padding: 24px 36px 4px;

          text-align: center;

        }

        .internship-modal-description p {

          margin: 0;

          color: #686868;

          font-size: 16px;

          font-style: italic;

          line-height: 1.55;

        }

        .internship-modal-content {

          min-height: 0;

          flex: 1 1 auto;

          overflow-y: auto;

          overscroll-behavior: contain;

          margin: 20px 36px 12px;

          scrollbar-width: thin;

          scrollbar-color: #999 #f3f3f3;

        }

        .internship-modal-content h3 {

          margin: 0 0 18px;

          padding-bottom: 8px;

          border-bottom: 1px solid #e6e6e6;

          color: #08265f;

          font-size: 16px;

          font-weight: 750;

        }

        .internship-modal-table-wrap {

          width: 100%;

          overflow-x: auto;

        }

        .internship-modal-table {

          width: 100%;

          border-collapse: collapse;

          table-layout: fixed;

          font-size: 15px;

        }

        .internship-modal-table th {

          padding: 15px 12px;

          background: #08265f;

          color: #fff;

          font-size: 15px;

          font-weight: 750;

          text-align: left;

        }

        .internship-modal-table th:first-child {

          width: 49%;

        }

        .internship-modal-table td {

          padding: 15px 12px;

          border: 1px solid #dedede;

          vertical-align: top;

          line-height: 1.55;

          overflow-wrap: anywhere;

        }

        .internship-modal-module {

          color: #007d56;

          font-weight: 650;

        }

        .internship-modal-table ul {

          display: grid;

          gap: 5px;

          margin: 0;

          padding-left: 22px;

        }

        .internship-modal-table li {

          padding-left: 1px;

        }

        .internship-modal-footer {

          flex: 0 0 auto;

          padding: 18px 7.5% 20px;

          background: #fff;

          box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.025);

        }

        .internship-modal-apply {

          display: flex;

          min-height: 52px;

          align-items: center;

          justify-content: center;

          padding: 12px 18px;

          border: 1px solid #999;

          border-radius: 8px;

          background: #006b4f;

          color: #fff;

          font-size: 14px;

          font-weight: 800;

          text-align: center;

          text-decoration: none;

          transition: background 160ms ease;

        }

        .internship-modal-apply:hover {

          background: #00543e;

        }

        .internship-modal-apply:focus-visible,

        .internship-modal-close:focus-visible {

          outline: 3px solid #65aaff;

          outline-offset: 3px;

        }

        @media (max-width: 600px) {

          .internship-modal-overlay {

            align-items: center;

            padding: 10px;

          }

          .internship-modal {

            max-height: 92dvh;

            border-radius: 8px;

          }

          .internship-modal-header {

            padding: 22px 44px 10px;

          }

          .internship-modal-header h2 {

            font-size: 21px;

          }

          .internship-modal-close {

            top: 8px;

            right: 8px;

          }

          .internship-modal-description {

            padding: 18px 16px 0;

          }

          .internship-modal-description p {

            font-size: 14px;

          }

          .internship-modal-content {

            margin: 18px 12px 8px;

          }

          .internship-modal-table {

            font-size: 13px;

          }

          .internship-modal-table th,

          .internship-modal-table td {

            padding: 10px 8px;

          }

          .internship-modal-table th:first-child {

            width: 40%;

          }

          .internship-modal-table ul {

            padding-left: 16px;

          }

          .internship-modal-footer {

            padding: 12px;

          }

          .internship-modal-apply {

            min-height: 48px;

            font-size: 12px;

          }

        }

      `}</style>

    </div>

  );

}

export default function Internship() {

  const [query, setQuery] = useState('');

  const [filter, setFilter] = useState('all');

  const [noticeOpen, setNoticeOpen] = useState(true);

  const [selectedTopic, setSelectedTopic] = useState(null);

  const filteredTopics = useMemo(() => {

    const search = query.trim().toLowerCase();

    return internshipTopics.filter((topic) => {

      const searchableText =

        `${topic} ${topicDescription(topic)}`.toLowerCase();

      const matchesSearch =

        !search || searchableText.includes(search);

      const normalized = topic.toLowerCase();

      const domainPattern = /b\.?voc|b\.?com|b\.?sc|computer|science|chemistry|botany|physics|electronics|economics|geography|geology|history|mathematics|microbiology|philosophy|political|psychology|sanskrit|sociology|statistics|zoology|english|bengali|journalism|nutrition|fisheries|management|biology|food/i;

      const skillPattern =

        /skill|marketing|software|machine learning|understanding ai|communication|entrepreneurship|technical/i;

      const matchesFilter =

        filter === 'all' ||

        (filter === 'domain' && domainPattern.test(normalized)) ||

        (filter === 'skill' && skillPattern.test(normalized));

      return matchesSearch && matchesFilter;

    });

  }, [query, filter]);

  return (

    <main className="internship-directory">

      <div className="internship-back-row">

        <Link

          to="/"

          className="internship-back"

          aria-label="Back to home"

        >

          ⬅️

        </Link>

      </div>

      {noticeOpen && (

        <section

          className="internship-notice"

          aria-label="Internship announcement"

        >

          <div className="internship-notice__header">

            <h2>Internship Announcement (UGC Mandate)</h2>

            <button

              className="internship-notice__toggle"

              type="button"

              onClick={() => setNoticeOpen(false)}

              aria-label="Close internship announcement"

            >

              ×

            </button>

          </div>

          <div className="internship-notice__body">

            <p>

              The UGC has made internships mandatory for all

              undergraduate students. Our program helps students

              gain valuable, practical experience while developing

              employability, entrepreneurship, sustainability,

              and technical skills.

            </p>

            <a

              className="internship-notice__button"

              href="https://www.ugc.gov.in/"

              target="_blank"

              rel="noopener noreferrer"

            >

              Know More about the Mandate

            </a>

          </div>

        </section>

      )}

      <section

        className="internship-catalog"

        aria-labelledby="internship-topics-heading"

      >

        <label className="internship-search">

          <span className="sr-only">Search internship topics</span>

          <input

            type="search"

            value={query}

            onChange={(event) => setQuery(event.target.value)}

            placeholder="Search courses by name, description, or category... 🔎"

          />

        </label>

        <div

          className="internship-filters"

          role="group"

          aria-label="Filter internship topics"

        >

          {[

            ['all', 'Show All'],

            ['domain', 'Domain'],

            ['skill', 'Skill'],

          ].map(([value, label]) => (

            <button

              key={value}

              type="button"

              className={

                filter === value

                  ? 'internship-filter is-active'

                  : 'internship-filter'

              }

              onClick={() => setFilter(value)}

              aria-pressed={filter === value}

            >

              {label}

            </button>

          ))}

        </div>

        <div className="internship-topics-heading">

          <h1 id="internship-topics-heading">

            Internship Topics ({filteredTopics.length})

          </h1>

          <p>

            Explore internship structures by subject, domain,

            or skill area. Select any course to view its structure.

          </p>

        </div>

        {filteredTopics.length > 0 ? (

          <div className="internship-topic-grid">

            {filteredTopics.map((topic) => (

              <article

                className="internship-topic-card internship-topic-card--clickable"

                key={topic}

                onClick={() => setSelectedTopic(topic)}

              >

                <button

                  type="button"

                  className="internship-topic-card__open"

                  onClick={(event) => {

                    event.preventDefault();

                    event.stopPropagation();

                    setSelectedTopic(topic);

                  }}

                  aria-label={`View course structure for ${topic}`}

                >

                  <h2>{topic}</h2>

                  <p>{topicDescription(topic)}</p>

                  <span className="internship-topic-tag">

                    {topic.toUpperCase()}

                  </span>

                  <span className="internship-topic-view">

                    View course structure →

                  </span>

                </button>

              </article>

            ))}

          </div>

        ) : (

          <div className="internship-empty">

            <h2>No matching topics found</h2>

            <p>

              Try another search term or select Show All.

            </p>

            <button

              type="button"

              onClick={() => {

                setQuery('');

                setFilter('all');

              }}

            >

              Clear filters

            </button>

          </div>

        )}

      </section>

      {/* Render the modal whenever a course is selected. */}

      {selectedTopic !== null && (

        <CourseModal

          topic={selectedTopic}

          onClose={() => setSelectedTopic(null)}

        />

      )}

      <style>{`

        .internship-topic-card--clickable {

          cursor: pointer;

          padding: 0;

          transition: transform 160ms ease, box-shadow 160ms ease;

        }

        .internship-topic-card--clickable:hover {

          transform: translateY(-3px);

        }

        .internship-topic-card__open {

          display: flex;

          width: 100%;

          height: 100%;

          flex-direction: column;

          align-items: flex-start;

          padding: 24px;

          border: 0;

          border-radius: inherit;

          background: transparent;

          color: inherit;

          font: inherit;

          text-align: left;

          cursor: pointer;

        }

        .internship-topic-card__open h2 {

          margin-top: 0;

        }

        .internship-topic-card__open p {

          flex: 1;

        }

        .internship-topic-card__open:focus-visible {

          outline: 3px solid #1767c0;

          outline-offset: 3px;

        }

        .internship-topic-view {

          display: inline-block;

          margin-top: 16px;

          color: #006b4f;

          font-weight: 750;

        }

        @media (max-width: 600px) {

          .internship-topic-card__open {

            padding: 18px;

          }

        }

      `}</style>

    </main>

  );

}
