// ╔══════════════════════════════════════════════════════════════╗
// ║              OFFER POPUP — CONFIGURATION FILE               ║
// ║   Edit this file to control everything about the popup.     ║
// ╚══════════════════════════════════════════════════════════════╝

const offerConfig = {

  // ── MASTER SWITCH ───────────────────────────────────────────
  // Set to true to show the popup, false to hide it completely.
  enabled: true,

  // ── TIMING ──────────────────────────────────────────────────
  // How many milliseconds after page load before popup appears.
  delayMs: 1500,

  // ── CONTENT ─────────────────────────────────────────────────
  badge:       "Limited Time",           // Small badge text at top
  title:       "Offer Mela",             // Big headline
  subtitle:    "Exclusive deal for CA aspirants — act fast!",

  // Description shown below the subtitle
  description: "Get personalised 1-on-1 tutoring sessions with FOCAS expert tutors. " +
               "100% syllabus coverage, flexible timings, and dedicated progress tracking — " +
               "everything you need to crack your CA exam on the first attempt.",

  // ── SLOTS ───────────────────────────────────────────────────
  totalSlots:  10,
  filledSlots: 3,
  slotLabel:   "Limited Slots Only",
  slotSubtext: "Hurry — filling up fast!",

  // ── TAGS (pill badges) ───────────────────────────────────────
  // Add, remove, or rename tags as you like.
  tags: ["Exclusive Deal", "Today Only", "Act Now"],

  // ── BUTTONS ─────────────────────────────────────────────────
  primaryButton: {
    label: "Know More",
    link:  "YOUR_KNOW_MORE_LINK_HERE",   // Replace with your course/landing page URL
  },
  whatsappButton: {
    label:  "Chat on WhatsApp",
    number: "916383514285",              // Country code + number, no +
    message: "Hi! I saw the Offer Mela and want to know more.",
  },

  // ── FOOTER NOTE ─────────────────────────────────────────────
  footerNote: "Tap outside or ✕ to close",
};

export default offerConfig;
