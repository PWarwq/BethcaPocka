import Link from "next/link";

/**
 * The copyright year changes once a year, so it is prerendered and cached
 * rather than read from the clock on every render. With Cache Components
 * enabled, an uncached `new Date()` is an unstable value and fails the build.
 */
async function getCopyrightYear() {
  "use cache";
  return new Date().getFullYear();
}

const COLUMNS = [
  {
    title: "Play",
    links: [
      { href: "/tables", label: "All tables" },
      { href: "/tables?stakes=low", label: "Low stakes" },
      { href: "/tables?stakes=high", label: "High stakes" },
    ],
  },
  {
    title: "Learn",
    links: [
      { href: "/rules", label: "How hold'em works" },
      { href: "/rules#odds", label: "Hand rankings" },
      { href: "/leaderboard", label: "Leaderboard" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/sign-in", label: "Sign in" },
      { href: "/sign-up", label: "Create an account" },
      { href: "/admin", label: "Admin" },
    ],
  },
];

export async function SiteFooter() {
  const year = await getCopyrightYear();

  return (
    <footer className="mt-auto border-t border-brass-700/25 bg-baize-950">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div>
            <p className="flex items-center gap-2 font-display text-[1.1rem] font-semibold text-bone-50">
              <span aria-hidden="true" className="text-brass-500">
                &#9830;
              </span>
              BetchaPokah
            </p>
            <p className="mt-3 max-w-[34ch] text-[0.88rem] leading-relaxed text-bone-400">
              Chips are for play. No deposits, no withdrawals, no real money ever changes hands.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-[0.8rem] font-medium text-bone-200">{col.title}</h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-[0.88rem] text-bone-400 transition-colors hover:text-brass-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="rail-top mt-12 flex flex-wrap items-center justify-between gap-4 pt-6 text-[0.8rem] text-bone-400">
          <p>&copy; {year} BetchaPokah. Play money only.</p>
          <p className="tabular">18+ &middot; Not a gambling service</p>
        </div>
      </div>
    </footer>
  );
}