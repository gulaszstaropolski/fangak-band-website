import Image from "next/image";
import type { Music, StreamingLink, Track } from "@/lib/content";

const knownPlatforms = [
  "Bandcamp",
  "SoundCloud",
  "Spotify",
  "Apple Music",
  "YouTube Music",
  "Tidal",
  "Amazon Music",
  "Deezer",
];

const allowedEmbedHosts = [
  "bandcamp.com",
  "soundcloud.com",
  "spotify.com",
];

export function safeExternalUrl(value?: string): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function safeEmbedUrl(value?: string): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    if (
      url.protocol === "https:" &&
      allowedEmbedHosts.some(
        (host) => url.hostname === host || url.hostname.endsWith(`.${host}`),
      )
    ) {
      return url.toString();
    }
  } catch {
    return undefined;
  }
  return undefined;
}

export function StreamingLinks({ links = [] }: { links?: StreamingLink[] }) {
  const available = links
    .map((link) => ({ ...link, url: safeExternalUrl(link.url) }))
    .filter((link): link is StreamingLink => Boolean(link.platform && link.url));
  return (
    <div className="platform-links">
      {knownPlatforms.map((platform) => {
        const link = available.find(
          (item) => item.platform.toLowerCase() === platform.toLowerCase(),
        );
        return link ? (
          <a key={platform} href={link.url} target="_blank" rel="noreferrer">
            {platform} <span aria-hidden="true">↗</span>
          </a>
        ) : null;
      })}
      {available
        .filter((link) => !knownPlatforms.some((platform) => platform.toLowerCase() === link.platform.toLowerCase()))
        .map((link) => (
          <a key={`${link.platform}-${link.url}`} href={link.url} target="_blank" rel="noreferrer">
            {link.platform} <span aria-hidden="true">↗</span>
          </a>
        ))}
    </div>
  );
}

export function MusicCard({ music }: { music: Music }) {
  const bandcampUrl = safeExternalUrl(music.bandcampUrl);
  const soundcloudUrl = safeExternalUrl(music.soundcloudUrl);
  const bandcampPlayerUrl = bandcampEmbedUrl(bandcampUrl);
  const soundcloudPlayerUrl = soundcloudWidgetUrl(soundcloudUrl);
  return (
    <article className="music-entry">
      <p className="eyebrow">Music</p>
      <h2>{music.title}</h2>
      {music.artist && <p className="eyebrow">{music.artist}</p>}
      {music.cover && <Image src={music.cover} alt={`${music.title} cover`} width={240} height={240} className="music-cover" />}
      {music.releaseDate && <p className="eyebrow">{new Date(music.releaseDate).getUTCFullYear()}</p>}
      {music.description && <p>{music.description}</p>}
      <div className="track-platforms">
        {bandcampUrl && <a href={bandcampUrl} target="_blank" rel="noreferrer">Bandcamp ↗</a>}
        {soundcloudUrl && <a href={soundcloudUrl} target="_blank" rel="noreferrer">SoundCloud ↗</a>}
      </div>
      {bandcampPlayerUrl && <MusicEmbed src={bandcampPlayerUrl} title={`${music.title} on Bandcamp`} />}
      {soundcloudPlayerUrl && <MusicEmbed src={soundcloudPlayerUrl} title={`${music.title} on SoundCloud`} />}
    </article>
  );
}

function bandcampEmbedUrl(value?: string): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" &&
      (url.hostname === "bandcamp.com" || url.hostname.endsWith(".bandcamp.com")) &&
      url.pathname.startsWith("/EmbeddedPlayer/")
      ? url.toString()
      : undefined;
  } catch {
    return undefined;
  }
}

function soundcloudWidgetUrl(value?: string): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || (url.hostname !== "soundcloud.com" && !url.hostname.endsWith(".soundcloud.com"))) {
      return undefined;
    }
    return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url.toString())}`;
  } catch {
    return undefined;
  }
}

function MusicEmbed({ src, title }: { src?: string; title: string }) {
  const safeSrc = safeEmbedUrl(src);
  return safeSrc ? (
    <iframe
      className="music-embed"
      src={safeSrc}
      title={title}
      loading="lazy"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      sandbox="allow-scripts allow-same-origin allow-presentation"
    />
  ) : null;
}

export function TrackCard({ track }: { track: Track }) {
  const bandcampUrl = safeExternalUrl(track.bandcampUrl);
  const soundcloudUrl = safeExternalUrl(track.soundcloudUrl);
  const spotifyUrl = safeExternalUrl(track.spotifyUrl);
  return (
    <article className="track-card">
      <div className="track-artwork">
        {track.artwork ? (
          <Image src={track.artwork} alt={`${track.title} artwork`} fill sizes="(max-width: 700px) 100vw, 40vw" />
        ) : (
          <span aria-hidden="true">F.</span>
        )}
      </div>
      <div className="track-copy">
        <p className="eyebrow">Track</p>
        <h3>{track.title}</h3>
        {track.description && <p>{track.description}</p>}
        <div className="track-platforms">
          {bandcampUrl && <a href={bandcampUrl} target="_blank" rel="noreferrer">Bandcamp ↗</a>}
          {soundcloudUrl && <a href={soundcloudUrl} target="_blank" rel="noreferrer">SoundCloud ↗</a>}
          {spotifyUrl && <a href={spotifyUrl} target="_blank" rel="noreferrer">Spotify ↗</a>}
        </div>
        <StreamingLinks links={track.streamingLinks} />
        <MusicEmbed src={track.bandcampEmbedUrl} title={`${track.title} on Bandcamp`} />
        <MusicEmbed src={track.soundcloudEmbedUrl} title={`${track.title} on SoundCloud`} />
        <MusicEmbed src={track.spotifyEmbedUrl} title={`${track.title} on Spotify`} />
      </div>
    </article>
  );
}
