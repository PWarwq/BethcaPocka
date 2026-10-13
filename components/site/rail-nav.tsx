import Link from "next/link";
import { Suspense } from "react";
import { NavAuth } from "@/components/site/nav-auth";

const LINKS = [
  { href: "/tables", label: "Tables" },
  { href: "/rules", label: "Rules" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export function RailNav() {
  return (
    <header className="sticky top-0 z-50 rail-top bg-baize-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-5 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-[1.15rem] font-semibold tracking-tight text-bone-50"
        >
          <span aria-hidden="true" className="text-brass-500">
            &#9830;
          </span>
          BetchaPokah
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 sm:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-[0.3rem] px-3 py-2 text-[0.9rem] text-bone-300 transition-colors hover:bg-bone-100/5 hover:text-bone-50"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/*
          The auth slot streams in behind a boundary — it depends on session
          state, and anything session-dependent must sit inside <Suspense> while
          cacheComponents is enabled.
        */}
        <Suspense fallback={<div className="ml-auto h-9 w-32" />}>
          <NavAuth />
        </Suspense>
      </div>
    </header>
  );
}