Create a **complete, professional, production-quality music streaming web application called “Spotibai”**.

The goal is to create a music streaming experience **very closely inspired by Spotify’s current desktop and mobile UX**: dark interface, left navigation, home sections, search, library, playlists, album/artist pages, and a persistent bottom music player. The application should feel polished and commercially designed, not like a basic school project.

**IMPORTANT:** Use Spotibai as the original brand. Do not use Spotify's logo, copyrighted artwork, proprietary assets, or exact trademarked branding. Recreate the familiar functionality and overall interaction patterns using original Spotibai branding and UI assets.

---

# 1. TECHNOLOGY

Use:

### Frontend
- React
- Vite
- JavaScript or TypeScript
- Tailwind CSS
- Lucide React icons

### Backend
- Node.js
- Express.js

### Database
- SQLite

### Storage
- Local filesystem

### Audio
- HTML5 Audio API

Use a clean and scalable architecture with reusable components.

---

# 2. PROJECT STRUCTURE

Use a professional structure similar to:

spotibai/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── services/
│   │   ├── utils/
│   │   └── assets/
│   ├── package.json
│   └── ...
│
├── server/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── database/
│   ├── uploads/
│   │   ├── songs/
│   │   └── covers/
│   ├── utils/
│   └── server.js
│
├── package.json
└── README.md

Do NOT put the entire application in one huge file.

---

# 3. OVERALL DESIGN

Make Spotibai look and feel like a premium modern music streaming platform.

### Visual style

- Very dark background
- Black and dark gray surfaces
- Original Spotibai green accent
- White primary text
- Muted gray secondary text
- Large album artwork
- Rounded cards where appropriate
- Subtle gradients
- Professional spacing
- Smooth hover animations
- Clean typography
- Minimal visual clutter
- Strong hierarchy

The interface should closely resemble the **overall experience of Spotify**, while remaining an original Spotibai implementation.

Do not make it look like:
- A generic admin dashboard
- A basic Bootstrap template
- A beginner HTML project

---

# 4. MAIN DESKTOP LAYOUT

Use a Spotify-style three-part application layout:

### LEFT SIDEBAR
Fixed navigation.

### MAIN CONTENT
Scrollable page content.

### BOTTOM MUSIC PLAYER
Persistent fixed player.

Desktop layout:

┌─────────────────────────────────────────────────────────┐
│ Sidebar │              Main Content                     │
│         │                                                │
│ Spotibai│ Home / Search / Library / Playlist            │
│ Home    │                                                │
│ Search  │                                                │
│ Library │                                                │
│         │                                                │
│         │                                                │
├─────────┴────────────────────────────────────────────────┤
│                 GLOBAL MUSIC PLAYER                     │
└─────────────────────────────────────────────────────────┘

The player must stay visible while navigating.

---

# 5. SIDEBAR

Create a professional Spotify-inspired sidebar.

Top:

**SPOTIBAI**

Navigation:

- Home
- Search
- Your Library

Library section:

- Liked Songs
- Recently Played
- Playlists

Bottom:

- Upload Music
- Settings

Use icons.

The active navigation item should be clearly highlighted.

On hover:
- Slight background highlight
- Smooth transition

On mobile:
- Replace the desktop sidebar with a mobile-friendly bottom navigation or collapsible navigation.

---

# 6. HOME PAGE

Create a polished streaming-service homepage.

At the top:

Dynamic greeting:

- Good morning
- Good afternoon
- Good evening

based on the user's current time.

Include sections such as:

### Quick Access

Large horizontal cards:

- Liked Songs
- Recently Played
- Recently Added
- Playlists

### Recently Played

Display recently played songs/albums.

### Recently Added

Show the latest uploaded songs.

### Popular Songs

Display songs sorted by play count.

### Made For You

Generate recommendations from available songs using simple local recommendation logic.

If the database is empty, show a beautiful empty state instead of fake content.

---

# 7. SEARCH PAGE

Create a Spotify-inspired search page.

Large search input:

**What do you want to listen to?**

Search by:

- Song title
- Artist
- Album
- Genre
- Playlist

Search results should update dynamically without a full page reload.

Results can be grouped into:

- Songs
- Artists
- Albums
- Playlists

Clicking a song must immediately play it.

Include:

- Search suggestions
- Loading state
- No results state
- Clear search button

---

# 8. YOUR LIBRARY

Create a professional library page.

Include filters/tabs:

- All
- Songs
- Albums
- Playlists
- Artists
- Liked

Allow sorting by:

- Recently Added
- Recently Played
- Alphabetical
- Artist
- Most Played

Song list should display:

- Cover
- Title
- Artist
- Album
- Date Added
- Duration
- Favorite
- More options

Hovering over a song should reveal a play button.

---

# 9. SONG CARDS

Create reusable song cards.

Each card should include:

- Album artwork
- Song title
- Artist
- Play button

Hover behavior:

- Slight visual elevation
- Play button appears
- Smooth transition

Clicking anywhere appropriate on the song should open/play it.

---

# 10. GLOBAL MUSIC PLAYER

This is one of the most important parts.

Create a **fully functional persistent music player inspired by Spotify's player**.

It must remain visible at the bottom of the application.

### LEFT SIDE

Display:

- Album artwork
- Song title
- Artist
- Heart/favorite button

### CENTER

Controls:

- Previous
- Play/Pause
- Next
- Shuffle
- Repeat

### PROGRESS AREA

Display:

Current time:

`1:24`

Progress bar:

`━━━━━━━━━━━━━━━━━━━━━━`

Total duration:

`3:45`

### RIGHT SIDE

Controls:

- Queue
- Device/output icon placeholder if necessary
- Volume
- Mute

---

# 11. FULLY FUNCTIONAL PROGRESS BAR

The progress bar MUST be real and interactive.

Do NOT create a decorative fake progress bar.

Use:

- HTML5 Audio API
- `audio.currentTime`
- `audio.duration`

Requirements:

- Progress updates continuously
- Click anywhere on the progress bar to seek
- Drag the progress handle
- Touch dragging on mobile
- Show current timestamp
- Show total duration
- Update immediately after seeking
- Reset when switching songs
- Correctly load duration from uploaded files

Example:

If a song is 4:20 and the user clicks at 50%:

`audio.currentTime = audio.duration * 0.5`

The audio must immediately jump to approximately 2:10.

When hovering over the bar:

Show a small timestamp tooltip representing the position under the cursor.

Make the clickable area large enough to be comfortable.

---

# 12. PLAY / PAUSE

Play button must actually control the audio.

When playing:

Show Pause icon.

When paused:

Show Play icon.

The player state must always match the actual HTML5 Audio state.

---

# 13. NEXT / PREVIOUS

Implement fully functional navigation.

### Next

- Play next song in queue
- Update artwork
- Update title
- Update artist
- Reset progress
- Start playback

### Previous

If current song has played more than 3 seconds:

Restart current song.

Otherwise:

Play previous song.

### End of song

Automatically play the next song.

If Repeat One is active:

Replay current song.

If Shuffle is active:

Choose another song from the queue.

---

# 14. SHUFFLE

Implement real shuffle functionality.

Shuffle must affect the playback queue.

Do not simply pick a random song every time without maintaining queue state.

The current song should not immediately repeat unless only one song exists.

---

# 15. REPEAT

Implement:

- Repeat Off
- Repeat All
- Repeat One

Display the correct active icon/state.

---

# 16. QUEUE

Create a queue panel similar to a modern music streaming service.

Display:

**Now Playing**

Then:

**Next Up**

Users can:

- Play queued song
- Remove song
- Reorder songs
- Clear queue
- Add songs to queue

Queue must update instantly.

---

# 17. GLOBAL PLAYER STATE

Use React Context or an equivalent global state system.

The music player must NOT reset when navigating between:

- Home
- Search
- Library
- Playlist
- Album
- Artist

Example:

User starts a song on Home → opens Search → searches → opens Library.

The same song must continue playing.

Only changing the current song or pressing pause should change playback.

---

# 18. CLICKING SONGS

Every song throughout the application must be connected to the global player.

When clicking a song:

1. Set current song.
2. Load audio source.
3. Load artwork.
4. Update title.
5. Update artist.
6. Load duration.
7. Reset progress.
8. Start playback.

This must work from:

- Home
- Search
- Library
- Liked Songs
- Playlists
- Recently Played
- Album pages
- Artist pages
- Search results

---

# 19. AUDIO STREAMING

Implement a proper streaming endpoint:

`GET /api/stream/:songId`

Support:

- HTTP Range requests
- Seeking
- Partial content
- Correct Content-Type
- Content-Length
- 206 Partial Content

This is necessary so the progress bar and seeking work correctly with uploaded music.

---

# 20. UPLOAD MUSIC

Create a professional upload interface.

Use a modal or dedicated upload page.

Title:

**Upload Music**

Fields:

- Song Title
- Artist
- Album
- Genre
- Cover Image
- Audio File

Supported audio:

- MP3
- WAV
- OGG
- M4A where supported

Supported images:

- JPG
- JPEG
- PNG
- WEBP

Allow drag and drop.

Show:

- Selected filename
- File size
- Upload progress
- Validation messages
- Success notification

After upload:

1. Save audio file.
2. Save cover image.
3. Save metadata to SQLite.
4. Calculate/read audio duration.
5. Add song to library.
6. Make it immediately playable.
7. Update Home/Library without unnecessary full-page reload.

---

# 21. UPLOAD SECURITY

Implement:

- MIME validation
- Extension validation
- File-size limits
- Unique generated filenames
- Sanitized metadata
- Path traversal protection
- Corrupted-file handling
- Safe file deletion

Never trust the original uploaded filename.

---

# 22. SONG DETAILS PAGE

Create a professional song detail view.

Display:

- Large artwork
- Song title
- Artist
- Album
- Genre
- Duration
- Date Added
- Play count

Actions:

- Play
- Add to Queue
- Add to Playlist
- Like
- Delete

---

# 23. ARTIST PAGE

Create artist pages.

Display:

- Artist name
- Artist artwork
- Popular songs
- Albums
- All songs

Buttons:

- Play
- Shuffle

Clicking a song plays it.

---

# 24. ALBUM PAGE

Create professional album pages.

Display:

- Large album artwork
- Album name
- Artist
- Genre
- Track count
- Track list

Actions:

- Play Album
- Shuffle
- Add to Library

Track list should show:

- Track number
- Title
- Artist
- Duration
- Like
- More

---

# 25. PLAYLISTS

Allow users to create playlists.

Create Playlist modal:

- Playlist Name
- Description
- Cover Image

Users can:

- Create
- Rename
- Delete
- Add songs
- Remove songs
- Reorder songs
- Play all
- Shuffle

Playlist data must persist in SQLite.

---

# 26. LIKED SONGS

Every song should have a heart button.

States:

♡ Not liked

♥ Liked

Clicking it must immediately update the UI and database.

Liked Songs page should contain:

- Large header
- Liked songs count
- Play All
- Shuffle
- Song list

---

# 27. RECENTLY PLAYED

Whenever a song starts playing, record it.

Store:

- Song ID
- Played timestamp

Display recently played songs.

Avoid creating hundreds of identical entries if the user repeatedly pauses/resumes the same song.

---

# 28. PLAY COUNTS

Track how many times each song is played.

Increment play count when appropriate, such as when playback actually starts.

Use play counts for the Popular Songs section.

---

# 29. DATABASE

Use SQLite.

Tables:

### songs

- id
- title
- artist
- album
- genre
- audio_path
- cover_path
- duration
- play_count
- created_at

### playlists

- id
- name
- description
- cover_path
- created_at

### playlist_songs

- playlist_id
- song_id
- position

### favorites

- id
- song_id
- created_at

### recently_played

- id
- song_id
- played_at

Create indexes where useful.

Automatically initialize the database when the server starts.

---

# 30. API

Implement real REST APIs.

Songs:

GET `/api/songs`

GET `/api/songs/:id`

POST `/api/songs`

DELETE `/api/songs/:id`

GET `/api/songs/search`

Streaming:

GET `/api/stream/:songId`

Favorites:

GET `/api/favorites`

POST `/api/favorites/:songId`

DELETE `/api/favorites/:songId`

Playlists:

GET `/api/playlists`

POST `/api/playlists`

GET `/api/playlists/:id`

PUT `/api/playlists/:id`

DELETE `/api/playlists/:id`

Playlist songs:

POST `/api/playlists/:id/songs`

DELETE `/api/playlists/:id/songs/:songId`

PUT `/api/playlists/:id/reorder`

Recently Played:

GET `/api/recently-played`

POST `/api/recently-played`

Upload:

POST `/api/upload`

---

# 31. RESPONSIVE DESIGN

The application must work properly on:

- 1920×1080
- 1440×900
- 1366×768
- Laptop screens
- Tablets
- iPhone-sized screens
- Android-sized screens

### Desktop

- Full sidebar
- Large content area
- Persistent bottom player

### Tablet

- Compact sidebar
- Responsive grids

### Mobile

Use:

- Bottom navigation
- Compact player
- Full-screen player when expanded
- Mobile queue
- Touch-friendly controls
- Responsive song lists

Do not allow horizontal overflow.

---

# 32. FULL-SCREEN PLAYER

On mobile and optionally desktop, allow the player to expand.

Expanded player should display:

- Large album artwork
- Song title
- Artist
- Heart
- Progress bar
- Current time
- Duration
- Previous
- Play/Pause
- Next
- Shuffle
- Repeat
- Volume where appropriate

Make it feel like a real music streaming application.

---

# 33. MINI PLAYER

When the full player is not expanded:

Display a compact bottom player.

It should remain visible while browsing.

Clicking the mini player opens the expanded player.

---

# 34. KEYBOARD SHORTCUTS

Implement:

Space = Play/Pause

Arrow Left = Seek backward

Arrow Right = Seek forward

M = Mute

N = Next song

P = Previous song

Make sure shortcuts don't interfere with typing in search/input fields.

---

# 35. LOADING STATES

Use skeleton loading components.

Examples:

- Song skeleton
- Album skeleton
- Playlist skeleton
- Home section skeleton

Avoid showing blank content while loading.

---

# 36. EMPTY STATES

Create polished empty states.

Examples:

"No songs uploaded yet."

"No liked songs yet."

"No playlists yet."

"No recently played songs."

"No results found."

Include useful actions where appropriate.

---

# 37. TOAST NOTIFICATIONS

Show professional toast notifications.

Examples:

"Song uploaded successfully."

"Added to Liked Songs."

"Removed from Liked Songs."

"Added to playlist."

"Playlist created."

"Song deleted."

"Upload failed."

---

# 38. CONTEXT MENUS

Song options should include:

- Play
- Add to Queue
- Add to Playlist
- Like / Unlike
- View Album
- View Artist
- Delete

Use a polished dropdown/context menu.

---

# 39. SETTINGS

Create a Settings page.

Sections:

### Appearance
- Dark mode
- Accent settings if appropriate

### Playback
- Autoplay
- Default volume
- Crossfade UI placeholder if actual implementation isn't supported

### Storage

Show:

- Number of songs
- Total storage used
- Number of playlists

---

# 40. ANIMATIONS

Use subtle premium animations.

Examples:

- Card hover
- Play button appearance
- Modal opening
- Toast notifications
- Sidebar transitions
- Player expansion
- Queue opening
- Upload progress
- Page transitions

Keep animations smooth and professional.

Do not overanimate.

---

# 41. ACCESSIBILITY

Implement:

- Keyboard navigation
- ARIA labels
- Focus states
- Accessible buttons
- Proper contrast
- Tooltips for icon-only buttons

---

# 42. PERFORMANCE

Optimize:

- Images
- API requests
- Database queries
- React rendering
- Audio loading
- Component reuse

Avoid unnecessary page reloads.

Do not reload the entire application when uploading or favoriting a song.

---

# 43. ERROR HANDLING

Implement proper frontend and backend error handling.

Examples:

"Song not found."

"Unable to play this song."

"Unsupported audio format."

"File is too large."

"Upload failed."

"Playlist could not be created."

Never expose raw stack traces to users.

---

# 44. IMPORTANT FUNCTIONAL REQUIREMENTS

The following must actually work end-to-end:

1. Upload a real MP3.
2. Save it to the server.
3. Save metadata to SQLite.
4. Save cover artwork.
5. Display the song in the library.
6. Click the song.
7. Play the actual uploaded audio.
8. Pause/resume.
9. Click the progress bar.
10. Jump to another timestamp.
11. Drag the progress handle.
12. Display real duration.
13. Next song.
14. Previous song.
15. Shuffle.
16. Repeat.
17. Queue.
18. Favorite/unfavorite.
19. Search.
20. Create playlist.
21. Add songs to playlist.
22. Remove songs from playlist.
23. Recently played.
24. Play count.
25. Delete song.
26. Delete associated audio/cover files.
27. Navigate between pages without stopping playback.
28. Responsive mobile player.
29. Persistent player state.

Do NOT create fake buttons.

Do NOT use fake progress bars.

Do NOT use hardcoded song data as the main music database.

Do NOT use placeholder functionality.

Every important button must perform its actual function.

---

# 45. EMPTY DATABASE BEHAVIOR

The application may start with zero songs.

Do NOT fill the database with fake copyrighted songs.

Instead, show:

**Welcome to Spotibai**

"Upload your first song to start building your library."

Include:

**Upload Music**

button.

---

# 46. ORIGINAL BRANDING

Application name:

**Spotibai**

Create an original logo using typography and/or a simple original music-related symbol.

Do not copy Spotify's logo.

Use Spotibai branding consistently in:

- Sidebar
- Browser title
- Login/setup if implemented
- Upload page
- Empty states
- README

---

# 47. PROFESSIONAL UX DETAILS

Add small details that make the application feel commercially polished:

- Sticky headers where appropriate
- Smooth scrolling
- Hover previews
- Proper tooltips
- Keyboard accessibility
- Context menus
- Confirmation dialog before deleting songs/playlists
- Optimistic favorite updates
- Proper disabled states
- Upload progress
- Skeleton loading
- Toast feedback
- Mobile touch interactions

---

# 48. README

Create a complete README containing:

- Project description
- Features
- Requirements
- Installation
- npm install
- Database setup
- Development command
- Production command
- Upload folder explanation
- Supported audio formats
- Supported image formats
- API documentation
- Troubleshooting

The project should run with:

```bash
npm install
npm run dev
```

and open at:

```text
http://localhost:3000
```

---

# FINAL INSTRUCTION

Generate the **complete working Spotibai project**.

Do not stop after creating the frontend.

Do not provide only a design.

Do not provide pseudocode.

Do not leave TODO sections for core functionality.

Create the actual:

- Frontend
- Backend
- SQLite database
- Upload system
- Audio streaming
- HTTP range requests
- Global music player
- Interactive progress bar
- Seek/drag functionality
- Queue
- Shuffle
- Repeat
- Search
- Favorites
- Playlists
- Recently Played
- Play counts
- Artist pages
- Album pages
- Library
- Responsive mobile UI
- Professional animations
- Error handling
- Loading states
- Empty states
- README

Make every feature work together as one cohesive application.

The final result should feel like a **real premium Spotify-inspired music streaming platform**, but branded entirely as **Spotibai** with original visual assets.