/*
  Three steps, genuinely sequential — so the numbering here carries real
  information (it is the order a hand happens in) rather than decorating.
*/
const STEPS = [
  {
    n: "01",
    title: "Take a seat",
    body: "Pick a table and claim a seat. You start with free chips — nothing to buy, nothing to deposit.",
  },
  {
    n: "02",
    title: "Play the hand",
    body: "Fold, call, or raise your way through the betting rounds. The clock is on you, so don't think too long.",
  },
  {
    n: "03",
    title: "Collect the pot",
    body: "Wins land in your balance immediately. Losing chips never costs you money, only stack.",
  },
];

export function HowAHandWorks() {
  return (
    <section
      aria-labelledby="hand-heading"
      className="lamp-pool relative border-y border-brass-700/25"
    >
      <div className="felt-weave absolute inset-0 opacity-50" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <h2
          id="hand-heading"
          className="max-w-[24ch] font-display text-[1.9rem] leading-tight tracking-tight text-bone-50"
        >
          A hand takes about four minutes.
        </h2>

        <ol className="mt-10 grid gap-8 sm:grid-cols-3 sm:gap-6">
          {STEPS.map((step) => (
            <li key={step.n} className="rail-top pt-5">
              <span className="tabular font-display text-[0.85rem] text-brass-500">
                {step.n}
              </span>
              <h3 className="mt-2 font-display text-[1.2rem] tracking-tight text-bone-50">
                {step.title}
              </h3>
              <p className="mt-2 max-w-[38ch] text-[0.92rem] leading-relaxed text-bone-300">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}