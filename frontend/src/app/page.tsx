import Link from "next/link";
import type { Metadata } from "next";
import { CMSLink, CMSSections } from "@/components/cms-page";
import { safeExternalUrl, StreamingLinks, TrackCard } from "@/components/music";
import { HeroCarousel } from "@/components/hero-carousel";
import { SiteFooter, SiteHeader } from "@/components/site-layout";
import { getBand, getHome, getSettings, getUpcomingEvents, getTracks } from "@/lib/content";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const home = await getHome();
  return {
    title: home?.seoTitle || "FANGAK — Independent music",
    description: home?.seoDescription || "Discover music, stories and upcoming live shows from FANGAK.",
    ...(home?.seoImage ? { openGraph: { images: [home.seoImage] } } : {}),
  };
}

export default async function Home() {
  const [band, settings, home, tracks, events] = await Promise.all([
    getBand(),
    getSettings(),
    getHome(),
    getTracks(),
    getUpcomingEvents(),
  ]);
  const featured = tracks.find((track) => track.featured) ?? tracks[0];
  const nextEvent = events[0];
  const ticketUrl = safeExternalUrl(nextEvent?.ticketUrl);
  const heading = home?.heading || settings.heading || band.name || "FANGAK";
  const subtitle = home?.subheading || settings.subtitle || band.tagline || "Independent music, made to move you.";
  const description = home?.description || settings.description || band.bio;
  const siteName = settings.siteName || band.name || "FANGAK";
  const heroImage = home?.backgroundImage || band.heroImage;

  return (
    <>
      <SiteHeader
        name={siteName}
        logoText={home?.logoText || settings.logoText || band.logoText}
        logoImage={home?.logo || settings.logo || band.logoImage}
        preferProvidedLogo
      />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MusicGroup",
              name: siteName,
              description: description || band.tagline,
              url: process.env.NEXT_PUBLIC_SITE_URL,
              sameAs: band.socialLinks?.map((link) => safeExternalUrl(link.url)).filter(Boolean),
            }).replace(/</g, "\\u003c"),
          }}
        />
        {home?.slides?.length ? (
          <HeroCarousel slides={home.slides} label={`${siteName} highlights`} />
        ) : (
        <section
          className="hero"
          style={heroImage ? {
            backgroundImage: `url(${JSON.stringify(heroImage)})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          } : undefined}
        >
          <div className="hero-texture" aria-hidden="true" />
          <div className="hero-content">
            {!home && <p className="eyebrow">Independent band · Est. in sound</p>}
            <h1>{heading}</h1>
            <p className="hero-tagline">{subtitle}</p>
            <div className="hero-actions">
              {home?.primaryCTA ? (
                <CMSLink className="button button-light" label={home.primaryCTA.label} href={home.primaryCTA.link} />
              ) : (
                <Link className="button button-light" href="/music">Explore the music <span>↗</span></Link>
              )}
              {home?.secondaryCTA ? (
                <CMSLink className="text-link" label={home.secondaryCTA.label} href={home.secondaryCTA.link} />
              ) : (
                <Link className="text-link" href="/events">Find us live <span>↗</span></Link>
              )}
            </div>
          </div>
          {!home && <div className="hero-sticker" aria-hidden="true"><span>TURN IT</span><strong>UP!</strong></div>}
          {!home && <span className="hero-index">01 / SOUND IN MOTION</span>}
        </section>
        )}

        {home ? (
          <>
            {description && <section className="section-wrap cms-content">{description.split(/\n{2,}/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</section>}
            <CMSSections sections={home.sections} />
          </>
        ) : (
          <>
        <section className="home-feature section-wrap">
          <div className="section-heading">
            <div><p className="eyebrow">The latest</p><h2>Press play.</h2></div>
            <Link className="text-link" href="/music">All music <span>↗</span></Link>
          </div>
          {featured ? (
            <TrackCard track={featured} />
          ) : (
            <div className="empty-feature">
              <div className="record-art" aria-hidden="true"><span>F.</span></div>
              <div><p className="eyebrow">New sounds coming soon</p><h3>Stay close to the music.</h3><p>Add your first track in the CMS to feature it here.</p></div>
              <Link className="text-link" href="/music">Discover the music <span>↗</span></Link>
            </div>
          )}
        </section>

        <section className="home-about">
          <div><p className="eyebrow">A little about us</p><h2>Made together.<br /><em>Felt everywhere.</em></h2></div>
          <div className="home-about-copy">
            <p>{description || "A band, a shared love of sound, and a story still being written. Get to know the people and ideas behind the music."}</p>
            <Link className="button button-dark" href="/about">Meet the band <span>↗</span></Link>
          </div>
        </section>

        <section className="home-tour section-wrap">
          <div className="section-heading">
            <div><p className="eyebrow">Come say hello</p><h2>On the road.</h2></div>
            <Link className="text-link" href="/events">All dates <span>↗</span></Link>
          </div>
          {nextEvent ? (
            <div className="event-row">
              <time dateTime={nextEvent.date}>{new Intl.DateTimeFormat("en", { month: "short", day: "2-digit", timeZone: "UTC" }).format(new Date(nextEvent.date))}</time>
              <span><strong>{nextEvent.title}</strong><small>{nextEvent.venue} · {nextEvent.city}</small></span>
              <span className="event-arrow">{ticketUrl ? <a href={ticketUrl} target="_blank" rel="noreferrer" aria-label="Buy tickets">↗</a> : <Link href="/events" aria-label="All tour dates">↗</Link>}</span>
            </div>
          ) : (
            <div className="tour-empty"><p>We’re between shows right now. Keep an eye out for new dates.</p><Link href="/contact">Get in touch ↗</Link></div>
          )}
        </section>

        <section className="home-streaming">
          <p className="eyebrow">Listen your way</p><h2>Wherever you are.</h2>
          <StreamingLinks links={band.streamingLinks} />
          {!band.streamingLinks?.length && <Link className="text-link" href="/music">Find our music <span>↗</span></Link>}
        </section>
          </>
        )}
      </main>
      <SiteFooter name={siteName} />
    </>
  );
}
