import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { socialLinks } from '../data/portfolio';

const directDetails = [
  { label: 'Email', value: 'talisiclyzel@gmail.com' },
  { label: 'Phone', value: '09700833862' },
];

const messageTopics = [
  'App suggestion',
  'Comment or feedback',
  'Project collaboration',
  'Others',
];

export default function ContactPage() {
  const [message, setMessage] = useState('');
  const [topic, setTopic] = useState(messageTopics[0]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [messageBody, setMessageBody] = useState('');

  async function copyToClipboard(value) {
    try {
      await navigator.clipboard.writeText(value);
      setMessage(`Copied: ${value}`);
    } catch {
      setMessage('Copy failed. Select the text manually.');
    }
    window.setTimeout(() => setMessage(''), 1600);
  }

  function sendMessage(event) {
    event.preventDefault();

    const subject = encodeURIComponent(`${topic} — Portfolio message`);
    const body = encodeURIComponent(
      `From: ${name}\nEmail: ${email}\nTopic: ${topic}\n\n${messageBody}`,
    );

    window.location.href = `mailto:talisiclyzel@gmail.com?subject=${subject}&body=${body}`;
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

          <section className="contact-message-section" aria-labelledby="message-heading">
            <div className="contact-message-intro">
              <span className="mini-label">Have an idea?</span>
              <h2 id="message-heading">Send me a message</h2>
              <p>Share an app suggestion, leave feedback, or tell me what’s on your mind.</p>
            </div>

            <form className="contact-message-form" onSubmit={sendMessage}>
              <label>
                What is this about?
                <select value={topic} onChange={(event) => setTopic(event.target.value)}>
                  {messageTopics.map((messageTopic) => (
                    <option key={messageTopic} value={messageTopic}>{messageTopic}</option>
                  ))}
                </select>
              </label>

              <div className="contact-message-fields">
                <label>
                  Your name
                  <input required maxLength="80" value={name} onChange={(event) => setName(event.target.value)} />
                </label>
                <label>
                  Your email
                  <input required type="email" maxLength="120" value={email} onChange={(event) => setEmail(event.target.value)} />
                </label>
              </div>

              <label>
                Message
                <textarea required rows="6" maxLength="3000" value={messageBody} onChange={(event) => setMessageBody(event.target.value)} placeholder="Write your suggestion or comment here…" />
              </label>

              <div className="contact-message-submit">
                <button type="submit">Continue to email ↗</button>
                <span>Your email app will open with your message ready to send.</span>
              </div>
            </form>
          </section>
        </div>
      </main>
      {message && <div className="copy-toast show" role="status" aria-live="polite">{message}</div>}
      <Footer />
    </>
  );
}
