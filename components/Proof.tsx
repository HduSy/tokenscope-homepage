// Logo strip below the hero. Source images use simpleicons CDN with the
// tinted hex baked into the URL so the dim look matches both themes.

const logos: { href: string; alt: string }[] = [
  { href: "https://cdn.simpleicons.org/homebrew/8a938d", alt: "Homebrew" },
  { href: "https://cdn.simpleicons.org/github/8a938d", alt: "GitHub" },
  { href: "https://cdn.simpleicons.org/tauri/8a938d", alt: "Tauri" },
  { href: "https://cdn.simpleicons.org/apple/8a938d", alt: "Apple macOS" },
  { href: "https://cdn.simpleicons.org/producthunt/8a938d", alt: "Product Hunt" },
];

export function Proof() {
  return (
    <div className="border-y border-border py-3.5">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-9 px-6">
        {logos.map((l) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={l.alt}
            src={l.href}
            alt={l.alt}
            height={22}
            className="h-[22px] w-auto opacity-80 transition-opacity hover:opacity-100"
          />
        ))}
      </div>
    </div>
  );
}
