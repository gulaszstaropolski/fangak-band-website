"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { HeroSlide } from "@/lib/content";
import { CMSLink } from "@/components/cms-link";

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
      {slides.map((slide, slideIndex) =>
        slide.image ? (
          <Image
            key={slide.id ?? slideIndex}
            src={slide.image}
            alt={slideIndex === index ? slide.imageAlt ?? "" : ""}
            aria-hidden={slideIndex !== index}
            fill
            priority={slideIndex === 0}
            sizes="100vw"
            className={`hero-photo hero-slide-image${slideIndex === index ? " is-active" : ""}`}
          />
        ) : null,
      )}
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
        <div className="hero-controls">
          <button type="button" onClick={() => go(index - 1)} aria-label="Previous slide">‹</button>
          <ul className="hero-dots">
            {slides.map((slide, slideIndex) => (
              <li key={slide.id ?? slideIndex}>
                <button
                  type="button"
                  onClick={() => go(slideIndex)}
                  aria-label={`Go to slide ${slideIndex + 1}${slide.heading ? `: ${slide.heading}` : ""}`}
                  aria-current={slideIndex === index ? "true" : undefined}
                  className={slideIndex === index ? "is-active" : undefined}
                />
              </li>
            ))}
          </ul>
          <button type="button" onClick={() => go(index + 1)} aria-label="Next slide">›</button>
          {!reducedMotion && (
            <button
              type="button"
              onClick={() => setPaused((value) => !value)}
              aria-pressed={paused}
              aria-label={paused ? "Start automatic rotation" : "Pause automatic rotation"}
            >
              {paused ? "▶" : "❚❚"}
            </button>
          )}
        </div>
      )}
    </section>
  );
}
