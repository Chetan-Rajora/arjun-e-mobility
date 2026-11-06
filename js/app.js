import { SITE } from "./config.js";

const $ = (s, r = document) => r.querySelector(s);
const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const inr = (n) => "₹" + new Intl.NumberFormat("en-IN").format(n);
const NP = '<span class="np">Not provided</span>';
const main = $("#main");
let DATA = null, first = true;
const filters = { q: "", type: "", battery: "", tyre: "", band: "", sort: "price" };
const cmp = new Set();

const addr = SITE.addressLines.join(", ");
const phoneHtml = () => SITE.phoneTel ? `<a href="tel:${esc(SITE.phoneTel)}">${esc(SITE.phoneDisplay)}</a>` : `<span>${esc(SITE.phoneDisplay)}</span>`;
const waLink = () => SITE.whatsappNumber ? `https://wa.me/${encodeURIComponent(SITE.whatsappNumber)}?text=${encodeURIComponent(SITE.whatsappMessage)}` : "";
const dirLink = () => SITE.mapLink || "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(`${SITE.name}, ${addr}`);

const minPrice = (p) => Math.min(...p.variants.map((v) => v.price));
const volts = (p) => p.variants.map((v) => parseInt(v.spec));
const ahs = (p) => [...new Set(p.variants.map((v) => parseInt(v.spec.split("/")[1])))].sort((a, b) => a - b);
const battText = (p) => { const v = volts(p); return `${Math.min(...v)}–${Math.max(...v)} V · ${ahs(p).join(" / ")} Ah`; };
const types = (p) => [...new Set(p.variants.map((v) => v.batteryType))];
const band = (n) => (n < 45000 ? "u45" : n < 60000 ? "45" : n < 75000 ? "60" : "75");
const BANDS = { u45: "Under ₹45,000", 45: "₹45,000 – ₹59,999", 60: "₹60,000 – ₹74,999", 75: "₹75,000 and above" };
const priceBlock = (p) => SITE.showPrices ? `<div class="price"><small>Dealer price from (catalogue, excl. GST)</small>${inr(minPrice(p))}</div>` : `<div class="price"><small>Price</small>Contact showroom</div>`;
const prodName = (p) => `${p.brand} ${p.model}`;
const img = (p, cls = "") => `<img class="${cls}" src="${esc(p.image)}" alt="${esc(prodName(p))}${p.descriptor ? " (" + esc(p.descriptor) + ")" : ""}" loading="lazy" decoding="async">`;

const ic = {
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  pin: '<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/>', bolt: '<path d="M13 3 5 14h6l-1 7 8-11h-6z"/>', arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
};
const I = (n) => `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ic[n]}</svg>`;

function ownerChip() {
  const html = `<a class="owner" href="#/about" aria-label="About the owner"><img src="${esc(SITE.owner.photo)}" alt="${esc(SITE.owner.name)}" width="44" height="44"><span><b>${esc(SITE.owner.name)}</b>${esc(SITE.phoneDisplay)}</span></a>`;
  document.querySelectorAll("[data-owner]").forEach((el) => (el.innerHTML = html));
  $("#brandName").textContent = SITE.name;
  $("#ftrText").innerHTML = `© ${new Date().getFullYear()} ${esc(SITE.name)} · ${esc(addr)}`;
}

/* ---------- views ---------- */
const heroProd = (id) => DATA.products.find((p) => p.id === id) || DATA.products[0];
function home() {
  const a = heroProd(SITE.heroModelId);
  return `<section class="hero"><div class="wrap hero-in"><div>
    <p class="eyebrow">Electric vehicle showroom · Anoopshahar</p>
    <h1>Electric two‑wheelers, shown and explained in person.</h1>
    <p class="lead">${esc(SITE.name)} is an electric scooter showroom on ${esc(addr)}. Browse the models, check specifications, compare options, then visit us to see the vehicles and ask your questions.</p>
    <div class="cta"><a class="btn btn-pri" href="#/vehicles">Explore Vehicles ${I("arrow")}</a><a class="btn btn-ghost" href="#/contact">Contact Showroom</a></div>
    <ul class="facts"><li>${DATA.products.length} models in the catalogue</li><li>Specifications for every model</li><li>Purchase at the showroom only</li></ul></div>
    <figure class="stage" style="margin:0">${img(a).replace('loading="lazy"', 'loading="eager" fetchpriority="high"')}<figcaption>${esc(prodName(a))}</figcaption></figure></div></section>
  <section><div class="wrap grid2"><div><p class="eyebrow">Showroom</p><h2>Visit, see and ask.</h2><p class="muted">Vehicles are sold from the showroom, so you can see each one in person, compare options side by side and speak to us directly about your needs.</p><a class="btn btn-ghost" href="#/about">About us</a></div>
    <div class="card"><h3>Find us</h3><p style="margin:.2em 0">${esc(addr)}</p><p class="muted small">${SITE.owner.name} · ${phoneHtml()}</p><a class="btn btn-pri" href="#/location">${I("pin")} Location &amp; directions</a></div></div></section>`;
}
function about() {
  const A = SITE.about, ph = (t) => `<p class="ph">${esc(t)}</p>`;
  return `<section><div class="wrap grid2"><div><p class="eyebrow">About us</p><h1>${esc(SITE.name)}</h1>
    <p>${esc(SITE.name)} is an electric two-wheeler showroom located on ${esc(addr)}, owned by ${esc(SITE.owner.name)}. Customers can view vehicles, learn their specifications and enquire about them at the showroom.</p>
    ${A.established ? `<p><b>Established:</b> ${esc(A.established)}</p>` : ""}${A.authorisedDealerNote ? `<p>${esc(A.authorisedDealerNote)}</p>` : ""}
    <h3>Business background</h3>${A.background ? `<p>${esc(A.background)}</p>` : ph("Placeholder – add the showroom’s background in js/config.js (about.background).")}
    <h3>How we help customers</h3><p class="muted">You can browse every model online, compare specifications, then visit the showroom to see the vehicles, ask questions and discuss pricing. Purchases are completed at the showroom.</p></div>
    <div class="card"><div style="display:flex;gap:16px;align-items:center"><img src="${esc(SITE.owner.photo)}" alt="${esc(SITE.owner.name)}" width="96" height="96" style="border-radius:50%;object-fit:cover;object-position:50% 12%;width:96px;height:96px;border:3px solid var(--acc)"><div><p class="eyebrow" style="margin:0">Owner</p><h2 style="margin:0;font-size:1.4rem">${esc(SITE.owner.name)}</h2></div></div>
    <p class="muted">${esc(SITE.owner.name)} runs ${esc(SITE.name)}.</p>${A.ownerMessage ? `<p>${esc(A.ownerMessage)}</p>` : ph("Placeholder – add a short message from the owner in js/config.js (about.ownerMessage).")}
    <p>${phoneHtml()}</p></div></div></section>`;
}
function card(p) {
  return `<article class="pc"><div class="im"><a href="#/vehicle/${esc(p.id)}" tabindex="-1" aria-hidden="true">${img(p)}</a></div><div class="bd">
    <small class="b">${esc(p.brand)}</small><h3>${esc(p.model)}</h3>${p.descriptor ? `<div class="sub">${esc(p.descriptor)}</div>` : ""}
    <dl><dt>Range</dt><dd>60–300 km*</dd><dt>Battery</dt><dd>${esc(battText(p))}</dd><dt>Motor</dt><dd>${p.motorWatts ? esc(p.motorWatts) + " W" : NP}</dd></dl>
    ${priceBlock(p)}<div class="act"><a class="btn btn-pri" href="#/vehicle/${esc(p.id)}" aria-label="View specifications of ${esc(prodName(p))}">View Specifications</a>
    <label class="chk"><input type="checkbox" data-cmp="${esc(p.id)}" ${cmp.has(p.id) ? "checked" : ""}> Compare</label></div></div></article>`;
}
function sortedFiltered() {
  const f = filters, q = f.q.trim().toLowerCase();
  let L = DATA.products.filter((p) => (!q || (p.model + " " + (p.descriptor || "")).toLowerCase().includes(q)) && (!f.type || p.vehicleType === f.type) &&
    (!f.battery || types(p).includes(f.battery)) && (!f.tyre || p.tyres === f.tyre) && (!f.band || !SITE.showPrices || band(minPrice(p)) === f.band));
  L.sort((a, b) => (f.sort === "name" ? a.model.localeCompare(b.model) : f.sort === "price-d" ? minPrice(b) - minPrice(a) : minPrice(a) - minPrice(b)));
  return L;
}
function vehicles() {
  const P = DATA.products, opt = (arr, cur) => arr.map(([v, l]) => `<option value="${esc(v)}" ${cur === v ? "selected" : ""}>${esc(l)}</option>`).join("");
  const T = [...new Set(P.map((p) => p.vehicleType))], Ty = [...new Set(P.map((p) => p.tyres))].sort();
  const sel = (id, label, body) => `<label class="f">${label}<select id="${id}">${body}</select></label>`;
  return `<section><div class="wrap"><p class="eyebrow">Our vehicles</p><h1>Vehicle catalogue</h1>
    <p class="muted">Specifications are taken from the supplier’s catalogue. *Range is the catalogue’s claimed 60–300 km span and depends on the battery option. ${SITE.showPrices ? "Prices shown are dealer (B2B) prices excluding GST from the catalogue, not on-road prices – please confirm at the showroom." : ""}</p>
    <div class="filters" role="search"><label class="f">Search model<input type="search" id="fq" value="${esc(filters.q)}" placeholder="e.g. Volt"></label>
    ${sel("ft", "Vehicle type", `<option value="">All types</option>` + opt(T.map((t) => [t, t]), filters.type))}
    ${sel("fb", "Battery type", `<option value="">Any</option>` + opt(["Lead graphene", "Lithium"].map((t) => [t, t]), filters.battery))}
    ${sel("fy", "Tyre size", `<option value="">Any</option>` + opt(Ty.map((t) => [t, t]), filters.tyre))}
    ${SITE.showPrices ? sel("fp", "Price range", `<option value="">Any</option>` + opt(Object.entries(BANDS), filters.band)) : ""}
    ${sel("fs", "Sort by", opt([["price", "Price: low to high"], ["price-d", "Price: high to low"], ["name", "Name A–Z"]], filters.sort))}</div>
    <p class="count" id="count" aria-live="polite"></p><div class="grid" id="grid"></div></div></section>`;
}
function paintGrid() {
  const L = sortedFiltered();
  $("#count").textContent = `${L.length} of ${DATA.products.length} vehicles`;
  $("#grid").innerHTML = L.length ? L.map(card).join("") : `<p class="state" style="grid-column:1/-1">No vehicles match these filters. <button class="btn btn-ghost" id="reset">Reset filters</button></p>`;
  const r = $("#reset"); if (r) r.onclick = () => { Object.assign(filters, { q: "", type: "", battery: "", tyre: "", band: "", sort: "price" }); render(); };
}
const row = (k, v) => `<tr><th scope="row">${esc(k)}</th><td>${v ?? NP}</td></tr>`;
function detail(id) {
  const p = DATA.products.find((x) => x.id === id), C = DATA.common;
  if (!p) return `<section><div class="wrap state"><h1>Vehicle not found</h1><a class="btn btn-pri" href="#/vehicles">Back to vehicles</a></div></section>`;
  const motor = p.motorInch ? `${p.motorInch}-inch BLDC hub motor${p.motorWatts ? ", " + p.motorWatts + " W" : ""}` : null;
  const brakes = p.frontBrake ? `${p.frontBrake} (front) / ${p.rearBrake} (rear), ${C.brakeSystem}` : null;
  const vr = p.variants.map((v) => `<tr><td>${esc(v.spec)}</td><td>${esc(v.batteryType)}</td><td>${esc(v.warranty || "See warranty terms below")}</td>${SITE.showPrices ? `<td>${inr(v.price)}</td>` : ""}</tr>`).join("");
  const grp = (t, rows) => `<div class="group"><h3>${t}</h3><div class="tw"><table>${rows}</table></div></div>`;
  return `<section class="ds"><div class="wrap"><a class="back" href="#/vehicles">← All vehicles</a><div class="det">
    <figure class="stage" style="margin:0">${img(p).replace('loading="lazy"', 'loading="eager"')}</figure>
    <div><p class="eyebrow">${esc(p.vehicleType)} · ${esc(p.brand)}</p><h1>${esc(prodName(p))}</h1>${p.descriptor ? `<p class="muted">${esc(p.descriptor)}</p>` : ""}
    ${SITE.showPrices ? `<p class="price" style="font-size:1.5rem">${inr(minPrice(p))}<small>Dealer (B2B) price excl. GST, lowest battery option – not an ex-showroom price. Contact the showroom for the price applicable to you.</small></p>` : `<p class="price">Contact showroom for price</p>`}
    <div class="cta" style="margin:0 0 22px"><a class="btn btn-pri" href="#/contact">Enquire at showroom</a><label class="chk btn btn-ghost"><input type="checkbox" data-cmp="${esc(p.id)}" ${cmp.has(p.id) ? "checked" : ""}> Add to compare</label></div>
    ${grp("Battery options &amp; pricing", `<tr><th scope="col">Battery</th><th scope="col">Type</th><th scope="col">Battery warranty</th>${SITE.showPrices ? '<th scope="col">Price</th>' : ""}</tr>${vr}${SITE.showPrices ? `<tr><td colspan="4" class="small muted">Scooty only (catalogue column, as printed): ${inr(p.scootyOnlyPrice)}</td></tr>` : ""}`.replace(/<th scope="col">/g, '<th scope="col" style="width:auto">'))}
    ${grp("Overview", row("Brand", esc(p.brand)) + row("Model", esc(p.model)) + row("Ex-showroom price", "Not provided – the catalogue lists dealer prices only") + row("Available colours", esc(p.colours.join(", "))))}
    ${grp("Battery &amp; charging", row("Battery capacity options", esc(battText(p))) + row("Battery type", esc(types(p).join(" / "))) + row("Claimed range", esc(C.claimedRange)) + row("Charging time", esc(C.chargingTime)) + row("Charging type", null) + row("Removable battery", esc(C.removableBattery)))}
    ${grp("Performance", row("Motor", esc(motor)) + row("Controller", esc(p.controller)) + row("Top speed", esc(C.maxSpeed)) + row("Ride modes", esc(C.modes)) + row("Water protection", esc(C.ipRating)) + row("Gradeability", esc(C.gradeability)))}
    ${grp("Brakes, suspension &amp; wheels", row("Braking", esc(brakes)) + row("Front suspension", esc(C.frontSuspension)) + row("Rear suspension", esc(C.rearSuspension)) + row("Tyres", esc(p.tyres ? p.tyres + " tubeless" : null)) + row("Ground clearance", esc(C.groundClearance)))}
    ${grp("Weight &amp; body", row("Chassis weight", esc(p.weightKg ? p.weightKg + " kg" : null)) + row("Load capacity", esc(p.loadKg ? p.loadKg + " kg" : null)) + row("Body", esc(C.body)) + row("Finish", esc(C.paint)) + row("Lighting", esc(C.lighting)))}
    ${grp("Features", `<tr><td>${C.features.map(esc).join(" · ")}</td></tr>`)}
    ${grp("Warranty (catalogue terms)", `<tr><td>${C.warranty.map((w) => `<p style="margin:.2em 0">${esc(w)}</p>`).join("")}</td></tr>`)}
    ${p.notes.length ? `<p class="notes">Catalogue notes: ${p.notes.map(esc).join(" ")}</p>` : ""}
    <p class="muted small">Source: supplier catalogue page ${p.sourcePage}. Features and specifications are as printed and may vary by variant – please confirm at the showroom.</p></div></div></div></section>`;
}
function contact() {
  const wa = waLink();
  return `<section><div class="wrap"><p class="eyebrow">Contact</p><h1>Contact the showroom</h1><p class="muted">Vehicles are available to purchase at the showroom only. Call or message us to enquire first.</p>
  <div class="ci"><div class="card"><h3>Owner</h3><p>${esc(SITE.owner.name)}</p></div>
  <div class="card"><h3>Phone</h3><p>${phoneHtml()}</p>${SITE.phoneTel ? `<a class="btn btn-pri" href="tel:${esc(SITE.phoneTel)}">${I("phone")} Call now</a>` : `<span class="btn btn-pri" role="link" aria-disabled="true">${I("phone")} Call now</span><p class="ph" style="margin-top:12px">Placeholder number – set phoneTel in js/config.js.</p>`}</div>
  <div class="card"><h3>WhatsApp</h3>${wa ? `<a class="btn btn-pri" href="${wa}" target="_blank" rel="noopener">${I("chat")} WhatsApp enquiry</a>` : `<span class="btn btn-pri" role="link" aria-disabled="true">${I("chat")} WhatsApp enquiry</span><p class="ph" style="margin-top:12px">Not configured – set whatsappNumber in js/config.js.</p>`}</div>
  <div class="card"><h3>Address</h3><p>${SITE.addressLines.map(esc).join("<br>")}</p><a class="btn btn-ghost" href="#/location">${I("pin")} View location</a></div></div></div></section>`;
}
function location_() {
  const src = SITE.mapEmbedUrl || "https://www.google.com/maps?q=" + encodeURIComponent(`${SITE.name}, ${addr}`) + "&output=embed";
  return `<section><div class="wrap"><p class="eyebrow">Location</p><h1>Visit the showroom</h1><p>${SITE.addressLines.map(esc).join(", ")}</p>
  <p><a class="btn btn-pri" href="${esc(dirLink())}" target="_blank" rel="noopener">${I("pin")} Get Directions</a></p>
  <iframe class="map" title="Map showing ${esc(SITE.name)}" src="${esc(src)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
  ${SITE.mapVerified ? "" : `<p class="muted small">This map is a search based on the address text and is not a verified pin. Check the location before travelling.</p>`}</div></section>`;
}

/* ---------- compare ---------- */
function cmpBar() {
  const b = $("#cmpBar"); b.hidden = cmp.size === 0;
  b.innerHTML = `<span>${cmp.size} selected${cmp.size < 2 ? " – pick at least 2" : ""}</span><button class="btn btn-ghost" id="cmpOpen" ${cmp.size < 2 ? "disabled" : ""}>Compare</button><button class="btn btn-ghost" id="cmpClear">Clear</button>`;
  $("#cmpOpen").onclick = openCmp; $("#cmpClear").onclick = () => { cmp.clear(); cmpBar(); document.querySelectorAll("[data-cmp]").forEach((c) => (c.checked = false)); };
}
function openCmp() {
  const L = [...cmp].map((id) => DATA.products.find((p) => p.id === id)), C = DATA.common, d = $("#cmp");
  const r = (k, f) => `<tr><th scope="row">${k}</th>${L.map((p) => `<td>${f(p) ?? NP}</td>`).join("")}</tr>`;
  d.innerHTML = `<div class="dh"><h2>Compare vehicles</h2><button class="btn btn-ghost" id="cmpX" aria-label="Close comparison">Close</button></div><div class="db"><div class="tw"><table><tr><th></th>${L.map((p) => `<td><a href="#/vehicle/${esc(p.id)}"><b>${esc(prodName(p))}</b></a></td>`).join("")}</tr>
  ${SITE.showPrices ? r("Dealer price from (excl. GST)", (p) => inr(minPrice(p))) : ""}${r("Type", (p) => esc(p.vehicleType))}${r("Battery", (p) => esc(battText(p)))}${r("Battery type", (p) => esc(types(p).join(" / ")))}
  ${r("Motor", (p) => (p.motorWatts ? p.motorWatts + " W" : null))}${r("Claimed range", () => "60–300 km*")}${r("Top speed", () => esc(C.maxSpeed))}${r("Tyres", (p) => esc(p.tyres))}
  ${r("Brakes", (p) => (p.frontBrake ? `${p.frontBrake} / ${p.rearBrake}` : null))}${r("Chassis weight", (p) => (p.weightKg ? p.weightKg + " kg" : null))}${r("Colours", (p) => esc(p.colours.join(", ")))}</table></div><p class="muted small">*Range as printed in the catalogue; depends on battery option.</p></div>`;
  d.showModal(); $("#cmpX").onclick = () => d.close();
}
document.addEventListener("change", (e) => {
  const c = e.target.closest("[data-cmp]"); if (c) { if (c.checked && cmp.size >= 3) { c.checked = false; alert("You can compare up to 3 vehicles."); return; } c.checked ? cmp.add(c.dataset.cmp) : cmp.delete(c.dataset.cmp); cmpBar(); return; }
  const m = { ft: "type", fb: "battery", fy: "tyre", fp: "band", fs: "sort" }[e.target.id]; if (m) { filters[m] = e.target.value; paintGrid(); }
});
document.addEventListener("input", (e) => { if (e.target.id === "fq") { filters.q = e.target.value; paintGrid(); } });
document.addEventListener("error", (e) => { const t = e.target; if (t.tagName === "IMG" && !t.dataset.fb) { t.dataset.fb = 1; t.alt = ""; t.replaceWith(Object.assign(document.createElement("span"), { className: "np", textContent: "Image unavailable" })); } }, true);

/* ---------- router ---------- */
const TITLES = { home: "Arjun E Mobility – Electric Scooter Showroom, Anoopshahar", about: "About Us | Arjun E Mobility", vehicles: "Our Vehicles | Arjun E Mobility", contact: "Contact | Arjun E Mobility", location: "Location & Directions | Arjun E Mobility" };
function render() {
  const h = location.hash.replace(/^#\/?/, ""), [seg, arg] = h.split("/"), key = seg || "home";
  if (!DATA) return;
  let html, nav = key, title = TITLES[key];
  if (key === "home") html = home(); else if (key === "about") html = about(); else if (key === "vehicles") html = vehicles(); else if (key === "contact") html = contact(); else if (key === "location") html = location_();
  else if (key === "vehicle") { html = detail(arg); nav = "vehicles"; const p = DATA.products.find((x) => x.id === arg); title = p ? `${prodName(p)} specifications | Arjun E Mobility` : "Vehicle not found | Arjun E Mobility"; }
  else { html = `<section><div class="wrap state"><h1>Page not found</h1><a class="btn btn-pri" href="#/">Go home</a></div></section>`; title = "Page not found | Arjun E Mobility"; }
  main.innerHTML = html; document.title = title;
  document.querySelectorAll("[data-nav]").forEach((a) => (a.dataset.nav === nav ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current")));
  if (key === "vehicles") paintGrid();
  $("#nav").classList.remove("open"); $("#burger").setAttribute("aria-expanded", "false");
  window.scrollTo(0, 0); if (!first) main.focus({ preventScroll: true }); first = false;
}
$("#burger").onclick = () => { const o = $("#nav").classList.toggle("open"); $("#burger").setAttribute("aria-expanded", o); $("#burger").setAttribute("aria-label", o ? "Close menu" : "Open menu"); };
window.addEventListener("hashchange", render);
ownerChip(); cmpBar();
fetch("data/products.json").then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); }).then((d) => { DATA = d; render(); })
  .catch(() => { main.innerHTML = `<div class="wrap state"><h1>Catalogue could not be loaded</h1><p>Please refresh the page. If you opened this file directly from a folder, use a web server or the hosted site (see README).</p><p>${esc(SITE.name)} · ${esc(addr)}</p></div>`; });
