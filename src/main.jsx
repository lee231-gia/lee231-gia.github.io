import { createRoot } from 'react-dom/client';
import App from './App';
import { MusicPlayer } from './components/MusicPlayer';
import '../css/base.css';
import '../css/cover.css';
import '../css/home.css';
import '../css/about.css';
import '../css/works.css';
import '../css/achievements.css';
import '../css/contact.css';
import '../css/budget.css';

createRoot(document.getElementById('root')).render(
  <MusicPlayer>
    <App />
  </MusicPlayer>,
);
