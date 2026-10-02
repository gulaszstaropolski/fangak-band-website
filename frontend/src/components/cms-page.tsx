import Image from "next/image";
import type { Metadata } from "next";
import type { CMSSection, Page } from "@/lib/content";
import { CMSLink, safeLink } from "@/components/cms-link";
import { SiteFooter, SiteHeader } from "@/components/site-layout";
import { getPage, getSettings } from "@/lib/content";

function paragraphs(value?: string) {
  return value
    ?.split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export async function getPageMetadata(slug: string, fallbackTitle: string): Promise<Metadata> {
  const page = await getPage(slug);
  const description = page?.seoDescription || page?.subheading;
  return {
    title: page?.seoTitle || fallbackTitle,
    ...(description ? { description } : {}),
  };
}

export function CMSSections({ sections = [] }: { sections?: CMSSection[] }) {
  return sections.map((section, index) => {
    if (section.__component === "page.hero") {
      return (
        <section className="hero cms-hero" key={section.id ?? index}>
          {section.backgroundImage && (
            <Image src={section.backgroundImage} alt="" fill priority={index === 0} className="hero-photo" sizes="100vw" />
          )}
          <div className="hero-content">
            <h2>{section.heading}</h2>
            {section.subheading && <p className="hero-tagline">{section.subheading}</p>}
            {section.ctaLabel && section.ctaUrl && (
              <div className="hero-actions"><CMSLink className="button button-light" label={section.ctaLabel} href={section.ctaUrl} /></div>
            )}
          </div>
        </section>
      );
    }
    if (section.__component === "page.gallery") {
      return (
        <div className="gallery-grid" key={section.id ?? index}>
          {section.images?.map((image, imageIndex) => (
            <figure className={`gallery-tile gallery-tile-${imageIndex % 5}`} key={`${image}-${imageIndex}`}>
              <Image src={image} alt="" fill sizes="(max-width: 700px) 100vw, 50vw" />
            </figure>
          ))}
        </div>
      );
    }
    const copy = paragraphs(section.content);
    return (
      <section className="section-wrap cms-content" key={section.id ?? index}>
        {section.heading && <h2>{section.heading}</h2>}
        {copy?.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
      </section>
    );
  });
}

export async function CMSPageView({ page }: { page: Page }) {
  const settings = await getSettings();
  const name = settings.siteName || "FANGAK";
  return (
    <>
      <SiteHeader name={name} />
      <main className="inner-page">
        {page.backgroundImage ? (
          <section className="hero cms-hero">
            <Image src={page.backgroundImage} alt="" fill priority className="hero-photo" sizes="100vw" />
            <div className="hero-content">
              <p className="eyebrow">{page.title}</p>
              <h1>{page.heading || page.title}</h1>
              {page.subheading && <p className="hero-tagline">{page.subheading}</p>}
            </div>
          </section>
        ) : (
          <div className="page-intro">
            <p className="eyebrow">{page.title}</p>
            <h1>{page.heading || page.title}</h1>
            {page.subheading && <p className="intro-copy">{page.subheading}</p>}
          </div>
        )}
        {paragraphs(page.content)?.map((paragraph, index) => <p className="cms-page-content" key={index}>{paragraph}</p>)}
        {page.buttons?.some((button) => button.label && safeLink(button.link)) && (
          <div className="section-wrap hero-actions cms-page-buttons">
            {page.buttons.map((button, index) => <CMSLink key={index} className="button button-dark" label={button.label} href={button.link} />)}
          </div>
        )}
        <CMSSections sections={page.sections} />
      </main>
      <SiteFooter name={name} />
    </>
  );
}

export { CMSLink };
