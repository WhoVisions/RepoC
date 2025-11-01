import { useState } from 'react'

const highlights = [
  {
    title: 'Adaptive layout',
    description:
      'Responsive columns gracefully cascade on smaller screens so key details remain scannable.',
  },
  {
    title: 'High contrast palette',
    description:
      'Dark text on a soft surface background preserves a AAA contrast ratio for readability.',
  },
  {
    title: 'Keyboard friendly',
    description:
      'Focus rings are pronounced and consistent for accessible navigation across devices.',
  },
]

function EditorShowcase() {
  const [previewEdits, setPreviewEdits] = useState(3)

  return (
    <section className="flex w-full flex-1 justify-center bg-gradient-to-b from-white via-brand-surface to-white">
      <div className="flex w-full max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-3 text-left sm:text-center">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-border bg-white px-4 py-1 text-xs font-semibold uppercase tracking-wide text-brand-primary sm:self-center">
            Editing suite
          </span>
          <h1 className="text-3xl font-semibold text-brand-primary sm:text-4xl lg:text-5xl">
            Craft edits that stay organized on every screen
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-neutral-700 sm:mx-auto sm:text-lg">
            Structure revisions, spotlight the next action, and keep your content hierarchy intact from mobile to desktop.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
          <article className="flex flex-col justify-between rounded-3xl border border-brand-border bg-white/90 p-6 shadow-lg shadow-brand-primary/5 backdrop-blur sm:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-brand-primary lg:text-2xl">
                      Live edit preview
                    </h2>
                    <p className="text-sm text-neutral-600 lg:text-base">
                      Track quick iterations in a focused layout that scales effortlessly.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-brand-primary px-4 py-1 text-sm font-medium text-white shadow-sm">
                    <span className="text-xs uppercase tracking-wide text-brand-surface/80">Edits</span>
                    <span className="text-lg font-semibold">{previewEdits}</span>
                  </span>
                </div>

                <div className="rounded-2xl border border-brand-border/60 bg-brand-surface px-4 py-5 lg:px-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-brand-primary/80">
                        Mobile viewport
                      </span>
                      <h3 className="text-lg font-semibold text-brand-primary">
                        Prioritize the headline
                      </h3>
                      <p className="text-sm leading-relaxed text-neutral-700">
                        Keep calls to action and status chips above the fold so teams can respond instantly.
                      </p>
                    </div>
                    <div className="grid gap-3 rounded-xl bg-white/90 p-4 shadow-inner shadow-brand-primary/5 lg:grid-cols-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs uppercase tracking-wide text-neutral-500">Next task</span>
                        <p className="text-sm font-medium text-brand-primary">Review client feedback summary</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs uppercase tracking-wide text-neutral-500">Owner</span>
                        <p className="text-sm font-medium text-brand-primary">Alex Rivera</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs uppercase tracking-wide text-neutral-500">Due</span>
                        <p className="text-sm font-medium text-brand-primary">Today, 4:30 PM</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs uppercase tracking-wide text-neutral-500">Status</span>
                        <p className="text-sm font-medium text-brand-primary">Needs review</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                className="focus-ring inline-flex items-center justify-center rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-primary/90"
                onClick={() => setPreviewEdits((value) => value + 1)}
              >
                Log quick edit
              </button>
              <p className="text-xs text-neutral-500 sm:text-sm">
                Tap again to simulate revision cycles and stress-test the layout.
              </p>
            </div>
          </article>

          <aside className="flex flex-col gap-6 rounded-3xl border border-brand-border bg-brand-primary/95 p-6 text-brand-surface shadow-xl sm:p-8">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold">Why this layout works</h2>
              <p className="text-sm leading-relaxed text-brand-surface/80">
                Designed to guide decision makers, each breakpoint keeps the hierarchy intact and preserves contrast for quick scanning.
              </p>
            </div>

            <dl className="flex flex-col gap-5">
              {highlights.map((highlight) => (
                <div key={highlight.title} className="flex flex-col gap-1 border-l-4 border-brand-accent/80 pl-4">
                  <dt className="text-sm font-semibold uppercase tracking-wide text-brand-accent/90">
                    {highlight.title}
                  </dt>
                  <dd className="text-sm leading-relaxed text-brand-surface/90">
                    {highlight.description}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="rounded-2xl bg-brand-surface/10 p-4 text-xs text-brand-surface/80 backdrop-blur">
              Tested against WCAG 2.1 contrast ratios to ensure clarity in bright offices and dim war rooms alike.
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

export default EditorShowcase
