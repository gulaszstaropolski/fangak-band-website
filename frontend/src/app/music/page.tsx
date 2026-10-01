import Image from "next/image";
import { MusicCard, safeExternalUrl, StreamingLinks, TrackCard } from "@/components/music";
import { PageIntro, SiteFooter, SiteHeader } from "@/components/site-layout";
import { getBand, getMusic, getReleases, getTracks } from "@/lib/content";

export const metadata = { title: "Music" };
export const revalidate = 60;

export default async function MusicPage() {
  const [band, music, tracks, releases] = await Promise.all([getBand(), getMusic(), getTracks(), getReleases()]);
  return (
    <>
      <SiteHeader name={band.name || "FANGAK"} logoText={band.logoText} logoImage={band.logoImage} />
      <main className="inner-page">
        <PageIntro eyebrow="Listen close" title="Music for the moment." copy="Find our latest tracks and releases. Listen on your favorite platform, or settle in with an embedded player." />
        <section className="music-list">
          {music.map((item) => <MusicCard key={`music-${item.id}`} music={item} />)}
          {tracks.length ? tracks.map((track) => <TrackCard key={track.id} track={track} />) : (
            music.length === 0 && <div className="empty-state"><span className="empty-record" aria-hidden="true">F.</span><h2>New music is on the way.</h2><p>Check back soon for tracks, embeds and links to listen everywhere.</p></div>
          )}
        </section>
        {releases.length > 0 && <section className="section-wrap release-section">
          <div className="section-heading"><div><p className="eyebrow">Out in the world</p><h2>Releases.</h2></div></div>
          <div className="release-grid">{releases.map((release) => <article className="release-card" key={release.id}>
            <div className="release-art">{release.artwork ? <Image src={release.artwork} alt={`${release.title} cover`} fill sizes="(max-width: 700px) 100vw, 30vw" /> : <span>F.</span>}</div>
            {release.releaseDate && <p className="eyebrow">{new Date(release.releaseDate).getUTCFullYear()}</p>}
            <h3>{release.title}</h3>
            <div className="track-platforms">{safeExternalUrl(release.bandcampUrl) && <a href={safeExternalUrl(release.bandcampUrl)} target="_blank" rel="noreferrer">Bandcamp ↗</a>}{safeExternalUrl(release.spotifyUrl) && <a href={safeExternalUrl(release.spotifyUrl)} target="_blank" rel="noreferrer">Spotify ↗</a>}</div>
            <StreamingLinks links={release.streamingLinks} />
          </article>)}</div>
        </section>}
        <section className="home-streaming music-platform-section">
          <p className="eyebrow">All the places to listen</p><h2>Pick your player.</h2>
          <StreamingLinks links={band.streamingLinks} />
        </section>
      </main>
      <SiteFooter name={band.name || "FANGAK"} />
    </>
  );
}
