// SiteHeader — sticky top header. Adapts colors when displayed over a project page.
function SiteHeader({ route, onNavigate, pageBg, pageFg }) {
  const onColor = !!pageBg;
  const headerStyle = onColor ? { "--page-bg": pageBg, "--page-fg": pageFg } : {};
  const isActive = (r) => route.name === r || route.name.startsWith(r + "/");

  const items = [
    { id: "home", label: "WORK" },
    { id: "blog", label: "BLOG" },
    { id: "about", label: "ABOUT" },
  ];

  return (
    <header className="site-header" style={headerStyle} data-on-color={onColor ? "true" : "false"}>
      <a className="wm" href="#" onClick={(e) => { e.preventDefault(); onNavigate({ name: "home" }); }}>
        BXRS.ART
      </a>
      <nav>
        {items.map((it) => (
          <a key={it.id} href="#" className={isActive(it.id) ? "active" : ""}
            onClick={(e) => { e.preventDefault(); onNavigate({ name: it.id }); }}>
            {it.label}
          </a>
        ))}
      </nav>
    </header>
  );
}

Object.assign(window, { SiteHeader });
