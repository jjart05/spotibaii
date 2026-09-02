# Spotibai

Open-source music player you run on your own computer. Upload your MP3s, build playlists, and play them in a dark, Spotify-inspired UI branded as **Spotibai**.

No cloud account is required. Publishing the source code does not remove Upload, and you do not start over — clone or keep this folder, run it, and keep adding songs.

Your audio files and library database stay on **your machine** (they are not committed to git).

## License

MIT — see [LICENSE](LICENSE).

## Features

- Spotify-style shell: sidebar, scrollable main view, persistent player
- Home rails: recently played, recently added, popular, made-for-you
- Search across songs, artists, albums, genres, and playlists
- Library filters and sorting
- Artist, album, song, and playlist pages
- Liked songs with optimistic heart updates
- Upload audio + cover art with progress and validation
- HTML5 audio playback with HTTP Range streaming (206 Partial Content)
- Interactive progress bar (click, drag, touch, hover timestamp)
- Queue, shuffle, repeat off/all/one
- Keyboard shortcuts that ignore text fields
- Responsive desktop, tablet, and mobile layouts with an expanded now-playing view
- SQLite persistence, empty states, skeletons, toasts, and context menus

## Requirements

- Node.js 22 or later (Node 24 recommended; the server uses `node:sqlite`)
- npm 10+

## Installation

```bash
npm install
```

The database file is created automatically at `server/data/spotibai.db` the first time the server starts. No extra migration step is required.

## Development

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

- Client (Vite): `http://localhost:3000`
- API (Express): `http://localhost:3001`
- Vite proxies `/api` and `/uploads` to the API

## Production (local)

```bash
npm start
```

This builds the React app and serves it from Express. Set `PORT` if you need a specific port (default `3001`).

## Deploy on Vercel or Netlify (with your music already there)

Vercel cannot keep new uploads on its own disk. To **publish the songs you already uploaded on your PC**, copy them into the website files, then push.

1. Run the app on your computer and upload your music:

```bash
npm run dev
```

Open http://localhost:3000 → **Upload Music**.

2. Export that library into the site:

```bash
npm run export-library
```

This fills `client/public/library/` with your MP3s, covers, and `catalog.json`.

3. Save and publish:

```bash
git add client/public/library
git commit -m "Add my music library to the site."
git push
```

4. Deploy on Vercel or Netlify from GitHub. The live site will already contain those songs.

Do this again whenever you add new tracks locally. GitHub rejects files over 100 MB.

If you only upload on the live Vercel URL (without export), those files stay in that browser and will not appear for other people.

## Optional: self-host (Fly.io)

Use this only if you want one shared library on a real server disk. Day-to-day and Vercel/Netlify use the options above.

1. Install the [Fly CLI](https://fly.io/docs/flyctl/install/) and create a Fly account.
2. In the project root:

```bash
fly auth login
```

3. Pick a unique app name in `fly.toml` (`app = 'your-name'` — `spotibai` may already be taken).
4. Create the app, a volume for music/data, then deploy:

```bash
fly apps create your-name
fly volumes create spotibai_data --region sin --size 3 -y
fly deploy
```

`fly launch` also works if you let it keep this `fly.toml` and attach a volume at `/data`.

The image serves the UI and API on port **8080**. Uploads and `spotibai.db` live on the volume (`DATA_DIR=/data`) so they survive deploys.

Expect a small monthly cost for the always-on 512 MB VM (needed so playback is not killed by sleep). Scale the volume if you upload a large library.

Open the URL Fly prints, such as `https://your-name.fly.dev`.

## Upload folders

| Path | Contents |
| --- | --- |
| `server/uploads/songs/` | Audio files stored under generated UUID filenames |
| `server/uploads/covers/` | Cover images stored under generated UUID filenames |
| `server/data/spotibai.db` | SQLite database |

Original upload names are never used as stored filenames.

## Supported audio formats

MP3, WAV, OGG, M4A (where the browser can decode the file)

## Supported image formats

JPG, JPEG, PNG, WEBP

## API

All JSON unless noted.

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/home` | Home feed |
| GET | `/api/stats` | Library/storage stats |
| GET | `/api/songs` | List songs (`?sort=recent\|alpha\|artist\|played`) |
| GET | `/api/songs/search?q=` | Search songs, artists, albums, playlists |
| GET | `/api/songs/:id` | Song details |
| DELETE | `/api/songs/:id` | Delete song and files |
| GET | `/api/stream/:songId` | Stream audio with Range support |
| POST | `/api/upload` | Multipart: `audio`, optional `cover`, `title`, `artist`, `album`, `genre` |
| GET | `/api/favorites` | Liked songs |
| POST | `/api/favorites/:songId` | Like |
| DELETE | `/api/favorites/:songId` | Unlike |
| GET | `/api/playlists` | List playlists |
| POST | `/api/playlists` | Create playlist (multipart optional `cover`) |
| GET | `/api/playlists/:id` | Playlist with tracks |
| PUT | `/api/playlists/:id` | Update playlist |
| DELETE | `/api/playlists/:id` | Delete playlist |
| POST | `/api/playlists/:id/songs` | `{ "songId": number }` |
| DELETE | `/api/playlists/:id/songs/:songId` | Remove track |
| PUT | `/api/playlists/:id/reorder` | `{ "songIds": number[] }` |
| GET | `/api/recently-played` | Unique recent tracks |
| POST | `/api/recently-played` | `{ "songId": number }` |
| GET | `/api/artists` | Artists |
| GET | `/api/artists/:name` | Artist page |
| GET | `/api/albums` | Albums |
| GET | `/api/albums/:name` | Album page (`?artist=`) |

## Keyboard shortcuts

| Key | Action |
| --- | --- |
| Space | Play / pause |
| ← / → | Seek 5 seconds |
| M | Mute |
| N | Next |
| P | Previous |

Shortcuts are ignored while typing in inputs.

## Troubleshooting

**`node:sqlite` is not available**  
Use Node 22.13+ or Node 24. The server depends on the built-in SQLite module.

**Port 3000 already in use**  
Stop the other process or change `client/vite.config.js` `server.port`.

**Upload fails / unsupported format**  
Confirm the file extension and MIME type. Audio max size is 80 MB.

**Seeking does not work**  
Playback must go through `/api/stream/:id` so Range requests can return `206 Partial Content`. Do not open raw files from disk in the player.

**Empty library**  
That is expected on first launch. Use **Upload Music** — Spotibai does not ship copyrighted sample tracks.

**Client cannot reach the API**  
In development, start both processes with `npm run dev` from the repo root so the Vite proxy can reach port 3001.

**Fly deploy fails with “app name already taken”**  
Change `app` in `fly.toml` to a unique name and run `fly apps create` with that name.

**Library empty after a Fly deploy**  
The SQLite file and uploads must sit on the `spotibai_data` volume mounted at `/data`. Confirm `DATA_DIR=/data` and that the volume exists in the same region as the machine.
