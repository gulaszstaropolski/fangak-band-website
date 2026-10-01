export type StreamingLink = {
  platform: string;
  url: string;
};

export type Band = {
  name: string;
  tagline?: string;
  bio?: string;
  heroImage?: string;
  socialLinks?: StreamingLink[];
  streamingLinks?: StreamingLink[];
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
    };
  } catch {
    return { name: "FANGAK", tagline: "Independent music, made to move you." };
  }
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
