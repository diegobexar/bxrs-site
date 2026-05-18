// AboutPage — bio + stack of facts + contact.
function AboutPage({ onNavigate }) {
  return (
    <div className="about">
      <div>
        <h1>ABOUT.</h1>
        <div className="bio">
          <p>I make paintings, prints, and short films. I work mostly at night, mostly on small things, mostly by myself.</p>
          <p>I have shown work in Lisbon, Brooklyn, Cleveland, and Galway. I have a studio in Cleveland. I answer email within a week.</p>
          <p>If you would like to buy a piece, write to me. If you would like to commission something, write to me twice.</p>
        </div>
        <a className="contact-btn" href="mailto:studio@bxrs.art">WRITE TO ME →</a>
      </div>
      <div>
        <div className="col">
          <h3>BASED IN</h3>
          <div className="stack">
            <div className="row"><span>CITY</span><span>CLEVELAND</span></div>
            <div className="row"><span>STUDIO</span><span>LORAIN AVE.</span></div>
            <div className="row"><span>HOURS</span><span>22:00 – 04:00</span></div>
          </div>
        </div>
        <div className="col" style={{ marginTop: 32 }}>
          <h3>SELECTED PRESS</h3>
          <div className="stack">
            <div className="row"><span>FRIEZE</span><span>2024</span></div>
            <div className="row"><span>APERTURE</span><span>2023</span></div>
            <div className="row"><span>IT'S NICE THAT</span><span>2022</span></div>
            <div className="row"><span>BROOKLYN RAIL</span><span>2021</span></div>
          </div>
        </div>
        <div className="col" style={{ marginTop: 32 }}>
          <h3>REPRESENTATION</h3>
          <div className="stack">
            <div className="row"><span>EU</span><span>GALERIA Z., LISBON</span></div>
            <div className="row"><span>US</span><span>UNREPRESENTED</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AboutPage });
