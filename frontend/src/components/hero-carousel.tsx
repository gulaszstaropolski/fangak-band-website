"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { HeroSlide } from "@/lib/content";
import { CMSLink } from "@/components/cms-link";
import { HERO_NAV_EVENT } from "@/components/nav-slide-marker";

const INTERVAL_MS = 7000;

export function HeroCarousel({ slides, label = "Featured" }: { slides: HeroSlide[]; label?: string }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const count = slides.length;
  const current = slides[Math.min(index, count - 1)];
  const multiple = count > 1;
  const rotating = multiple && !paused && !reducedMotion;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!rotating) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % count), INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [rotating, count, index]);

  const currentUrl = current?.ctaUrl;
  useEffect(() => {
    window.__heroNavHref = currentUrl;
    window.dispatchEvent(new CustomEvent(HERO_NAV_EVENT, { detail: currentUrl }));
    return () => {
      window.__heroNavHref = undefined;
      window.dispatchEvent(new CustomEvent(HERO_NAV_EVENT, { detail: undefined }));
    };
  }, [currentUrl]);

  if (!current) return null;
  const go = (next: number) => setIndex((next + count) % count);

  return (
    <section
      className="hero hero-carousel"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
    >
      <div className="hero-slide-media" aria-hidden="true">
        {slides.map((slide, slideIndex) => {
          const distance = Math.min((slideIndex - index + count) % count, (index - slideIndex + count) % count);
          if (!slide.image || distance > 1) return null;
          return (
            <Image
              key={slide.id ?? slideIndex}
              src={slide.image}
              alt=""
              fill
              priority={slideIndex === 0}
              sizes="100vw"
              className={`hero-photo hero-slide-image${slideIndex === index ? " is-active" : ""}`}
            />
          );
        })}
      </div>
      <div className="hero-texture" aria-hidden="true" />
      <div
        className="hero-content hero-slide-content"
        role="group"
        aria-roledescription="slide"
        aria-label={`${index + 1} of ${count}`}
        aria-live={rotating ? "off" : "polite"}
      >
        <div className="hero-slide-text">
          {current.heading && <h1>{current.heading}</h1>}
          {current.description && <p className="hero-tagline">{current.description}</p>}
        </div>
        <div className="hero-actions hero-slide-cta">
          {current.ctaLabel && current.ctaUrl && (
            <CMSLink className="button button-light" label={current.ctaLabel} href={current.ctaUrl} />
          )}
        </div>
      </div>
      {multiple && (
        <ul className="hero-dots" aria-label="Slides">
          {slides.map((slide, slideIndex) => (
            <li key={slide.id ?? slideIndex}>
              <button
                type="button"
                onClick={() => go(slideIndex)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                    event.preventDefault();
                    const next = (slideIndex + (event.key === "ArrowRight" ? 1 : -1) + count) % count;
                    go(next);
                    (event.currentTarget.closest("ul")?.querySelectorAll("button")[next] as HTMLElement | undefined)?.focus();
                  }
                }}
                aria-label={`Go to slide ${slideIndex + 1}${slide.heading ? `: ${slide.heading}` : ""}`}
                aria-current={slideIndex === index ? "true" : undefined}
                className={slideIndex === index ? "is-active" : undefined}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
