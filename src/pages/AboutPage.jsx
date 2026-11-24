import Header from '../components/Header';
import Footer from '../components/Footer';

const interests = ['Music', 'Photography', 'Old games', 'Romanticize'];

export default function AboutPage() {
  return (
    <>
      <Header page="about" />
      <main>
        <section className="about-intro">
          <div className="container about-intro-copy">
            <span className="mini-label">About me</span>
            <h1>Still figuring things out, but still moving forward.</h1>
            <p>I’m Lyzel Mae Talisic, a third-year Computer Science student at Tangub City Global College. I like exploring ideas through web projects, small apps, and creative side projects.</p>
            <p>Outside class, I’m interested in freelancing, content creation, and finding practical ways to use technology while building a life I can enjoy.</p>
          </div>
        </section>

        <section className="about-body">
          <div className="container">
            <div className="about-note-stack">
              <article>
                <span className="mini-label">Open to</span>
                <h2>Freelancing and more.</h2>
                <p>I’m open to small projects, side work, and experiences that let me learn outside the classroom.</p>
              </article>
              <article>
                <span className="mini-label">Future goals</span>
                <h2>Build a life I can enjoy.</h2>
                <p>Finish college, build a solid career, grow different sidelines, post on YouTube, earn well, keep creating, and still make time to enjoy life.</p>
              </article>
            </div>

            <div className="about-interests">
              <span className="mini-label">Interests</span>
              <ul className="about-interest-list">
                {interests.map((interest) => (
                  <li key={interest}><span className="interest-dot" aria-hidden="true" />{interest}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
