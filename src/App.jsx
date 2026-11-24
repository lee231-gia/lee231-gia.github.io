import { useEffect, useState } from 'react';
import CoverPage from './pages/CoverPage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import WorksPage from './pages/WorksPage';
import AchievementsPage from './pages/AchievementsPage';
import ContactPage from './pages/ContactPage';
import BudgetPage from './pages/BudgetPage';

const pages = {
  'home.html': { title: 'Home', component: HomePage },
  'about.html': { title: 'About', component: AboutPage },
  'works.html': { title: 'Works', component: WorksPage },
  'achievements.html': { title: 'Achievements', component: AchievementsPage },
  'contact.html': { title: 'Contact', component: ContactPage },
  'budget.html': { title: 'Budget Tracker', component: BudgetPage },
};

export default function App() {
  const [fileName, setFileName] = useState(() => getCurrentFile());
  const page = pages[fileName];

  useEffect(() => {
    function syncPageWithUrl() {
      setFileName(getCurrentFile());
    }

    function handleInternalNavigation(event) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const anchor = event.target.closest('a[href]');
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return;

      const nextUrl = new URL(anchor.href, window.location.href);
      if (nextUrl.origin !== window.location.origin || !nextUrl.pathname.endsWith('.html')) return;

      if (nextUrl.pathname === window.location.pathname) {
        if (nextUrl.hash !== window.location.hash) return;
        event.preventDefault();
        return;
      }

      event.preventDefault();
      window.history.pushState({}, '', nextUrl);
      syncPageWithUrl();

      if (!nextUrl.hash) window.scrollTo(0, 0);
    }

    document.addEventListener('click', handleInternalNavigation);
    window.addEventListener('popstate', syncPageWithUrl);
    document.title = page
      ? `${page.title} | Lyzel Mae Talisic`
      : 'Lyzel Mae Talisic | Portfolio';

    return () => {
      document.removeEventListener('click', handleInternalNavigation);
      window.removeEventListener('popstate', syncPageWithUrl);
    };
  }, [page]);

  if (!page) return <CoverPage />;

  const PageComponent = page.component;
  return <PageComponent />;
}

function getCurrentFile() {
  return window.location.pathname.split('/').pop().toLowerCase();
}
