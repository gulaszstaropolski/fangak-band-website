import type { ContactFormField } from "@/lib/contact-fields";
export type { ContactFormField } from "@/lib/contact-fields";

export type StreamingLink = {
  platform: string;
  url: string;
};

export type Band = {
  name: string;
  tagline?: string;
  bio?: string;
  heroImage?: string;
  logoImage?: string;
  logoText?: string;
  backgroundImage?: string;
  socialLinks?: StreamingLink[];
  streamingLinks?: StreamingLink[];
};

export type Music = {
  id: number;
  title: string;
  description?: string;
  bandcampUrl?: string;
  soundcloudUrl?: string;
};

export type Stream = {
  id: number;
  title: string;
  description?: string;
  platformName: string;
  platformUrl: string;
};

export type Video = {
  id: number;
  title: string;
  description?: string;
  youtubeUrl: string;
  youtubeEmbedCode?: string;
};

export type Contact = {
  email?: string;
  description?: string;
  formFields?: ContactFormField[];
};

export type About = {
  description?: string;
  historyText?: string;
};

export type Track = {
  id: number;
  title: string;
  slug?: string;
  description?: string;
  artwork?: string;
  featured?: boolean;
  bandcampUrl?: string;
  bandcampEmbedUrl?: string;
  soundcloudUrl?: string;
  soundcloudEmbedUrl?: string;
  spotifyUrl?: string;
  spotifyEmbedUrl?: string;
  streamingLinks?: StreamingLink[];
};

export type Release = {
  id: number;
  title: string;
  releaseDate?: string;
  artwork?: string;
  bandcampUrl?: string;
  spotifyUrl?: string;
  streamingLinks?: StreamingLink[];
};

export type GalleryImage = {
  id: number;
  title: string;
  caption?: string;
  image?: string;
  date?: string;
};

export type Event = {
  id: number;
  title: string;
  date: string;
  venue: string;
  city: string;
  ticketUrl?: string;
};

export type TeamMember = {
  id: number;
  name: string;
  role: string;
  bio?: string;
  photo?: string;
};

const cmsUrl = process.env.STRAPI_URL?.replace(/\/$/, "");

function imageUrl(value: unknown): string | undefined {
  if (!value || typeof value !== "object") return undefined;
  const media = value as { url?: string; data?: unknown; attributes?: { url?: string } };
  const candidate =
    media.url ??
    media.attributes?.url ??
    (media.data && typeof media.data === "object"
      ? (media.data as { url?: string; attributes?: { url?: string } }).url ??
        (media.data as { attributes?: { url?: string } }).attributes?.url
      : undefined);
  if (!candidate) return undefined;
  return candidate.startsWith("/") && cmsUrl
    ? `${new URL(cmsUrl).origin}${candidate}`
    : candidate;
}

function normalize<T>(entry: unknown): T {
  if (!entry || typeof entry !== "object") return entry as T;
  const record = entry as { attributes?: Record<string, unknown> } & Record<string, unknown>;
  return { ...record, ...(record.attributes ?? {}) } as T;
}

async function collection<T>(type: string, query = ""): Promise<T[]> {
  if (!cmsUrl) return [];
  try {
    const response = await fetch(`${cmsUrl}/api/${type}?populate=*&${query}`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) return [];
    const json = (await response.json()) as { data?: unknown[] };
    return (json.data ?? []).map((entry) => normalize<T>(entry));
  } catch {
    return [];
  }
}

export async function getBand(): Promise<Band> {
  if (!cmsUrl) return { name: "FANGAK", tagline: "Independent music, made to move you." };
  try {
    const response = await fetch(`${cmsUrl}/api/band-info?populate=*`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) return { name: "FANGAK", tagline: "Independent music, made to move you." };
    const json = (await response.json()) as { data?: unknown };
    const band = normalize<Band>(json.data);
    return {
      ...band,
      heroImage: imageUrl((band as Band & { heroImage?: unknown }).heroImage),
      logoImage: imageUrl((band as Band & { logoImage?: unknown }).logoImage),
      backgroundImage: imageUrl((band as Band & { backgroundImage?: unknown }).backgroundImage),
    };
  } catch {
    return { name: "FANGAK", tagline: "Independent music, made to move you." };
  }
}

export async function getMusic(): Promise<Music[]> {
  return collection<Music>("musics", "sort=createdAt:desc");
}

export async function getStreams(): Promise<Stream[]> {
  return collection<Stream>("streams", "sort=createdAt:asc");
}

export async function getVideos(): Promise<Video[]> {
  return collection<Video>("videos", "sort=createdAt:desc");
}

async function single<T>(type: string): Promise<T | undefined> {
  if (!cmsUrl) return undefined;
  try {
    const response = await fetch(`${cmsUrl}/api/${type}?populate=*`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) return undefined;
    const json = (await response.json()) as { data?: unknown };
    return json.data ? normalize<T>(json.data) : undefined;
  } catch {
    return undefined;
  }
}

export async function getContact(): Promise<Contact | undefined> {
  return single<Contact>("contact");
}

export async function getAbout(): Promise<About | undefined> {
  return single<About>("about");
}

export async function getTracks(): Promise<Track[]> {
  const tracks = await collection<Track>("tracks", "sort=createdAt:desc");
  return tracks.map((track) => ({
    ...track,
    artwork: imageUrl((track as Track & { artwork?: unknown }).artwork),
  }));
}

export async function getReleases(): Promise<Release[]> {
  const releases = await collection<Release>("releases", "sort=releaseDate:desc");
  return releases.map((release) => ({
    ...release,
    artwork: imageUrl((release as Release & { artwork?: unknown }).artwork),
  }));
}

export async function getGallery(): Promise<GalleryImage[]> {
  const gallery = await collection<GalleryImage>("gallery-images", "sort=date:desc");
  return gallery.map((item) => ({
    ...item,
    image: imageUrl((item as GalleryImage & { image?: unknown }).image),
  }));
}

export async function getEvents(): Promise<Event[]> {
  return collection<Event>("events", "sort=date:asc");
}

export async function getUpcomingEvents(): Promise<Event[]> {
  const events = await getEvents();
  const now = Date.now();
  return events.filter((event) => Number.isFinite(Date.parse(event.date)) && Date.parse(event.date) >= now);
}

export async function getTeam(): Promise<TeamMember[]> {
  const members = await collection<TeamMember>("team-members", "sort=sortOrder:asc");
  return members.map((member) => ({
    ...member,
    photo: imageUrl((member as TeamMember & { photo?: unknown }).photo),
  }));
}
import type { ContactFormField } from "@/lib/contact-fields";
export type { ContactFormField } from "@/lib/contact-fields";
