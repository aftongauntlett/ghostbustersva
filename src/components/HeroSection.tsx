/**
 * HeroSection — Interactive Ghostbusters-themed hero.
 * PRD 009: Motion & Effects (Tier 2 — Hero showcase)
 *
 * Rendered as an Astro island (`client:load`).
 * Full-bleed hero image with text directly on the overlay —
 * no card, just clean typography with text-shadow for readability.
 */
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";
import "./HeroSection.css";

/* ─── Constants ─── */
const HEADING_TEXT = "Who Ya Gonna Call?";

/* ─── Motion variants ─── */
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18, delayChildren: 1.4 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

/* ─── Typewriter heading ─── */
function TypewriterHeading({ reducedMotion }: { reducedMotion: boolean }) {
  const [displayedCount, setDisplayedCount] = useState(reducedMotion ? HEADING_TEXT.length : 0);

  useEffect(() => {
    if (reducedMotion) {
      setDisplayedCount(HEADING_TEXT.length);
      return;
    }
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedCount(i);
      if (i >= HEADING_TEXT.length) {
        clearInterval(interval);
      }
    }, 60);
    return () => clearInterval(interval);
  }, [reducedMotion]);

  return (
    <h1 id="home-hero-title" className="hero-title">
      {HEADING_TEXT.split("").map((char, i) => (
        <span
          key={i}
          className="hero-title-char"
          style={{ visibility: i < displayedCount ? "visible" : "hidden" }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </h1>
  );
}

/* ─── Animated energy divider (kept for future use) ─── */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function EnergyDivider({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div className="hero-divider-wrap" aria-hidden="true">
      <motion.div
        className="hero-divider-beam"
        initial={reducedMotion ? { opacity: 1 } : { opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 1.2, delay: 2, ease: "easeOut" }}
      />
      <motion.div
        className="hero-divider-flare"
        initial={reducedMotion ? {} : { x: "-10%", opacity: 0 }}
        animate={reducedMotion ? {} : { x: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
        transition={
          reducedMotion
            ? {}
            : {
                duration: 3,
                delay: 3,
                repeat: Infinity,
                repeatDelay: 4,
                ease: "easeInOut",
              }
        }
      />
    </div>
  );
}

/* ─── Main hero section ─── */
export default function HeroSection() {
  const prefersReduced = useReducedMotion();
  const [toggleOff, setToggleOff] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const check = () => setToggleOff(html.getAttribute("data-reduce-motion") === "true");
    check();
    const observer = new MutationObserver(check);
    observer.observe(html, {
      attributes: true,
      attributeFilter: ["data-reduce-motion"],
    });
    return () => observer.disconnect();
  }, []);

  const reducedMotion = Boolean(prefersReduced) || toggleOff;

  return (
    <div className="hero-container">
      <section className="hero" aria-labelledby="home-hero-title">
        {/* Full-bleed background image */}
        <div className="hero-bg">
          <img src="/images/gbv-gallery-09.jpg" alt="" className="hero-bg-img" />
          <div className="hero-bg-overlay" />
        </div>

        {/* Text directly on the image — no card */}
        <div className="hero-content">
          <motion.div
            className="hero-text"
            initial={reducedMotion ? "visible" : "hidden"}
            animate="visible"
            variants={reducedMotion ? {} : containerVariants}
          >
            <TypewriterHeading reducedMotion={reducedMotion} />

            <motion.p className="hero-tagline" variants={reducedMotion ? {} : fadeUp}>
              Virginia&rsquo;s official Ghostbusters nonprofit&thinsp;&mdash;&thinsp;real fans
              making a real difference through charity, community events, and a whole lot of heart.
            </motion.p>

            <motion.ul
              className="hero-purpose"
              variants={reducedMotion ? {} : fadeUp}
              aria-label="Key facts"
            >
              <li>Registered 501c3 Nonprofit</li>
              <li>Hospital Visits</li>
              <li>Community Events</li>
            </motion.ul>

            <motion.div className="hero-cta" variants={reducedMotion ? {} : fadeUp}>
              <a href="/events" className="btn btn--lg btn--ghost">
                See Our Events
              </a>
              <a href="/join" className="btn btn--lg btn--primary">
                Join the Team
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
