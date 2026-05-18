// HomeGrid — the tiled mosaic. Tile rendering is delegated to <Tile/>
// which handles four variants based on each project's `tileVariant` field.

function HomeGrid({ onOpenProject }) {
  const [filter, setFilter] = React.useState("ALL");
  const projects = window.BXRS_PROJECTS;
  const filters = ["ALL", "PAINTING", "FILM", "PRINT", "DRAWING"];
  const filtered = filter === "ALL"
    ? projects
    : projects.filter((p) => p.medium.toUpperCase() === filter);

  return (
    <div className="home">
      <div className="intro">
        <h1>SELECTED WORK,<br/>2020 — 2024.</h1>
        <div className="blurb">
          Paintings, prints, and short films.<br/>
          Currently based in Cleveland.
        </div>
      </div>
      <div className="filters" role="tablist">
        <span className="lab">FILTER</span>
        {filters.map((f) => (
          <button key={f} className="chip" aria-pressed={filter === f}
            onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>
      <div className="tile-grid">
        {filtered.map((p, i) => (
          <Tile key={p.slug} project={p} index={i} onOpen={onOpenProject} />
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { HomeGrid });
