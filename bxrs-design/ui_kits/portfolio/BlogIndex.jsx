// BlogIndex — list of posts with mono metadata.
function BlogIndex({ onOpenPost }) {
  const posts = window.BXRS_POSTS;
  return (
    <div className="blog-index">
      <h1>STUDIO NOTES.</h1>
      <div className="lede">Writing about painting, printing, filming · one a month or so</div>
      {posts.map((p) => (
        <div key={p.slug} className="post-item" onClick={() => onOpenPost(p)}>
          <div className="post-date">{p.date}</div>
          <div>
            <div className="post-title">{p.title}</div>
            <div className="post-blurb">{p.blurb}</div>
          </div>
          <div className="post-read">{p.read} READ →</div>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { BlogIndex });
