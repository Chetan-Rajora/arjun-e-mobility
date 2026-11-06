// ============================================================
//  Arjun E Mobility – ALL business details live in this file.
//  Edit the values below; no other file needs to change.
// ============================================================
export const SITE = {
  name: "Arjun E Mobility",
  tagline: "Electric two-wheelers, three-wheelers and loaders – see them at our showroom",
  owner: { name: "Mr. Arjun Singh Rajora", photo: "assets/owner/owner.webp" },

  // --- Contact -------------------------------------------------
  phoneDisplay: "+91 95480 72451",   // shown on the site (placeholder)
  phoneTel: "+91 95480 72451",                       // REAL number for the call link, e.g. "+919876543210". Empty = call link disabled
  whatsappNumber: "+91 95480 72451",                 // REAL number, digits only with country code, e.g. "919876543210". Empty = WhatsApp button disabled
  whatsappMessage: "Hello Arjun E Mobility, I would like to enquire about an electric vehicle.",

  // --- Location ------------------------------------------------
  addressLines: ["Khusalgar Road", "Anoopshahar"],
  // Paste the verified Google Maps "Share > Embed a map" src URL here when you have it.
  mapEmbedUrl: "",
  // Paste the verified Google Maps share link here when you have it (used for Get Directions).
  mapLink: "",
  mapVerified: false, // set true only after you add mapEmbedUrl/mapLink from the real showroom pin

  // --- Catalogue display --------------------------------------
  showPrices: true,                   // false hides all prices (shows "Contact showroom for price")
  heroModelId: "glide",                // product id (see data/products.json) shown in the hero
  heroModelId2: "glide",

  // --- About page ---------------------------------------------
  // Leave a value as "" to hide it. Do not add anything that is not true.
  about: {
    established: "",                  // e.g. "2024" – hidden while empty
    authorisedDealerNote: "",         // e.g. "Authorised TEJAS dealer" – hidden while empty
    background: "",                   // short showroom background paragraph – shows a placeholder while empty
    ownerMessage: "",                 // optional note from the owner – shows a placeholder while empty
  },
};
