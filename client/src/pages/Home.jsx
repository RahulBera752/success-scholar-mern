import Hero from '../components/home/Hero.jsx';
import InternshipBanner from '../components/home/InternshipBanner.jsx';
import LogoMarquee from '../components/home/LogoMarquee.jsx';
import Expertise from '../components/home/Expertise.jsx';
import Courses from '../components/home/Courses.jsx';
import Portfolio from '../components/home/Portfolio.jsx';
import Testimonials from '../components/home/Testimonials.jsx';
import VisionMission from '../components/home/VisionMission.jsx';
import Faq from '../components/home/Faq.jsx';
import ContactSection from '../components/home/ContactSection.jsx';
import { companies, institutions } from '../data/partners.js';

export default function Home() {
  return (
    <>
      <Hero />
      <InternshipBanner />
      <LogoMarquee title="Our students are contributing to top organizations worldwide." items={companies} />
      <Expertise />
      <Courses />
      <LogoMarquee id="trusted-institutions" title="Trusted by more than 1 lakh students nationwide" items={institutions} />
      <Portfolio />
      <Testimonials />
      <VisionMission />
      <Faq />
      <ContactSection />
    </>
  );
}
