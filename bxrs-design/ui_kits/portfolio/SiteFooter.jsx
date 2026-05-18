// SiteFooter — giant wordmark and link columns.
function SiteFooter({ onNavigate }) {
  const go = (e, route) => { e.preventDefault(); onNavigate(route); };
  return (
    <footer className="site-footer">
      <div className="wm-big">BXRS.ART</div>
      <div className="grid">
        <div className="col">
          <h4>WORK</h4>
          <ul>
            <li><a href="#" onClick={(e) => go(e, { name: "home" })}>All projects</a></li>
            <li><a href="#" onClick={(e) => go(e, { name: "project/field-recordings" })}>Field Recordings</a></li>
            <li><a href="#" onClick={(e) => go(e, { name: "project/night-shift" })}>Night Shift</a></li>
          </ul>
        </div>
        <div className="col">
          <h4>WRITING</h4>
          <ul>
            <li><a href="#" onClick={(e) => go(e, { name: "blog" })}>Studio Notes</a></li>
            <li><a href="#" onClick={(e) => go(e, { name: "blog/on-painting-small" })}>On Painting Small</a></li>
            <li><a href="#" onClick={(e) => go(e, { name: "blog/marvin" })}>Marvin</a></li>
          </ul>
        </div>
        <div className="col">
          <h4>ELSEWHERE</h4>
          <ul>
            <li><a href="#">Instagram ↗</a></li>
            <li><a href="#">Vimeo ↗</a></li>
            <li><a href="#">Mailing list</a></li>
          </ul>
        </div>
        <div className="col">
          <h4>CONTACT</h4>
          <ul>
            <li><a href="mailto:studio@bxrs.art">studio@bxrs.art</a></li>
            <li><a href="#">Press inquiries</a></li>
            <li><a href="#">Print sales</a></li>
          </ul>
        </div>
      </div>
      <div className="legal">
        <span>© 2024 BXRS · ALL RIGHTS RESERVED</span>
        <span>SITE: HARD CORNERS &amp; PRIMARY COLORS</span>
      </div>
    </footer>
  );
}

Object.assign(window, { SiteFooter });
