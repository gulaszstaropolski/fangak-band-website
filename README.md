# FANGAK Band Website

An English-language, responsive band website built with Next.js and Strapi. It includes pages for the band, music, releases, performance photos, tour dates, contact, and store links. Music can be embedded from Bandcamp, SoundCloud, and Spotify, with direct links to major streaming platforms.

## Requirements

- Node.js 22 LTS and npm
- Docker and Docker Compose (optional)

## Run locally

1. Install dependencies in both applications:

   ```sh
   cd cms && npm install
   cd ../frontend && npm install
   ```

2. Configure Strapi:

   ```sh
   cd cms
   cp .env.example .env
   ```

   Replace every `replace-with-...` value in `cms/.env` with a unique, randomly generated secret. Start the CMS with `npm run develop`, then create the first administrator at <http://localhost:1337/admin>.

3. Create content types in Strapi and publish entries for them to appear on the website. The CMS exposes unauthenticated, read-only `GET` endpoints for published content; editing still requires the Strapi admin account.

4. Configure and start the frontend:

   ```sh
   cd ../frontend
   cp .env.example .env.local
   npm run dev
   ```

   Open <http://localhost:3000>. The frontend can also run without Strapi; it displays starter copy and empty states until content is published.

## Managing content

Use the Strapi admin panel to add a **Band info** entry, tracks, releases, gallery photos, events, and team members. Mark one track as featured to select it for the home page. For embedded players, paste the provider's HTTPS embed URL into the corresponding `...EmbedUrl` field. Only Bandcamp, SoundCloud, and Spotify hosts are allowed in player embeds.

`streamingLinks` and `socialLinks` are JSON arrays in this format:

```json
[
  { "platform": "Spotify", "url": "https://open.spotify.com/artist/..." },
  { "platform": "Apple Music", "url": "https://music.apple.com/..." }
]
```

Supported platform labels include Bandcamp, SoundCloud, Spotify, Apple Music, YouTube Music, Tidal, Amazon Music, and Deezer. The shop page uses the same links, so add store URLs there too. Direct track links, ticket links, and streaming links must use HTTPS.

## Contact form

The contact form sends messages through SMTP. Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`, and `CONTACT_TO` in `frontend/.env.local` (or the production environment). Without SMTP settings the site remains usable and the form explains that sending is not configured. Never commit real credentials.

## Production build

```sh
cd frontend
npm run lint
npm run build
npm run start
```

For Strapi, configure production secrets and a production database, then run `npm run build` and `npm run start` from `cms`. SQLite is provided for local use; use PostgreSQL for a multi-process or production deployment by setting `DATABASE_CLIENT=postgres` and the `DATABASE_URL` (or `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USERNAME`, and `DATABASE_PASSWORD`) variables. Set `DATABASE_SSL=true` when required by the provider.

### Docker Compose

Copy `.env.example` to `.env`, generate strong CMS secrets (for example, `openssl rand -base64 32` for each secret), and fill in the values before starting. Set `NEXT_PUBLIC_SITE_URL` to the public HTTPS URL for production:

```sh
docker compose up --build -d
```

The website is served on port 3000 and the Strapi admin on port 1337. SQLite data and uploaded media are stored in named Docker volumes. Set the SMTP variables in `.env` to enable contact mail. Back up the CMS database and uploads volume.

### Node.js server with PM2

Build both applications, configure their environment variables in the server's process environment, then start them from the repository root:

```sh
cd frontend && npm ci && npm run build
cd ../cms && npm ci && npm run build
cd ..
npm install --global pm2
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

Configure the reverse proxy and domain to send the public web hostname to port 3000 and the CMS/admin hostname to port 1337. Use HTTPS, restrict public access to the CMS admin, and use persistent storage for uploads and the database.

## Project structure

- `frontend/` — Next.js website, CMS client, and SMTP contact endpoint
- `cms/` — Strapi CMS and content-type definitions
- `docker-compose.yml` — local/production container setup
- `ecosystem.config.cjs` — PM2 process configuration
