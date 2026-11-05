# Success Scholar – MERN Demo Website

A demo recreation of the public site <https://successscholar.in/> built with **MongoDB, Express, React (Vite, JavaScript, React Router, plain CSS) and Node.js**.
This is an independent demo, **not** the official site. All people, jobs, enquiries and partner names are fictional.

* Frontend: http://localhost:5173  
* Backend API: http://localhost:5000/api

## Requirements (Windows + VS Code)

1. **Node.js 18+** (LTS recommended) – https://nodejs.org
2. **MongoDB**, either:
   * *Local*: install **MongoDB Community Server** (tick "Install as a Service") – it then listens on `mongodb://127.0.0.1:27017`, or
   * *Cloud*: a free **MongoDB Atlas** cluster (allow your IP, copy the connection string).
3. VS Code (optional extension: *MongoDB for VS Code* to browse data).

## Quick start

Open the extracted folder in VS Code, open a terminal (**Terminal → New Terminal**) and run:

```powershell
npm run install:all                 # installs root, server and client dependencies
copy server\.env.example server\.env   # then edit server\.env if needed (see below)
npm run seed                        # fills MongoDB with demo data + demo accounts
npm run dev                         # starts API (5000) and website (5173) together
```

Open http://localhost:5173.

Run them separately if you prefer (two terminals): `npm run server` and `npm run client`.

### Configure MongoDB (`server/.env`)

```
MONGODB_URI=mongodb://127.0.0.1:27017/success_scholar          # local
# MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/success_scholar?retryWrites=true&w=majority   # Atlas
JWT_SECRET=put-a-long-random-string-here
```

If MongoDB is not running you will see *"Could not connect to MongoDB"* in the API terminal. Start the **MongoDB** Windows service (`services.msc`) or fix the URI.

### Demo accounts (created by `npm run seed`)

| Role    | Email                          | Password       |
|---------|--------------------------------|----------------|
| Admin   | admin@successscholar.demo      | Admin@12345    |
| Student | student@successscholar.demo    | Student@12345  |

Change the admin credentials via `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `server/.env` before seeding. Re-running the seed **resets** courses, testimonials, jobs, enquiries, messages and applications (users you registered are kept).

## What was inspected on the reference site

Fetched successfully: the **homepage** (`/`) and **Careers** (`/careers`), plus a screen recording you supplied (used only for colours/layout feel: navy headings, white shadowed cards, navy buttons, blue gradient course tiles).
Navigation items found: Home, Expertise, Portfolio, Testimonials, Contact, Careers, Admin. Linked pages: `/signin`, `/register`, `/internship`, `/privacy_policy.php`, `/admin/admin-panel.php`.
**Not inspected:** the pages behind login (the real admin panel, registration/internship pages, privacy policy text), and the site's JavaScript behaviour. Those pages here are my own interpretation, not copies.

## Pages and features

| Route | Feature |
|---|---|
| `/` | Hero, animated stats, internship banner, scrolling partner strip, Expertise carousel (11 programs, modal with modules and enquiry form), Courses, institutions strip, Portfolio gallery with lightbox, Testimonials carousel, Vision/Mission/Values, FAQ accordion, Contact form |
| `/expertise` `/portfolio` `/testimonials` `/contact` | The same sections as standalone pages (navbar links) |
| `/careers` | Own header like the reference; **working search** (keyword + location, via API), job table, Apply form, sponsored cards, network banner |
| `/login` `/register` | JWT authentication (bcrypt-hashed passwords) |
| `/admin` | Admin-only dashboard: overview stats, enquiries and messages (status change/delete), jobs (add, publish/unpublish, delete), applications, testimonial moderation, users |
| `/internship`, `/privacy-policy` | Simple pages (privacy text is placeholder) |

Visitor-submitted testimonials are stored as *pending* until an admin approves them.

## Assets – please read

I could not download images from successscholar.in in my build environment, and I did not want to hot-link or copy another organisation's logos without permission. Therefore:

* **No external images are used and none can break.** Icons are inline SVG; gallery/hero/cards are CSS gradients and hand-written SVG shapes.
* The logo is an **original placeholder monogram**, not the official logo.
* **ISO / IAF / EGAC / MSME logos are not reproduced** (no fake certification marks). The claims appear only as text badges, copied from the reference site's own statements; verify them before any real use.
* Partner company and college strips use **fictional names** in `client/src/data/partners.js`.
* Testimonials use fictional people (the real site shows real student names; those were intentionally not copied).
* Social icons link to the public Facebook, LinkedIn and WhatsApp URLs shown on the reference site.
* Contact details/address in the footer are the public ones shown on the reference site. Replace them if you reuse this project.
* The live stat values (450+, 120+, 8,000+) are invented demo numbers; "1,00,000+" follows the site's "more than 1 lakh students" claim.
* The seeded job listings are fictional (the live site currently shows none).

If you have permission to use real images, drop them in `client/public/images/` and reference them as `/images/your-file.png`.

## Project structure

```
success-scholar-mern/
├─ package.json            root scripts (install:all, seed, dev, build)
├─ server/
│  ├─ .env.example
│  └─ src/
│     ├─ index.js          Express app (port 5000)
│     ├─ config/db.js      Mongoose connection
│     ├─ models/           User, Course, Enquiry, ContactMessage, Job, Application, Testimonial
│     ├─ middleware/       auth (JWT, admin guard), error handling
│     ├─ routes/           auth.js, public.js, admin.js
│     └─ seed/seed.js      demo data
└─ client/
   ├─ vite.config.js       port 5173, proxies /api to 127.0.0.1:5000
   └─ src/
      ├─ App.jsx, main.jsx, api.js
      ├─ context/AuthContext.jsx
      ├─ pages/            one file per route
      ├─ components/
      │  ├─ layout/        AnnouncementBar, Navbar, Footer, Layout
      │  ├─ home/          Hero, StatsStrip, Expertise, Courses, Portfolio, Testimonials, ...
      │  ├─ careers/       CareersHero, JobTable, ApplyModal, CareerCards, NetworkBanner
      │  ├─ admin/         Overview, ResourcePanel, JobsPanel, AdminPanels
      │  └─ common/        Icon, Modal, Logo, Alert, hooks, ProtectedRoute
      ├─ data/             partners, gallery, faqs
      └─ styles/           base, layout, home, pages, admin
```

## API summary

Public: `GET /api/courses`, `GET/POST /api/testimonials`, `POST /api/enquiries`, `POST /api/contact`, `GET /api/jobs?q=&location=`, `POST /api/jobs/:id/apply`  
Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`  
Admin (Bearer token, admin role): `/api/admin/stats|enquiries|messages|applications|users|jobs|testimonials|courses`

## Build for production

```powershell
npm run build        # outputs client/dist
```

## Troubleshooting

* **Port in use** – change `PORT` in `server/.env` (and the proxy target in `client/vite.config.js`); Vite automatically picks the next free port if 5173 is taken.
* **"Cannot reach the server"** in the browser – the API is not running or MongoDB failed to connect; check the API terminal.
* **Empty Expertise/Testimonials** – you have not run `npm run seed`.
* **PowerShell blocks npm scripts** – run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`, or use Command Prompt.

## Verified in the build environment

Production build succeeded; the API and a real MongoDB 8 were started; the seed ran; and a headless-browser test passed for: enquiry modal, contact form, careers search and apply, registration, student blocked from admin, admin login, all dashboard tabs, adding and deleting a job, mobile layout. This was **not** tested on Windows itself.
