import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { asset } from '../data/portfolio';

const projects = [
  {
    id: 'current-project',
    title: 'ReAccess Hub',
    note: 'Current project',
    description: 'A Software Engineering team project for Tangub City Global College, focused on Office 365 and Teams-related service requests.',
    image: 'reaccess-hub.png',
  },
  {
    id: 'past-projects',
    title: 'Past Projects',
    note: '3 papers inside',
    description: 'Earlier builds and visual work that still belong in my archive.',
    image: 'cursed-cfg-game.png',
  },
  {
    id: 'web-app-development',
    title: 'Web App Development',
    note: 'Course work',
    description: 'Course activities and portfolio work I am collecting as I continue learning.',
    image: null,
  },
];

export default function WorksPage() {
  const [openProjectId, setOpenProjectId] = useState(window.location.hash.slice(1));
  const [isFullView, setIsFullView] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const syncHash = () => setOpenProjectId(window.location.hash.slice(1));
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('archive-open', Boolean(openProjectId));
    return () => document.body.classList.remove('archive-open');
  }, [openProjectId]);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key !== 'Escape') return;
      if (preview) setPreview(null);
      else if (openProjectId) closeDrawer();
    }

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [openProjectId, preview]);

  function closeDrawer() {
    window.history.pushState({}, '', window.location.pathname);
    setOpenProjectId('');
    setIsFullView(false);
  }

  const selectedProject = projects.find(({ id }) => id === openProjectId);

  return (
    <>
      <Header page="works" />
      <main className="works-main">
        <section className="page-intro">
          <div className="container works-intro-row">
            <div>
              <span className="mini-label">Pull a file</span>
              <h1 className="page-title">Work archive</h1>
              <p className="page-lead">Projects, course work, and visual pieces I want to keep in one archive.</p>
            </div>
            <img className="archive-mark" src={asset('butterfly.png')} alt="" aria-hidden="true" />
          </div>
        </section>

        <section className="archive-cabinet" aria-label="Project archive">
          <div className="container archive-cabinet-inner">
            <div className="archive-spine" aria-hidden="true">
              <span>WORK</span><span>ARCHIVE</span><small>LYZEL / 2026</small>
            </div>
            <div className="archive-files">
              {projects.map((project, index) => (
                <a className="archive-file-tab" href={`#${project.id}`} key={project.id}>
                  <span className="archive-file-no">0{index + 1}</span>
                  <span className="archive-file-name">{project.title}</span>
                  <span className="archive-file-note">{project.note}</span>
                  <span className="archive-file-action">pull →</span>
                </a>
              ))}
              <a className="archive-file-tab budget-file-tab" href="budget.html">
                <span className="archive-file-no">04</span>
                <span className="archive-file-name">Budget Tracker</span>
                <span className="archive-file-note">Personal tool</span>
                <span className="archive-file-action">open →</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {selectedProject && (
        <>
          <button className="archive-backdrop show" type="button" aria-label="Close project file" onClick={closeDrawer} />
          <aside className={`archive-drawer drawer-open ${isFullView ? 'drawer-full' : ''}`} aria-label="Selected project file">
            <div className="archive-drawer-head">
              <span>Project file</span>
              <div className="drawer-head-actions">
                <button className="archive-drawer-full" type="button" onClick={() => setIsFullView(!isFullView)}>
                  {isFullView ? 'side view ↙' : 'full view ↗'}
                </button>
              <button className="archive-drawer-close" type="button" onClick={closeDrawer}>close ×</button>
              </div>
            </div>
            <div className="archive-drawer-body">
              {selectedProject.id === 'current-project' && (
                <article className="archive-file active">
                <div className="archive-file-code">PROJECT / {selectedProject.note}</div>
                <div className="project-state">Software Engineering</div>
                <h2 className="archive-project-title">{selectedProject.title}</h2>
                <p className="archive-project-lead">{selectedProject.description}</p>
                <div className="archive-preview archive-preview-image">
                  <span className="in-progress-stamp">IN PROGRESS</span>
                  <button className="work-image-button" type="button" onClick={() => setPreview({ src: asset(selectedProject.image), title: 'ReAccess Hub — in progress' })}>
                    <img src={asset(selectedProject.image)} alt="ReAccess Hub website screenshot" />
                    <span className="full-preview-label">view image full ↗</span>
                  </button>
                </div>
                <dl className="archive-meta">
                  <div><dt>COURSE</dt><dd>Software Engineering</dd></div>
                  <div><dt>TYPE</dt><dd>School website/system</dd></div>
                  <div><dt>STATUS</dt><dd>Team project · In progress</dd></div>
                </dl>
                </article>
              )}

              {selectedProject.id === 'past-projects' && (
                <article className="archive-file active">
                  <div className="archive-file-code">FILE 02 / PAST PROJECTS</div>
                  <div className="project-state">Older works</div>
                  <h2 className="archive-project-title">Past Projects</h2>
                  <p className="archive-project-lead">Earlier builds and visual work that still belong in my archive.</p>
                  <div className="work-paper-stack past-paper-stack">
                    <article className="work-paper project-paper project-paper-cfg">
                      <span className="work-paper-no">PAPER 01</span>
                      <h3>Cursed CFG Game</h3>
                      <button className="work-image-button project-shot" type="button" onClick={() => setPreview({ src: asset('cursed-cfg-game.png'), title: 'Cursed CFG Game' })}>
                        <img src={asset('cursed-cfg-game.png')} alt="Cursed CFG Game homepage screenshot" />
                      </button>
                      <p>An educational web game built around context-free grammar activities, derivations, and parse-tree practice.</p>
                      <a className="archive-live-link" href="https://lee231-gia.github.io/curse-cfg-game/" target="_blank" rel="noreferrer">Open live project ↗</a>
                    </article>
                    <article className="work-paper project-paper project-paper-sound">
                      <span className="work-paper-no">PAPER 02</span>
                      <h3>Sound Scanner</h3>
                      <button className="work-image-button project-shot" type="button" onClick={() => setPreview({ src: asset('sound-scanner.png'), title: 'Sound Scanner' })}>
                        <img src={asset('sound-scanner.png')} alt="Sound Scanner homepage screenshot" />
                      </button>
                      <p>An interactive audio-to-binary web activity with a scanner-style interface.</p>
                      <a className="archive-live-link" href="https://lee231-gia.github.io/sound-scanner/" target="_blank" rel="noreferrer">Open live project ↗</a>
                    </article>
                    <article className="work-paper logo-variants-paper">
                      <span className="work-paper-no">PAPER 03</span>
                      <h3>LYZ HAVEN</h3>
                      <p>Personal logo study in three background versions.</p>
                      <div className="logo-variant-grid">
                        {[
                          ['lyz-haven-black.png', 'black'],
                          ['lyz-haven-white.png', 'white'],
                          ['lyz-haven-transparent.png', 'transparent'],
                        ].map(([image, label]) => (
                          <button className="work-image-button logo-variant" type="button" key={image} onClick={() => setPreview({ src: asset(image), title: `LYZ HAVEN — ${label} background` })}>
                            <img src={asset(image)} alt={`LYZ HAVEN logo on ${label} background`} />
                            <span className="variant-label">{label}</span>
                          </button>
                        ))}
                      </div>
                    </article>
                  </div>
                </article>
              )}

              {selectedProject.id === 'web-app-development' && (
                <article className="archive-file active">
                  <div className="archive-file-code">FILE 03 / WEB APP DEVELOPMENT</div>
                  <div className="project-state">Course work</div>
                  <h2 className="archive-project-title">Web App Development</h2>
                  <p className="archive-project-lead">Course activities and portfolio work I am collecting as I continue learning.</p>
                  <div className="work-paper-stack webapp-paper-stack">
                    <article className="work-paper">
                      <span className="work-paper-no">PAPER 01</span>
                      <h3>This Portfolio</h3>
                      <p>My portfolio activity, built as a React app with reusable components and responsive styling.</p>
                      <a className="archive-live-link" href="index.html">Open this portfolio →</a>
                    </article>
                    <article className="work-paper work-paper-empty">
                      <span className="work-paper-no">PAPER 02</span>
                      <h3>COMING SOON</h3>
                    </article>
                  </div>
                </article>
              )}
            </div>
          </aside>
        </>
      )}

      {preview && (
        <dialog open className="certificate-dialog work-preview-dialog" onClick={(event) => {
          if (event.target === event.currentTarget) setPreview(null);
        }}>
          <div className="certificate-dialog-bar">
            <span>{preview.title}</span>
            <button className="dialog-close" type="button" onClick={() => setPreview(null)}>close ×</button>
          </div>
          <img src={preview.src} alt={preview.title} />
        </dialog>
      )}
      <Footer />
    </>
  );
}
