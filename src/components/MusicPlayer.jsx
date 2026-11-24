import { createContext, useContext, useRef, useState } from 'react';

const MusicContext = createContext(null);

export function useMusicPlayer() {
  return useContext(MusicContext);
}

export function MusicPlayer({ children }) {
  const audioRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState('ready');

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
        setStatus('playing');
      } catch {
        setIsPlaying(false);
        setStatus('track unavailable');
      }
      return;
    }

    audio.pause();
    setIsPlaying(false);
    setStatus('paused');
  }

  async function openAndPlay() {
    setIsOpen(true);
    if (audioRef.current?.paused) await togglePlayback();
  }

  function closePlayer() {
    audioRef.current?.pause();
    setIsOpen(false);
    setIsPlaying(false);
    setStatus('ready');
  }

  const playerControls = {
    isOpen,
    isPlaying,
    openAndPlay,
  };

  return (
    <MusicContext.Provider value={playerControls}>
      {children}
      <aside className={`music-secret ${isOpen ? 'show' : ''}`} aria-live="polite">
        <div className="music-secret-copy">
          <small>Hidden track</small>
          <strong>Light It Up — Moss Kena</strong>
          <span className="music-status">{status}</span>
        </div>
        <div className="music-actions">
          <button className="music-play" type="button" onClick={togglePlayback}>
            {isPlaying ? 'pause' : 'play'}
          </button>
          <button className="music-close" type="button" onClick={closePlayer}>close</button>
        </div>
        <audio
          ref={audioRef}
          preload="metadata"
          src="./music/light-it-up.mp3"
          onEnded={() => {
            setIsPlaying(false);
            setStatus('finished');
          }}
        />
      </aside>
    </MusicContext.Provider>
  );
}
