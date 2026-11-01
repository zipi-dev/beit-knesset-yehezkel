# Beit Knesset Yehezkel

A website for a synagogue: Torah lessons, events, a prayer schedule, Shabbat times, visitor opinions, and blessing requests from the community.
The site also has an admin area for managing the content.

## Features

**For visitors**
- Torah lessons with search, autocomplete and filtering by rabbi
- The synagogue's rabbis
- Events and photos
- Prayer schedule and Shabbat times (calculated with `kosher-zmanim`)
- Visitor opinions, with likes
- Sending a blessing request (limited to 5 requests per 15 minutes per IP address)

**For the staff (after logging in)**
- Main admin: manages lessons, events, the prayer schedule, opinions and blessings, and adds or removes users
- Rabbi: adds and edits his own lessons and his own profile
- Gabbai: can enter the admin dashboard

Blessing requests are sent to the rabbi by an automatic email, once a month.

## Tech stack

- **Server:** Node.js, Express, MongoDB (Mongoose), JWT, bcrypt, Joi, multer, Cloudinary, node-cron, nodemailer
- **Client:** HTML, CSS and JavaScript (ES Modules), no framework

## Project structure

```
client/
  index.html            home page
  html/                 site pages (lessons, events, schedule, opinions, blessings)
  admin/html, admin/js  admin area
  services/             calls to the server
  js/, css/             logic and styling
  config.js             server address (API_URL)
server/
  app.js                entry point
  routes/ controllers/ models/ validators/ middlewares/ services/ config/
  scripts/seedMainRabbi.js
```

## Running locally

Requirements: Node.js 20 or later, and a MongoDB account (for example Atlas).

1. Install:
   ```
   cd server
   npm install
   ```
2. Create a `server/.env` file (see the table below).
3. Create the main rabbi, once:
   ```
   node --env-file=.env scripts/seedMainRabbi.js
   ```
   The script prints a line `MAIN_RABBI_ID=...`. Copy it into `.env`.
4. Start the server:
   ```
   npm run dev
   ```
5. Open the client: open `client/index.html` with Live Server (or any static server).
   In `client/config.js`, `API_URL` must be `'http://localhost:4000'` (or whatever port you set).

## Environment variables (`server/.env`)

| Variable | Description |
|---|---|
| `PORT` | Server port |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET_KEY` | Secret key for signing tokens |
| `BCRYPT_ROUNDS` | Number of password hashing rounds (for example 10) |
| `SUPER_ADMIN_USERNAME`, `SUPER_ADMIN_PASSWORD` | Login details of the main admin |
| `MAIN_RABBI_ID` | ID of the main rabbi (printed by `seedMainRabbi.js`) |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Image uploads |
| `EMAIL_USER`, `EMAIL_PASS` | Gmail account used to send the email (an app password) |
| `RABBI_EMAIL` | The address the blessings are sent to |
| `RENDER_EXTERNAL_URL` | Set automatically by Render, used by the keep-alive |

Never push `.env` to GitHub.

## Deploying to Render

1. Create a new Web Service from the repository, with `server` as the root directory.
2. Build command: `npm install`. Start command: `node app.js`.
3. Set all the environment variables in the Render dashboard (Environment). A `.env` file is not needed.
4. After deploying, update `API_URL` in `client/config.js` to the Render address.
5. On the free plan Render puts the server to sleep after about 15 minutes without requests.
   `services/keepAliveService.js` sends the server a request every 10 minutes so it stays awake.

## Permissions

| Role | Can do |
|---|---|
| `admin` | Everything |
| `rabbi` | Lessons (his own only) and his own profile |
| `gabbai` | Enter the admin dashboard only |

The main admin is defined in `.env` and is not stored in the database. Rabbis and gabbais are added from the admin dashboard.
