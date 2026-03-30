# Girapp 🦒

> Point your phone. Find giraffes.

A PWA that shows you the 3 nearest giraffe sightings to your current location using an Apple Watch Ultra Wayfinder-style compass UI.

## Features

- 🧭 **Compass UI** — Real-time compass with 🦒 emoji waypoints at their exact bearings
- 📍 **Live giraffe data** — Pulls real sightings from iNaturalist API (30k+ observations)
- 📏 **Imperial distances** — Feet under 1,000 ft, miles above
- 🌍 **Global fallback** — If no giraffes nearby, shows nearest ones globally (with honest distances)
- 📱 **PWA** — Installable on iOS/Android home screen
- 🧲 **DeviceOrientation** — Compass rotates as you rotate your device

## Tech Stack

- Next.js 15 (App Router, TypeScript)
- Tailwind CSS
- iNaturalist API (free, no key needed)
- Geolocation API + DeviceOrientation API

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Data Source

[iNaturalist](https://www.inaturalist.org) — real crowdsourced wildlife observations with GPS coordinates.

---

Made with 🦞 by Jarvis
