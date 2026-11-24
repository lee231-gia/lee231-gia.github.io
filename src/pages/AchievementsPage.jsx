import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { asset } from '../data/portfolio';

const certificates = [
  {
    image: 'certificate-aug24.png',
    date: 'Aug 24, 2026',
    title: 'IT Seminar — August 24, 2026',
    description: 'IT Seminar — Ecommerce MVP + GSSO + Analytics with Django & Nxt',
  },
  {
    image: 'certificate-aug28.png',
    date: 'Aug 28, 2026',
    title: 'IT Seminar — August 28, 2026',
    description: 'IT Seminar — You Don’t Need the “Perfect Dev Path”',
  },
];

export default function AchievementsPage() {
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  return (
    <>
      <Header page="achievements" />
      <main>
        <section className="page-intro">
          <div className="container">
            <span className="mini-label">Pieces I want to keep</span>
            <h1 className="page-title">Achievements</h1>
            <p className="page-lead">A small wall of certificates, activities, and roles that became part of my college experience.</p>
          </div>
        </section>

        <section className="achievement-stage">
          <div className="container">
            <div className="certificate-wall">
              {certificates.map((certificate) => (
                <button className="certificate-shot" type="button" key={certificate.image} onClick={() => setSelectedCertificate(certificate)}>
                  <img src={asset(certificate.image)} alt={certificate.title} />
                  <div className="certificate-caption">
                    <span className="certificate-date">{certificate.date}</span>
                    <strong>{certificate.description}</strong>
                    <span>Certificate of Participation · Tangub City Global College</span>
                  </div>
                </button>
              ))}
            </div>

            <article className="achievement-note">
              <span className="mini-label">Organization</span>
              <h2>Treasurer — JPEG.com</h2>
              <p>Junior Programming Enthusiasts Group of Computer Students. One of the roles I’m balancing alongside my Computer Science coursework.</p>
            </article>
          </div>
        </section>
      </main>

      {selectedCertificate && (
        <dialog open className="certificate-dialog" onClick={(event) => {
          if (event.target === event.currentTarget) setSelectedCertificate(null);
        }}>
          <div className="certificate-dialog-bar">
            <span>{selectedCertificate.title}</span>
            <button className="dialog-close" type="button" onClick={() => setSelectedCertificate(null)}>close ×</button>
          </div>
          <img src={asset(selectedCertificate.image)} alt={selectedCertificate.title} />
        </dialog>
      )}
      <Footer />
    </>
  );
}
