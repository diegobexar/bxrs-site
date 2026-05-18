// BlogPost — long-form reading view, serif body, Raygun pull quotes.
function BlogPost({ slug, onNavigate }) {
  const post = window.BXRS_POST_BY_SLUG[slug];
  if (!post) {
    return (
      <div className="blog-post">
        <p>Post not found.</p>
        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate({ name: "blog" }); }}>← All notes</a>
      </div>
    );
  }
  return (
    <div className="blog-post">
      <div className="crumb">
        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate({ name: "blog" }); }}>STUDIO NOTES</a>
        {" / "}{post.title.toUpperCase()}
      </div>
      <div className="eyebrow">{post.eyebrow}</div>
      <h1>{post.title}</h1>
      <div className="post-meta">
        <span><strong>POSTED</strong>{post.date}</span>
        <span><strong>READ</strong>{post.read}</span>
        <span style={{ marginLeft: "auto" }}>↗ SHARE</span>
      </div>
      <div className="prose" dangerouslySetInnerHTML={{ __html: post.body }} />
      <div className="end">×</div>
    </div>
  );
}

Object.assign(window, { BlogPost });
