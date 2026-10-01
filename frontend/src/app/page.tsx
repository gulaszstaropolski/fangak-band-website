import Image from "next/image";
import Link from "next/link";
import { safeExternalUrl, StreamingLinks, TrackCard } from "@/components/music";
import { SiteFooter, SiteHeader } from "@/components/site-layout";
import { getBand, getUpcomingEvents, getTracks } from "@/lib/content";

export const metadata = {
  title: "FANGAK — Independent music",
  description: "Discover music, stories and upcoming live shows from FANGAK.",
};
export const revalidate = 60;

export default async function Home() {
  const [band, tracks, events] = await Promise.all([getBand(), getTracks(), getUpcomingEvents()]);
  const featured = tracks.find((track) => track.featured) ?? tracks[0];
  const nextEvent = events[0];
  const ticketUrl = safeExternalUrl(nextEvent?.ticketUrl);

  return (
    <>
      <SiteHeader name={band.name || "FANGAK"} />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MusicGroup",
              name: band.name || "FANGAK",
              description: band.bio || band.tagline,
              url: process.env.NEXT_PUBLIC_SITE_URL,
              sameAs: band.socialLinks?.map((link) => safeExternalUrl(link.url)).filter(Boolean),
            }).replace(/</g, "\\u003c"),
          }}
        />
        <section className="hero">
          <div className="hero-texture" aria-hidden="true" />
          <div className="hero-content">
            <p className="eyebrow">Independent band · Est. in sound</p>
            <h1>{band.name || "FANGAK"}</h1>
            <p className="hero-tagline">{band.tagline || "Independent music, made to move you."}</p>
            <div className="hero-actions">
              <Link className="button button-light" href="/music">Explore the music <span>↗</span></Link>
              <Link className="text-link" href="/events">Find us live <span>↗</span></Link>
            </div>
          </div>
          <div className="hero-sticker" aria-hidden="true"><span>TURN IT</span><strong>UP!</strong></div>
          {band.heroImage && (
            <Image src={band.heroImage} alt={`${band.name} performing`} fill priority className="hero-photo" sizes="100vw" />
          )}
          <span className="hero-index">01 / SOUND IN MOTION</span>
        </section>

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
            <p>{band.bio || "A band, a shared love of sound, and a story still being written. Get to know the people and ideas behind the music."}</p>
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
      </main>
      <SiteFooter name={band.name || "FANGAK"} />
    </>
  );
}
