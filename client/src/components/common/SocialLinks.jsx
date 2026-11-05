const links = [
  { name: 'Facebook', href: 'https://www.facebook.com/success4scholar/', d: 'M13.500 21v-8h2.700l.5-3.300h-3.200V7.600c0-.9.400-1.700 1.800-1.700h1.500V3.100S15.500 3 14.300 3C11.800 3 10.200 4.500 10.200 7.200v2.500H7.500V13h2.700v8z' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/success-scholar/', d: 'M4 9h3.500v11H4zM5.700 3.500a2 2 0 110 4 2 2 0 010-4zM10 9h3.300v1.500c.5-.9 1.700-1.800 3.400-1.800 3.500 0 4.100 2.300 4.100 5.300V20h-3.500v-5.200c0-1.300 0-2.900-1.800-2.900s-2 1.400-2 2.800V20H10z' },
  { name: 'WhatsApp', href: 'https://wa.me/8276040204?text=Hello%2C%20I%27m%20interested%21', d: 'M12 3a9 9 0 00-7.700 13.600L3 21l4.500-1.200A9 9 0 1012 3zm4.600 12.300c-.2.600-1.200 1.100-1.700 1.200-.4.100-1 .1-1.600-.1-.4-.1-.9-.3-1.500-.6-2.600-1.100-4.300-3.800-4.400-4-.1-.2-1-1.300-1-2.500s.6-1.800.9-2c.2-.2.500-.3.700-.3h.5c.2 0 .4 0 .6.500l.8 2c.1.200.1.300 0 .5l-.3.400-.4.500c-.1.100-.3.300-.1.600.2.300.7 1.200 1.600 1.900 1.100 1 2 1.300 2.300 1.400.3.100.4.100.6-.1l.8-1c.2-.2.400-.2.600-.1l1.900.9c.3.100.5.200.5.300.1.200.1.800-.1 1.400z' },
];

export default function SocialLinks() {
  return (
    <div className="social-links">
      {links.map((l) => (
        <a key={l.name} className={`social-link social-${l.name.toLowerCase()}`} href={l.href} target="_blank" rel="noreferrer" aria-label={l.name} title={l.name}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={l.d} /></svg>
        </a>
      ))}
    </div>
  );
}
