import Header from '../components/Header';
import Footer from '../components/Footer';
import { useMusicPlayer } from '../components/MusicPlayer';
import { asset } from '../data/portfolio';

export default function HomePage() {
  const { openAndPlay } = useMusicPlayer();

  return (
    <>
      <Header page="home" />
      <main>
        <section className="home-editorial container">
          <div className="home-name-field">
            <span className="mini-label home-label">Home / 2026</span>
            <h1 className="hero-name home-editorial-name"><span>LYZEL MAE</span><span>TALISIC</span></h1>
            <div className="hero-meta home-meta-row">
              <span>BSCS — 3</span>
              <span>Tangub City Global College</span>
              <span>open to learning &amp; freelancing</span>
            </div>
          </div>

          <div className="home-portrait-overlap">
            <div className="portrait-red-panel">
              <button
                className="music-trigger home-music-trigger"
                type="button"
                aria-label="Open hidden music player"
                onClick={openAndPlay}
              >
                <img src={asset('butterfly.png')} alt="Small butterfly seal" />
              </button>
            </div>
            <div className="portrait-paper home-portrait-paper">
              <img src={asset('portrait.png')} alt="Portrait of Lyzel Mae Talisic" />
            </div>
            <img className="hero-flower" src={asset('spider-lily.png')} alt="" aria-hidden="true" />
          </div>

          <div className="home-intro-flow">
            <p>I’m a third-year Computer Science student who likes turning ideas into pages, apps, and small projects I can actually use.</p>
            <p>Right now, I’m exploring web development, creative technology, and practical ways to work with AI while developing my own style.</p>
            <div className="hero-links">
              <a className="text-link" href="works.html#current-project">See what I’m building <span>↗</span></a>
              <a className="text-link" href="about.html">Read my story <span>→</span></a>
            </div>
          </div>
        </section>

        <div className="container home-section-break" aria-hidden="true"><span /></div>
        <section className="home-afterword container">
          <article className="home-focus-piece">
            <span className="mini-label">Current focus</span>
            <h2>ReAccess Hub</h2>
            <p>A Software Engineering school website/system that my team is currently building for TCGC. Still in progress, still evolving.</p>
            <a className="mosaic-link" href="works.html#current-project">open project file →</a>
          </article>
        </section>
      </main>
      <Footer />
    </>
  );
}
