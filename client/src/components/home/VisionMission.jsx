import Icon from '../common/Icon.jsx';

const values = [
  'Stewardship',
  'Talent Development',
  'Client Value Creation',
  'Collaboration',
  'Respect and Inclusion',
];

const hands = (
  <>
    <g fill="currentColor">
      <path d="M12 64c7-7 15-10 23-6l13 8v14l-15 8-18-11c-5-3-6-9-3-13Z" />
      <path d="M84 64c-7-7-15-10-23-6l-13 8v14l15 8 18-11c5-3 6-9 3-13Z" />
    </g>
    <path d="M27 69l13 10M69 69 56 79" stroke="white" strokeLinecap="round" strokeWidth="3" />
  </>
);

function Illustration({ kind }) {
  return (
    <div className="vmv-emblem" aria-hidden="true">
      <div className="vmv-emblem__inner">
        <svg className="vmv-emblem__art" viewBox="0 0 96 96" fill="none">
          {kind === 'vision' && (
            <>
              {hands}
              <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M48 6v8M25 13l5 7M71 13l-5 7M13 31l8 2M83 31l-8 2" strokeWidth="3" />
              </g>
              <path
                d="M8 43c10-14 23-21 40-21s30 7 40 21C78 57 65 64 48 64S18 57 8 43Z"
                fill="currentColor"
              />
              <path
                d="M48 30c-7 0-12 5-12 12 0 4 2 7 5 9 2 2 3 4 3 7h8c0-3 1-5 3-7 3-2 5-5 5-9 0-7-5-12-12-12Z"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="48" cy="42" r="3" stroke="white" strokeWidth="2.5" />
              <path d="M44 61h8M45 65h6" stroke="white" strokeWidth="3" strokeLinecap="round" />
            </>
          )}

          {kind === 'mission' && (
            <>
              {hands}
              <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="48" cy="41" r="22" strokeWidth="4" />
                <circle cx="48" cy="41" r="14" strokeWidth="4" />
                <circle cx="48" cy="41" r="6" strokeWidth="4" />
                <path d="m48 41 22-22" strokeWidth="5" />
                <path d="M63 18h9v9" fill="currentColor" strokeWidth="3" />
              </g>
            </>
          )}

          {kind === 'values' && (
            <>
              <path
                d="M48 18c4 8 9 11 18 9-2 9 1 14 9 18-8 4-11 9-9 18-9-2-14 1-18 9-4-8-9-11-18-9 2-9-1-14-9-18 8-4 11-9 9-18 9 2 14-1 18-9Z"
                fill="currentColor"
              />
              <circle cx="48" cy="45" r="11" fill="white" />
              <path d="m42 45 4 4 8-9" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              {hands}
            </>
          )}
        </svg>
      </div>
    </div>
  );
}

function VisionCard({ kind, title, children }) {
  return (
    <article className={'card vmv-card vmv-card--' + kind}>
      <Illustration kind={kind} />
      <div className="vmv-copy">
        <h3>{title}</h3>
        <div className="vmv-copy__divider" />
        {children}
      </div>
    </article>
  );
}

export default function VisionMission() {
  return (
    <section className="section vmv-section" id="about">
      <div className="container vmv-intro">
        <h2>Our Vision, Mission &amp; Values</h2>
        <div className="vmv-accent" aria-hidden="true">
          <span />
          <span />
        </div>
        <p>
          We are dedicated to shaping the future through continuous learning and innovation, guided by our core principles.
        </p>
      </div>

      <div className="container vmv-grid">
        <VisionCard kind="vision" title="Vision">
          <p>
            At Success Scholar, our vision is to empower individuals to unlock their true potential by blending technical
            knowledge with essential soft skills. Our goal is to nurture personal growth, build confidence, and prepare the next
            generation for real-world challenges. With multifaceted, high-quality training, we strive to make Success Scholar a
            leading institution in delivering transformative learning experiences.
          </p>
        </VisionCard>

        <VisionCard kind="mission" title="Mission">
          <p>
            At Success Scholar, our mission is to empower students with essential skills to thrive in an ever-evolving world. By
            blending technical knowledge with real-world wisdom, we aim to develop strong communication, leadership, and
            interpersonal abilities in every learner. By 2030, we aspire to train over 2 lakh students nationwide, shaping
            confident, well-rounded professionals ready to make a meaningful impact.
          </p>
        </VisionCard>

        <VisionCard kind="values" title="Our Core Values">
          <ul className="vmv-values">
            {values.map((value) => (
              <li key={value}>
                <Icon name="check" size={18} />
                <strong>{value}:</strong>
              </li>
            ))}
          </ul>
        </VisionCard>
      </div>
    </section>
  );
}