/**
 * Centralised site configuration.
 * Edit values here instead of scattering magic strings across components.
 */

export const siteConfig = {
  title: "Ghostbusters Virginia",
  description:
    "Virginia's community Ghostbusters franchise — events, media, and how to join the team.",
  copyright: `© ${new Date().getFullYear()} Ghostbusters Virginia. All rights reserved.`,

  /** Navigation links shown in the header (and optionally the footer). */
  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Events", href: "/events" },
    { label: "Media", href: "/media" },
    { label: "Join", href: "/join" },
    { label: "Contact", href: "/contact" },
    { label: "Donate", href: "/donate" },
    {
      label: "Store",
      href: "https://www.teepublic.com/user/ghostbustersva",
      external: true,
    },
  ],

  /** Footer logo images — paths relative to /images */
  footerLogos: [
    {
      src: "/images/sony-ghost-corps-franchise-letter.png",
      alt: "Ghost Corps Franchise Logo",
    },
    {
      src: "/images/irs-501c3-determination-letter.png",
      alt: "IRS 501(c)(3) determination letter",
    },
  ],
} as const;
