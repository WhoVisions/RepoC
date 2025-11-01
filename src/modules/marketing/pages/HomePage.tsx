import './HomePage.css'

export function HomePage() {
  return (
    <section className="marketing-home" aria-labelledby="marketing-hero-heading">
      <div className="marketing-home__hero">
        <h2 id="marketing-hero-heading">Capture stories that matter</h2>
        <p>
          RepoC Studio pairs handcrafted photography experiences with effortless
          online booking.
        </p>
        <a className="marketing-home__cta" href="/booking">
          Book a session
        </a>
      </div>
      <div className="marketing-home__highlights">
        <article>
          <h3>Tailored Packages</h3>
          <p>Choose from portraits, product showcases, or bespoke shoots.</p>
        </article>
        <article>
          <h3>Curated Gallery</h3>
          <p>Explore a living showcase updated after every shoot.</p>
        </article>
        <article>
          <h3>Trusted Professionals</h3>
          <p>Our team guides clients from moodboard to final edits.</p>
        </article>
      </div>
    </section>
  )
}
