import { useState } from 'react';

const socials = [
  { label: 'Facebook', href: 'https://www.facebook.com/lyzelmae133' },
  { label: 'Instagram', href: 'https://www.instagram.com/itz133zel' },
  { label: 'GitHub', href: 'https://github.com/lee231-gia' },
];

export default function Header({ page }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [worksOpen, setWorksOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <header className="site-header">
      <nav className="container navbar" aria-label="Main navigation">
        <a className="brand" href="home.html">Lyzel Mae Talisic</a>
        <button className="menu-toggle" type="button" onClick={() => setMenuOpen(!menuOpen)}>
          Menu
        </button>

        <ul className={`nav-links ${menuOpen ? 'show-menu' : ''}`}>
          <li><a className={page === 'home' ? 'active' : ''} href="home.html">Home</a></li>
          <li><a className={page === 'about' ? 'active' : ''} href="about.html">About</a></li>
          <li>
            <button className={`dropdown-btn ${page === 'works' ? 'active' : ''}`} type="button" onClick={() => setWorksOpen(!worksOpen)}>
              Works <span className="dropdown-arrow">{worksOpen ? '↑' : '↓'}</span>
            </button>
            <ul className={`dropdown-menu ${worksOpen ? 'show' : ''}`}>
              <li><a href="works.html">Work Archive</a></li>
              <li><a href="works.html#current-project">Current Project</a></li>
              <li><a href="works.html#past-projects">Past Projects</a></li>
              <li><a href="works.html#web-app-development">Web App Development</a></li>
              <li><a href="budget.html">Budget Tracker</a></li>
            </ul>
          </li>
          <li><a className={page === 'achievements' ? 'active' : ''} href="achievements.html">Achievements</a></li>
          <li className="contact-nav-item">
            <button className={`dropdown-btn contact-dropdown-btn ${page === 'contact' ? 'active' : ''}`} type="button" onClick={() => setContactOpen(!contactOpen)}>
              Contact <span className="contact-dropdown-arrow">{contactOpen ? '↑' : '↓'}</span>
            </button>
            <ul className={`dropdown-menu contact-dropdown-menu ${contactOpen ? 'show' : ''}`}>
              <li><a href="contact.html">Get in Touch</a></li>
              {socials.map(({ label, href }) => (
                <li key={label}><a href={href} target="_blank" rel="noreferrer">{label} ↗</a></li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </header>
  );
}
