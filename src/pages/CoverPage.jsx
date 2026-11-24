import { useState } from 'react';
import { asset } from '../data/portfolio';

export default function CoverPage() {
  const [isOpening, setIsOpening] = useState(false);

  function openPortfolio() {
    setIsOpening(true);
    document.body.classList.add('is-opening');
    window.setTimeout(() => {
      window.history.pushState({}, '', 'home.html');
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.setTimeout(() => document.body.classList.remove('is-opening'), 700);
    }, 680);
  }

  return (
    <main className={`cover-shell ${isOpening ? 'is-opening' : ''}`}>
      <div className="cover-panel cover-left" />
      <div className="cover-panel cover-right" />
      <img className="cover-flower" src={asset('spider-lily.png')} alt="" aria-hidden="true" />

      <div className="cover-center">
        <p className="cover-kicker">Personal portfolio</p>
        <h1 className="cover-name">LYZEL MAE<br />TALISIC</h1>
        <p className="cover-meta">BSCS — 3 · Tangub City Global College</p>
        <svg className="cover-thread" viewBox="0 0 420 58" aria-hidden="true">
          <path d="M8 34 C68 12, 114 52, 176 31 S292 15, 412 37" />
        </svg>
        <button className="open-button" type="button" onClick={openPortfolio} aria-label="Open portfolio">
          <img src={asset('butterfly.png')} alt="" />
          <span>Open here</span>
        </button>
      </div>
    </main>
  );
}
