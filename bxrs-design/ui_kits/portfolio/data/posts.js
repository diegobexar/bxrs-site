// Mock blog posts. Body is plain-ish HTML.
window.BXRS_POSTS = [
  {
    slug: "on-painting-small",
    title: "On Painting Small",
    eyebrow: "STUDIO NOTES · NO. 14",
    date: "14 MAR 2024",
    read: "6 MIN",
    blurb: "A 30×40 canvas fits in a bike pannier. That is the whole argument.",
    body: `
      <p>A 30×40 canvas fits in a bike pannier. <em>That is the whole argument.</em> I started this series in a kitchen in Lisbon and finished it two years later in a basement in Cleveland — twenty-two postcards I never sent.</p>
      <p>The kitchen had a north window and a fridge that hummed. The basement had a south window and a furnace that wheezed. The paintings did not know the difference. They went where I went, dried where I dried, sat in the box for the flight, came out in the new place exactly as they had gone in.</p>
      <blockquote>"SMALL ENOUGH TO HIDE A FACE BEHIND."</blockquote>
      <h2>The math of it</h2>
      <p>A 30×40 painting at $850 retail means the gallery makes $425 and I make $425. A 180×140 painting at $5,500 means the gallery makes $2,750 and I make $2,750, but it also means I cannot leave my apartment for six months. The math is not subtle.</p>
      <figure>
        <div class="img" style="background: linear-gradient(150deg,#A86A4A,#2A1810);"></div>
        <figcaption>FIG. 02 — STUDIO, FEB 2024. NO FLASH. EKTAR 100.</figcaption>
      </figure>
      <h2>The other math</h2>
      <p>If I make one a week for a year, I have fifty-two paintings. If three of them are any good, I have a show. If one of them is great, I have a year. There is no number of large paintings that beats this.</p>
      <p>None of which means I will not paint large again. It only means I will be honest about why.</p>
    `,
  },
  {
    slug: "lisbon-to-cleveland",
    title: "Lisbon to Cleveland",
    eyebrow: "TRAVEL · NO. 08",
    date: "02 FEB 2024",
    read: "9 MIN",
    blurb: "A two-year move broken into eleven flights, two trains, and one customs argument.",
    body: `
      <p>The customs officer in Newark wanted to know why I was traveling with twenty-two paintings. I said they were paintings. He said he could see that. We went back and forth like this for forty minutes.</p>
      <h2>Eleven flights</h2>
      <p>I count the moves the way other people count miles. Lisbon to Madrid. Madrid to Lisbon again because I forgot a passport. Lisbon to Brussels. Brussels to JFK. JFK to Cleveland, three times. Cleveland to JFK once.</p>
      <p>You learn what fits in an overhead. You learn what wraps in a t-shirt. You learn which canvases warp at altitude (the cheap ones) and which do not (the expensive ones — there is no other lesson in the cheap ones).</p>
    `,
  },
  {
    slug: "marvin",
    title: "Marvin",
    eyebrow: "PEOPLE · NO. 03",
    date: "11 NOV 2023",
    read: "12 MIN",
    blurb: "Forty-six years in one basement, three good prints out of every hundred.",
    body: `
      <p>Marvin Kowalczyk has pulled prints in the same basement on Lorain Avenue since 1978. He is seventy-three years old. He works five days a week, eight hours a day. He has never owned a computer.</p>
      <h2>Three good prints out of a hundred</h2>
      <p>"You pull a hundred, you keep three, you throw out ninety-seven. That's the job. People who throw out fewer than ninety-seven are lying about the three."</p>
      <p>I asked Marvin what he was working on. He pointed at a stack of paper about four feet tall. "Same thing as yesterday."</p>
    `,
  },
  {
    slug: "no-flash-handheld-ektar",
    title: "No Flash. Handheld. Ektar 100.",
    eyebrow: "PROCESS · NO. 11",
    date: "21 SEP 2023",
    read: "4 MIN",
    blurb: "Why I document the work on film, even though it is stupid and expensive.",
    body: `
      <p>I document every finished painting on Kodak Ektar 100, with a 1986 Olympus OM-2, with no flash, handheld, on the same roll over weeks. It is the worst possible way to take inventory.</p>
      <p>It is also the only way I will look at the photos.</p>
    `,
  },
];

window.BXRS_POST_BY_SLUG = Object.fromEntries(window.BXRS_POSTS.map(p => [p.slug, p]));
