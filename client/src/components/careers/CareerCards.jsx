import Icon from '../common/Icon.jsx';
import { LogoMark } from '../common/Logo.jsx';

const cards = [
  { text: 'Join our team and build amazing things together!', icon: 'users', from: '#1b1bb3', to: '#7fd3ff' },
  { text: 'Confidence. Communication. Career — the three C’s of success.', icon: 'star', from: '#000066', to: '#6aa8ff' },
  { text: 'Bridging the gap between classroom learning and industry experience.', icon: 'cap', from: '#0b6e99', to: '#9be7ff' },
];

export default function CareerCards() {
  return (
    <section className="section">
      <div className="container career-cards">
        {cards.map((c) => (
          <article className="card post" key={c.text}>
            <header><LogoMark size={36} /><div><strong>Success Scholar</strong> <span className="verified"><Icon name="check" size={12} /></span><small>Sponsored</small></div></header>
            <div className="post-art" style={{ background: `linear-gradient(135deg, ${c.from}, ${c.to})` }}><Icon name={c.icon} size={72} /></div>
            <p>{c.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
