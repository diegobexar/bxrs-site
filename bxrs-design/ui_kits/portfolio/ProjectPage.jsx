// ProjectPage — single project view. Background = project's cardBackgroundColor.
function ProjectPage({ slug, onNavigate }) {
  const project = window.BXRS_PROJECT_BY_SLUG[slug];
  if (!project) {
    return (
      <div className="project">
        <p>Project not found.</p>
        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate({ name: "home" }); }}>← Back to work</a>
      </div>
    );
  }
  const pageStyle = {
    "--page-bg": project.cardBackgroundColor,
    "--page-fg": project.cardTextColor,
    background: project.cardBackgroundColor,
    color: project.cardTextColor,
  };
  // For the "deep" hover/border tone we just stick with currentColor (it inherits)
  const meta = [
    { k: "YEAR", v: project.year },
    { k: "MEDIUM", v: project.medium.toUpperCase() },
    { k: "PIECES", v: project.pieces },
    { k: "LOCATION", v: project.location.toUpperCase() },
  ];

  // Find next/prev for nav
  const all = window.BXRS_PROJECTS;
  const idx = all.findIndex((p) => p.slug === slug);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx < all.length - 1 ? all[idx + 1] : null;

  return (
    <div className="page color-page project" style={pageStyle}>
      <div className="crumb">
        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate({ name: "home" }); }}>WORK</a>
        {" / "}
        {project.title.replace("\n", " ").toUpperCase()}
      </div>
      <h1>{project.title.split("\n").map((line, i) => <span key={i} style={{ display: "block" }}>{line}</span>)}</h1>
      <div className="meta">
        {meta.map((m) => (
          <div key={m.k} className="cell">
            <span className="k">{m.k}</span>
            <span className="v">{m.v}</span>
          </div>
        ))}
      </div>
      <div className="lede" style={{ fontFamily: "var(--font-serif)" }}>{project.lede}</div>
      <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.7, marginBottom: "8px" }}>
        — MATERIALS · {project.materials.toUpperCase()}
      </p>
      <div className="gallery">
        {project.gallery.map((g, i) => (
          <figure key={i} className={`figure col-${g.w}`}>
            {g.kind === "video" ? (
              <div className="video">
                <div className="poster" style={{ background: g.paint }} />
                <button className="play" aria-label="Play video">▶</button>
              </div>
            ) : (
              <div className={`img r-${g.ratio}`} style={{ background: g.paint }} />
            )}
            {g.cap ? <figcaption>{g.cap}</figcaption> : null}
          </figure>
        ))}
      </div>
      <div className="nav-row">
        {prev ? (
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate({ name: `project/${prev.slug}` }); }}>
            ← {prev.title.replace("\n", " ").toUpperCase()}
          </a>
        ) : <span />}
        {next ? (
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate({ name: `project/${next.slug}` }); }}>
            {next.title.replace("\n", " ").toUpperCase()} →
          </a>
        ) : <span />}
      </div>
    </div>
  );
}

Object.assign(window, { ProjectPage });
