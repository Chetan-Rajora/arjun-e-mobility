# Arjun E Mobility – Showroom Website

A static business/catalogue website (no shopping cart, no payments, no database). Plain HTML, CSS and JavaScript – **there is no build step**, so nothing needs installing.

## Folder structure
```
index.html            page shell, SEO tags
css/styles.css        all styling (light + dark mode, responsive)
js/config.js          ★ ALL business details – edit this file
js/app.js             pages, catalogue, filters, compare, routing
data/products.json    ★ ALL vehicle data (76 models + shared specs)
assets/vehicles/      one optimised WebP photo per model
assets/owner/         owner photo
netlify.toml          optional hosting config
```

## What to edit (js/config.js)
| Setting | What it does |
|---|---|
| `phoneDisplay` | Number shown on the site (currently placeholder `+91 00000 00000`) |
| `phoneTel` | Real number, e.g. `"+919876543210"` – turns on the Call links. Empty = disabled |
| `whatsappNumber` | Real number, digits only with country code, e.g. `"919876543210"` – turns on the WhatsApp button. Empty = disabled |
| `mapEmbedUrl` / `mapLink` / `mapVerified` | Paste the real Google Maps embed URL and share link, then set `mapVerified: true` |
| `showPrices` | `false` hides every price ("Contact showroom for price") |
| `about.*` | Optional showroom background, established year, dealer note, owner message. Empty values are hidden / shown as placeholders |

Owner photo: replace `assets/owner/owner.webp` (square, ~600 px) and keep the name.

## Updating vehicles
Edit `data/products.json`. Every model has `variants` (battery option + price) and per-model fields; fields shared by all models are under `common`. Missing values show "Not provided". Photos are in `assets/vehicles/<id>.webp`.

## Run locally
The catalogue loads `data/products.json`, so open the site through a web server (double-clicking `index.html` will show a "could not be loaded" message):
```
python3 -m http.server 8000     # then open http://localhost:8000
```

## Deploy (browser only)
- **Netlify:** go to app.netlify.com/drop and drag the project folder in. A public URL is created immediately.
- **Cloudflare Pages / GitHub Pages / Vercel:** upload or connect the folder; framework "None", build command empty, output directory `/` (root).
Test the live URL on your phone before sharing it.

## Important notes about the data
- Source: Tejas EV bulk scooty catalogue (October), **dealer price list**. Prices on the site are the catalogue's **dealer (B2B) prices excluding GST**, not ex-showroom or on-road prices. Set `showPrices: false` or replace the prices before public launch if you do not want to publish dealer rates.
- The catalogue's company history, dealer count and contact details belong to the manufacturer and are **not** used as Arjun E Mobility's.
- Brand names of other manufacturers that appear in brackets in the catalogue model names (e.g. other scooter makers) are intentionally left out of the display names. The original catalogue title is kept in `rawTitle` in the data file.
- Many models share identical specification text in the catalogue. Only motor, controller, tyres, brakes, weight, battery options and prices vary per model. "Range 60–300 km" is the catalogue's claimed span across battery options.
- Chassis weight/load is not listed for some models (Zenride, Sahara, Elan Loader Pro); shown as "Not provided".
- Charging *type* (e.g. fast/normal) is not given in the catalogue.
- Model "E-1" uses a low-resolution catalogue photo; "Pluse X" is spelled that way in the catalogue.
