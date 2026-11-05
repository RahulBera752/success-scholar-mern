import { Link } from 'react-router-dom';
import CareersHero from '../components/careers/CareersHero.jsx';
import JobTable from '../components/careers/JobTable.jsx';
import CareerCards from '../components/careers/CareerCards.jsx';
import NetworkBanner from '../components/careers/NetworkBanner.jsx';
import Footer from '../components/layout/Footer.jsx';
import { useState } from 'react';

export default function Careers() {
  const [query, setQuery] = useState({ q: '', location: '' });
  return (
    <div className="careers">
      <div className="careers-top"><Link to="/">← Back to Home</Link></div>
      <CareersHero onSearch={setQuery} />
      <JobTable query={query} />
      <CareerCards />
      <NetworkBanner />
      <Footer />
    </div>
  );
}
