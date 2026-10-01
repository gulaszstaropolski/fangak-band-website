import Link from "next/link";
import { safeExternalUrl } from "@/components/music";
import { PageIntro, SiteFooter, SiteHeader } from "@/components/site-layout";
import { getBand, getUpcomingEvents } from "@/lib/content";

export const metadata = { title: "Tour dates" };
export const revalidate = 60;

export default async function EventsPage() {
  const [band, upcoming] = await Promise.all([getBand(), getUpcomingEvents()]);
  return (
    <>
      <SiteHeader name={band.name || "FANGAK"} logoText={band.logoText} logoImage={band.logoImage} />
      <main className="inner-page">
        <PageIntro eyebrow="See you out there" title="On the road." copy="Find us at a venue near you. New dates are added as they’re announced." />
        {upcoming.length ? <div className="events-list">{upcoming.map((event) => <article className="event-row" key={event.id}>
          <time dateTime={event.date}><span>{new Intl.DateTimeFormat("en", { month: "short", timeZone: "UTC" }).format(new Date(event.date))}</span><strong>{new Intl.DateTimeFormat("en", { day: "2-digit", timeZone: "UTC" }).format(new Date(event.date))}</strong></time>
          <div className="event-details"><h2>{event.title}</h2><p>{event.venue} · {event.city}</p></div>
          {safeExternalUrl(event.ticketUrl) ? <a className="button button-dark event-ticket" href={safeExternalUrl(event.ticketUrl)} target="_blank" rel="noreferrer">Tickets ↗</a> : <span className="event-tba">More info soon</span>}
        </article>)}</div> : <div className="empty-state"><span className="event-spark" aria-hidden="true">✳</span><h2>No dates announced just yet.</h2><p>Follow along or get in touch about a show.</p><Link className="text-link" href="/contact">Contact us ↗</Link></div>}
      </main>
      <SiteFooter name={band.name || "FANGAK"} />
    </>
  );
}
