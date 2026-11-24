import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { socialLinks } from '../data/portfolio';

const directDetails = [
  { label: 'Email', value: 'talisiclyzel@gmail.com' },
  { label: 'Phone', value: '09700833862' },
];

export default function ContactPage() {
  const [message, setMessage] = useState('');

  async function copyToClipboard(value) {
    try {
      await navigator.clipboard.writeText(value);
      setMessage(`Copied: ${value}`);
    } catch {
      setMessage('Copy failed. Select the text manually.');
    }
    window.setTimeout(() => setMessage(''), 1600);
  }

  return (
    <>
      <Header page="contact" />
      <main className="contact-page contact-page-simple">
        <div className="container">
          <div className="contact-heading-block">
            <span className="mini-label">Contact</span>
            <h1 className="contact-title">GET IN TOUCH</h1>
            <p className="contact-copy">For projects, collaborations, or just to say hi.</p>
          </div>

          <div className="contact-simple-grid">
            <section className="contact-group" aria-labelledby="socials-label">
              <span className="mini-label" id="socials-label">Socials</span>
              <div className="contact-link-list">
                {socialLinks.map(({ label, href }) => (
                  <a href={href} target="_blank" rel="noreferrer" key={label}><span>{label}</span><span>↗</span></a>
                ))}
              </div>
            </section>

            <section className="contact-group" aria-labelledby="direct-label">
              <span className="mini-label" id="direct-label">Direct</span>
              <div className="contact-direct-list">
                {directDetails.map(({ label, value }) => (
                  <div className="contact-detail-row" key={label}>
                    <span>{label}</span><strong>{value}</strong>
                    <button className="contact-copy-button" type="button" onClick={() => copyToClipboard(value)}>Copy</button>
                  </div>
                ))}
              </div>
            </section>
          </div>

        </div>
      </main>
      {message && <div className="copy-toast show" role="status" aria-live="polite">{message}</div>}
      <Footer />
    </>
  );
}
