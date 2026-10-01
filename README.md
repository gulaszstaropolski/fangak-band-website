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
   npm run env:generate
   ```

   This copies `.env.example` to `.env` and fills in `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `JWT_SECRET`, and `ENCRYPTION_KEY` with freshly generated secrets (the file is never committed, see `.gitignore`). Alternatively, run `cp .env.example .env` and replace every `replace-with-...` value yourself (for example with `openssl rand -base64 32`). Start the CMS with `npm run develop`, then create the first administrator at <http://localhost:1337/admin>.

3. The CMS includes the **Music**, **Stream**, **Video**, **Contact**, **About**, and **Settings** content types, along with the existing tracks, releases, events, gallery, and team types. Add and publish entries in Strapi to show them on the website. Public API routes are read-only; editing still requires the Strapi admin account.

   The **Settings** single type lets you manage the site-wide logo, logo text, background image, heading, subtitle, description, footer text, and primary/secondary colors directly from the Strapi admin panel — no code changes required.

4. Configure and start the frontend:

   ```sh
   cd ../frontend
   cp .env.example .env.local
   npm run dev
   ```

   Open <http://localhost:3000>. The frontend can also run without Strapi; it displays starter copy and empty states until content is published.

## Managing content

Use the Strapi admin panel to add a **Band info** entry, Music and Stream links, YouTube videos, About text, tracks, releases, gallery photos, events, and team members. Band info manages the site name, logo image, logo text, and background image. Contact manages the destination email, form description, and optional configurable form fields. Mark one track as featured to select it for the home page. For embedded players, paste the provider's HTTPS embed URL into the corresponding `...EmbedUrl` field. Only Bandcamp, SoundCloud, and Spotify hosts are allowed in player embeds.

`streamingLinks` and `socialLinks` are JSON arrays in this format:

```json
[
  { "platform": "Spotify", "url": "https://open.spotify.com/artist/..." },
  { "platform": "Apple Music", "url": "https://music.apple.com/..." }
]
```

Supported platform labels include Bandcamp, SoundCloud, Spotify, Apple Music, YouTube Music, Tidal, Amazon Music, and Deezer. The shop page uses the same links, so add store URLs there too. Direct track links, ticket links, and streaming links must use HTTPS.

## Contact form

The contact form sends messages through SMTP. Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, and `SMTP_FROM` in `frontend/.env.local` (or the production environment). The published Contact email is used as the recipient; `CONTACT_TO` remains a fallback if no Contact entry is published. Without SMTP settings the site remains usable and the form explains that sending is not configured. Never commit real credentials.

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
