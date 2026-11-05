import { useState } from 'react';
import { Link } from 'react-router-dom';
import SectionTitle from '../common/SectionTitle.jsx';
import Icon from '../common/Icon.jsx';
import { faqs } from '../../data/faqs.js';

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section tinted" id="faq">
      <SectionTitle>Generic FAQ’s</SectionTitle>
      <div className="container narrow">
        {faqs.map(([q, a], i) => (
          <div className={`faq ${open === i ? 'open' : ''}`} key={q}>
            <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
              <span>{q}</span>
              <Icon name={open === i ? 'close' : 'plus'} size={20} />
            </button>
            {open === i && <p>{a}</p>}
          </div>
        ))}
        <div className="center"><Link to="/contact" className="btn btn-primary">Know More</Link></div>
      </div>
    </section>
  );
}
