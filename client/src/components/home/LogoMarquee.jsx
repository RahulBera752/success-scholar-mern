import SectionTitle from '../common/SectionTitle.jsx';

export default function LogoMarquee({ title, items, id }) {
  const hasLogos = items.length > 0 && typeof items[0] !== 'string';
  const loop = hasLogos ? null : [...items, ...items];

  return (
    <section className={`marquee-section${hasLogos ? ' marquee-section--logos' : ''}`} id={id}>
      <SectionTitle>{title}</SectionTitle>
      <div className={`marquee${hasLogos ? ' marquee--logos' : ''}`}>
        <div className={`marquee-track${hasLogos ? ' marquee-track--logos' : ''}`}>
          {hasLogos ? [0, 1].map((copy) => (
            <div className="marquee-set" key={copy} aria-hidden={copy === 1}>
              {items.map((item) => (
                <img
                  className="marquee-logo"
                  key={item.name}
                  src={item.src}
                  alt={copy === 0 ? `${item.name} logo` : ''}
                  loading="eager"
                  decoding="async"
                  onError={(event) => {
                    event.currentTarget.hidden = true;
                    if (copy === 0) {
                      console.error(`Logo failed to load: ${item.name} (${item.src})`);
                    }
                  }}
                />
              ))}
            </div>
          )) : loop.map((name, i) => (
            <span className="marquee-chip" key={`${name}-${i}`}>{name}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
