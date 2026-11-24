export default function Footer({ note = 'All rights reserved.' }) {
  return (
    <footer className="site-footer">
      <div className="container footer-row">
        <span>© 2026 Lyzel Mae Talisic</span>
        <span>{note}</span>
      </div>
    </footer>
  );
}
