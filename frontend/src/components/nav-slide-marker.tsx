"use client";

import { useEffect, useRef, useState } from "react";

export const HERO_NAV_EVENT = "hero-slide-change";

declare global {
  interface Window {
    __heroNavHref?: string;
  }
}

function internalPath(value?: string): string | undefined {
  if (!value) return undefined;
  const path = value.startsWith("/") && !value.startsWith("//") ? value : undefined;
  if (!path) return undefined;
  const clean = path.split(/[?#]/)[0].replace(/\/+$/, "");
  return clean || "/";
}

/** Moving highlight square behind the nav item matching the current hero slide's destination. */
export function NavSlideMarker({ hrefs }: { hrefs: string[] }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [box, setBox] = useState<{ left: number; width: number; top: number; height: number } | null>(null);

  useEffect(() => {
    const nav = ref.current?.parentElement;
    if (!nav) return;
    const update = (target?: string) => {
      const path = internalPath(target);
      const link = path && hrefs.includes(path)
        ? Array.from(nav.querySelectorAll<HTMLAnchorElement>("a[data-nav-href]")).find((a) => a.dataset.navHref === path)
        : undefined;
      if (!link) {
        setBox(null);
        return;
      }
      setBox({ left: link.offsetLeft, width: link.offsetWidth, top: link.offsetTop, height: link.offsetHeight });
    };
    const onChange = (event: Event) => update((event as CustomEvent<string | undefined>).detail);
    const onResize = () => update(window.__heroNavHref);
    update(window.__heroNavHref);
    window.addEventListener(HERO_NAV_EVENT, onChange);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener(HERO_NAV_EVENT, onChange);
      window.removeEventListener("resize", onResize);
    };
  }, [hrefs]);

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={`nav-marker${box ? " is-visible" : ""}`}
      style={box ? { transform: `translate(${box.left}px, ${box.top}px)`, width: box.width, height: box.height } : undefined}
    />
  );
}
