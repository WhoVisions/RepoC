const services = [
  {
    title: "Custom Software Development",
    description:
      "Tailored web and mobile solutions that solve complex business challenges with clean, scalable code.",
  },
  {
    title: "Product Strategy & Discovery",
    description:
      "Partner-led workshops and rapid prototyping to validate ideas before investing in full-scale builds.",
  },
  {
    title: "UX/UI Design Systems",
    description:
      "Delightful, accessible interfaces that align with your brand and keep teams shipping consistently.",
  },
  {
    title: "DevOps & Platform Engineering",
    description:
      "Cloud-native infrastructure, CI/CD pipelines, and observability so your team can deploy with confidence.",
  },
];

const faqs = [
  {
    question: "How do we get started?",
    answer:
      "Schedule a discovery call so we can understand your goals, timeline, and success metrics, then we'll outline the right engagement model.",
  },
  {
    question: "Do you work with in-house teams?",
    answer:
      "Absolutely. We integrate with product, design, and engineering teams to accelerate roadmaps and transfer knowledge as we ship.",
  },
  {
    question: "What industries do you specialize in?",
    answer:
      "We've delivered solutions across SaaS, fintech, health, and e-commerce, focusing on regulated environments that demand quality and speed.",
  },
];

export default function ServicesPage() {
  return (
    <main className="services-page">
      <section className="services-hero" aria-labelledby="services-hero-title">
        <div className="services-hero__content">
          <p className="services-hero__eyebrow">Services</p>
          <h1 id="services-hero-title">Ship outcomes that move your business forward</h1>
          <p className="services-hero__subtitle">
            From idea to launch, we partner with teams that need dependable engineering, thoughtful design, and pragmatic delivery.
          </p>
          <div className="services-hero__actions">
            <a className="button button--primary" href="/contact">
              Book a discovery call
            </a>
            <a className="button button--ghost" href="/case-studies">
              Explore case studies
            </a>
          </div>
        </div>
      </section>

      <section className="services-overview" aria-labelledby="services-overview-title">
        <div className="services-overview__inner">
          <h2 id="services-overview-title">Built for teams shipping critical products</h2>
          <p>
            We bring cross-functional expertise in product, design, and engineering. Every engagement is anchored around measurable outcomes and a clear delivery plan.
          </p>
        </div>
      </section>

      <section className="services-grid" aria-labelledby="services-grid-title">
        <div className="services-grid__heading">
          <h2 id="services-grid-title">What we do</h2>
          <p>Modular services that plug into your roadmap, whether you need a sprint partner or a long-term product team.</p>
        </div>
        <div className="services-grid__items">
          {services.map((service) => (
            <article key={service.title} className="services-grid__item">
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="services-cta" aria-labelledby="services-cta-title">
        <div className="services-cta__inner">
          <h2 id="services-cta-title">Need a team that can execute?</h2>
          <p>
            Let's build the roadmap together. We'll align on outcomes, assemble the right contributors, and guide delivery from the first sprint to launch day.
          </p>
          <div className="services-cta__actions">
            <a className="button button--primary" href="/contact">
              Start a project
            </a>
            <a className="button button--secondary" href="/about">
              Meet the team
            </a>
          </div>
        </div>
      </section>

      <section className="services-faq" aria-labelledby="services-faq-title">
        <div className="services-faq__inner">
          <h2 id="services-faq-title">Frequently asked questions</h2>
          <dl className="services-faq__list">
            {faqs.map((faq) => (
              <div key={faq.question} className="services-faq__item">
                <dt>{faq.question}</dt>
                <dd>{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </main>
  );
}
