// App — top-level router. Routes are simple strings:
//   "home" · "blog" · "about" · "project/<slug>" · "blog/<slug>"
function App() {
  const [route, setRoute] = React.useState({ name: "home" });

  // Scroll to top on any route change
  React.useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [route.name]);

  const onNavigate = (r) => setRoute(r);

  // Determine page-level bg/fg for header chrome adaptation
  let pageBg = null, pageFg = null;
  if (route.name.startsWith("project/")) {
    const slug = route.name.split("/")[1];
    const p = window.BXRS_PROJECT_BY_SLUG[slug];
    if (p) { pageBg = p.cardBackgroundColor; pageFg = p.cardTextColor; }
  }

  let view;
  if (route.name === "home") {
    view = <HomeGrid onOpenProject={(p) => onNavigate({ name: `project/${p.slug}` })} />;
  } else if (route.name.startsWith("project/")) {
    view = <ProjectPage slug={route.name.split("/")[1]} onNavigate={onNavigate} />;
  } else if (route.name === "blog") {
    view = <BlogIndex onOpenPost={(p) => onNavigate({ name: `blog/${p.slug}` })} />;
  } else if (route.name.startsWith("blog/")) {
    view = <BlogPost slug={route.name.split("/")[1]} onNavigate={onNavigate} />;
  } else if (route.name === "about") {
    view = <AboutPage onNavigate={onNavigate} />;
  }

  return (
    <React.Fragment>
      <SiteHeader route={route} onNavigate={onNavigate} pageBg={pageBg} pageFg={pageFg} />
      <main className="page">{view}</main>
      <SiteFooter onNavigate={onNavigate} />
    </React.Fragment>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
