import { cache } from "react";
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

export type Settings = {
  siteName?: string;
  siteDescription?: string;
  logo?: string;
  logoText?: string;
  favicon?: string;
  backgroundImage?: string;
  heading?: string;
  subtitle?: string;
  description?: string;
  footerText?: string;
  primaryColor?: string;
  secondaryColor?: string;
  socialLinks?: StreamingLink[];
  contactEmail?: string;
  contactPhone?: string;
};

export type CTA = {
  label: string;
  link: string;
};

export type CMSSection = {
  __component: string;
  id?: number;
  heading?: string;
  subheading?: string;
  content?: string;
  backgroundImage?: string;
  images?: string[];
};

export type HomeContent = {
  logo?: string;
  logoText?: string;
  backgroundImage?: string;
  heading?: string;
  subheading?: string;
  description?: string;
  primaryCTA?: CTA;
  secondaryCTA?: CTA;
  primaryColor?: string;
  secondaryColor?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: string;
  sections?: CMSSection[];
};

export type Page = {
  id: number;
  title: string;
  slug: string;
  backgroundImage?: string;
  heading?: string;
  subheading?: string;
  content?: string;
  seoTitle?: string;
  seoDescription?: string;
  sections?: CMSSection[];
};

export type Music = {
  id: number;
  title: string;
  artist?: string;
  description?: string;
  bandcampUrl?: string;
  soundcloudUrl?: string;
  releaseDate?: string;
  cover?: string;
  order?: number;
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
  releaseDate?: string;
  thumbnail?: string;
  order?: number;
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
  description?: string;
  image?: string;
  date?: string;
  order?: number;
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

const cmsUrl = (
  process.env.STRAPI_URL ??
  (process.env.NODE_ENV === "production" ? undefined : "http://localhost:1337")
)?.replace(/\/$/, "");
const REVALIDATE_SECONDS = 0;

function logCmsError(url: string, reason: unknown) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[cms] Failed to fetch ${url}:`, reason);
  }
}

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

function imageUrls(value: unknown): string[] {
  const media = value && typeof value === "object"
    ? value as { data?: unknown }
    : undefined;
  const items = Array.isArray(value)
    ? value
    : Array.isArray(media?.data)
      ? media.data
      : [];
  return items.map(imageUrl).filter((image): image is string => Boolean(image));
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
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!response.ok) {
      logCmsError(`${cmsUrl}/api/${type}`, `HTTP ${response.status}`);
      return [];
    }
    const json = (await response.json()) as { data?: unknown[] };
    return (json.data ?? []).map((entry) => normalize<T>(entry));
  } catch (error) {
    logCmsError(`${cmsUrl}/api/${type}`, error);
    return [];
  }
}

export async function getBand(): Promise<Band> {
  if (!cmsUrl) return { name: "FANGAK", tagline: "Independent music, made to move you." };
  try {
    const response = await fetch(`${cmsUrl}/api/band-info?populate=*`, {
      next: { revalidate: REVALIDATE_SECONDS },
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

const defaultSettings: Settings = {
  siteDescription: "Official home of FANGAK: music, live dates, photos and more.",
  logoText: "FANGAK",
  heading: "FANGAK",
  subtitle: "Independent music, made to move you.",
  primaryColor: "#f36d3b",
  secondaryColor: "#171715",
};

export const getSettings = cache(async (): Promise<Settings> => {
  if (!cmsUrl) return defaultSettings;
  try {
    const response = await fetch(`${cmsUrl}/api/settings?populate=*`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!response.ok) return defaultSettings;
    const json = (await response.json()) as { data?: unknown };
    if (!json.data) return defaultSettings;
    const settings = normalize<Settings>(json.data);
    return {
      ...defaultSettings,
      ...settings,
      logo: imageUrl((settings as Settings & { logo?: unknown }).logo) ?? defaultSettings.logo,
      favicon: imageUrl((settings as Settings & { favicon?: unknown }).favicon),
      backgroundImage:
        imageUrl((settings as Settings & { backgroundImage?: unknown }).backgroundImage) ??
        defaultSettings.backgroundImage,
    };
  } catch {
    return defaultSettings;
  }
});

export async function getHome(): Promise<HomeContent | undefined> {
  const home = await single<HomeContent>("home");
  if (!home) return undefined;
  return {
    ...home,
    logo: imageUrl((home as HomeContent & { logo?: unknown }).logo),
    backgroundImage: imageUrl((home as HomeContent & { backgroundImage?: unknown }).backgroundImage),
    seoImage: imageUrl((home as HomeContent & { seoImage?: unknown }).seoImage),
    sections: home.sections?.map((section) => ({
      ...section,
      backgroundImage: imageUrl((section as CMSSection & { backgroundImage?: unknown }).backgroundImage),
      images: imageUrls((section as CMSSection & { images?: unknown }).images),
    })),
  };
}

export async function getPage(slug: string): Promise<Page | undefined> {
  const pages = await collection<Page>(
    "pages",
    `filters[slug][$eq]=${encodeURIComponent(slug)}`,
  );
  const page = pages[0];
  if (!page) return undefined;
  return {
    ...page,
    backgroundImage: imageUrl((page as Page & { backgroundImage?: unknown }).backgroundImage),
    sections: page.sections?.map((section) => ({
      ...section,
      backgroundImage: imageUrl((section as CMSSection & { backgroundImage?: unknown }).backgroundImage),
      images: imageUrls((section as CMSSection & { images?: unknown }).images),
    })),
  };
}

export async function getMusic(): Promise<Music[]> {
  const music = await collection<Music>("musics", "sort[0]=order:asc&sort[1]=releaseDate:desc");
  return music.map((item) => ({
    ...item,
    cover: imageUrl((item as Music & { cover?: unknown }).cover),
  }));
}

export async function getStreams(): Promise<Stream[]> {
  return collection<Stream>("streams", "sort=createdAt:asc");
}

export async function getVideos(): Promise<Video[]> {
  const videos = await collection<Video>("videos", "sort[0]=order:asc&sort[1]=releaseDate:desc");
  return videos.map((video) => ({
    ...video,
    thumbnail: imageUrl((video as Video & { thumbnail?: unknown }).thumbnail),
  }));
}

async function single<T>(type: string): Promise<T | undefined> {
  if (!cmsUrl) return undefined;
  try {
    const response = await fetch(`${cmsUrl}/api/${type}?populate=*`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!response.ok) {
      logCmsError(`${cmsUrl}/api/${type}`, `HTTP ${response.status}`);
      return undefined;
    }
    const json = (await response.json()) as { data?: unknown };
    return json.data ? normalize<T>(json.data) : undefined;
  } catch (error) {
    logCmsError(`${cmsUrl}/api/${type}`, error);
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
  const gallery = await collection<GalleryImage>("gallery-images", "sort[0]=order:asc&sort[1]=date:desc");
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
