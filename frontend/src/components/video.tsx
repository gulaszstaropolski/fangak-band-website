import { VideoPlayer } from "@/components/video-player";
import type { Video } from "@/lib/content";

function youtubeId(value?: string): string | undefined {
  if (!value) return undefined;
  if (/^[A-Za-z0-9_-]{11}$/.test(value)) return value;
  const embedSource = value.match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1] ?? value;
  try {
    const url = new URL(embedSource);
    if (url.protocol !== "https:") return undefined;
    const host = url.hostname.toLowerCase();
    let id: string | undefined;
    if (host === "youtu.be") {
      id = url.pathname.split("/").filter(Boolean)[0];
    } else if (
      ["youtube.com", "www.youtube.com", "m.youtube.com", "youtube-nocookie.com", "www.youtube-nocookie.com"].includes(host)
    ) {
      id = url.searchParams.get("v") ?? url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1];
    }
    return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : undefined;
  } catch {
    return undefined;
  }
}

export function VideoCard({ video }: { video: Video }) {
  const embedId = youtubeId(video.youtubeUrl) ?? youtubeId(video.youtubeEmbedCode);
  const watchUrl = embedId ? `https://www.youtube.com/watch?v=${embedId}` : undefined;
  return (
    <article className="video-card">
      {embedId ? (
        <VideoPlayer
          videoId={embedId}
          title={video.title}
          thumbnail={video.thumbnail || `https://img.youtube.com/vi/${embedId}/hqdefault.jpg`}
        />
      ) : watchUrl ? (
        <a className="video-fallback" href={watchUrl} target="_blank" rel="noreferrer">
          Watch {video.title} on YouTube ↗
        </a>
      ) : null}
      <div>
        {video.releaseDate && <p className="eyebrow">{new Date(video.releaseDate).getUTCFullYear()}</p>}
        <h2>{video.title}</h2>
        {video.description && <p>{video.description}</p>}
      </div>
    </article>
  );
}
