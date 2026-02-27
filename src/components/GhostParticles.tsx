/**
 * AmbientOrbs — Site-wide floating green bokeh background + corner fog.
 * PRD 009: Motion & Effects
 *
 * Rendered as an Astro island (`client:load`) in BaseLayout.
 * A mix of large glowing orbs, medium bokeh, and tiny particles
 * drift across the viewport with wispy fog hugging the bottom corners.
 *
 * Respects prefers-reduced-motion and the global motion toggle.
 */
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

/* ─── Orb tiers ─── */
interface OrbConfig {
  size: number;
  duration: number;
  delay: number;
  peakOpacity: number;
  left: string;
  xDrift: number;
  startY: number;
  blur: number;
  tier: "hero" | "medium" | "tiny";
}

const HERO_COUNT = 2; // big atmospheric orbs
const MED_COUNT = 6; // classic bokeh
const TINY_COUNT = 10; // small sparkle particles
const TOTAL = HERO_COUNT + MED_COUNT + TINY_COUNT;

function seeded(index: number, seedA = 9301, seedB = 4973) {
  const s = Math.sin(index * seedA + seedB) * 10000;
  return s - Math.floor(s);
}

function buildOrb(index: number): OrbConfig {
  const r = seeded(index);
  const r2 = seeded(index, 2137, 8461);
  const r3 = seeded(index, 5743, 1109);

  if (index < HERO_COUNT) {
    // Large glowing orbs — very visible
    return {
      size: 80 + r * 120,
      duration: 28 + r * 20,
      delay: r2 * 8,
      peakOpacity: 0.18 + r * 0.14,
      left: `${5 + r2 * 90}%`,
      xDrift: -40 + r3 * 80,
      startY: 30 + r2 * 50,
      blur: 30 + r * 30,
      tier: "hero",
    };
  }

  if (index < HERO_COUNT + MED_COUNT) {
    // Medium bokeh
    return {
      size: 14 + r * 36,
      duration: 20 + r * 22,
      delay: r2 * 14,
      peakOpacity: 0.2 + r * 0.2,
      left: `${2 + ((index - HERO_COUNT) / MED_COUNT) * 96}%`,
      xDrift: -30 + r2 * 60,
      startY: 20 + r2 * 60,
      blur: 4 + r * 8,
      tier: "medium",
    };
  }

  // Tiny sparkle particles
  return {
    size: 2 + r * 5,
    duration: 12 + r * 18,
    delay: r2 * 10,
    peakOpacity: 0.35 + r * 0.4,
    left: `${r3 * 100}%`,
    xDrift: -15 + r2 * 30,
    startY: 10 + r2 * 80,
    blur: 0.5 + r * 1.5,
    tier: "tiny",
  };
}

export default function GhostParticles() {
  const prefersReduced = useReducedMotion();
  const [toggleOff, setToggleOff] = useState(false);
  const [networkConstrained, setNetworkConstrained] = useState(false);

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

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection;
    setNetworkConstrained(Boolean(connection?.saveData));
  }, []);

  const reducedMotion = Boolean(prefersReduced) || toggleOff || networkConstrained;

  const orbs = useMemo(() => Array.from({ length: TOTAL }, (_, i) => buildOrb(i)), []);

  if (reducedMotion) return null;

  return (
    <div className="ghost-particles-global" aria-hidden="true">
      {/* Floating orbs */}
      {orbs.map((o, i) => (
        <motion.div
          key={i}
          className={`ghost-particle-global gp-${o.tier}`}
          style={{
            left: o.left,
            top: `${o.startY}%`,
            width: o.size,
            height: o.size,
            filter: `blur(${o.blur}px)`,
          }}
          /* Start invisible — prevents flash on mount / page change */
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{
            y: [0, -250 - o.size * 0.5, -80, -350 - o.size * 0.3],
            x: [0, o.xDrift, -o.xDrift * 0.4, o.xDrift * 0.6],
            opacity: [0, o.peakOpacity, o.peakOpacity * 0.5, o.peakOpacity, 0],
            scale: [0.6, 1.15, 0.95, 1.1, 0.7],
          }}
          transition={{
            duration: o.duration,
            repeat: Infinity,
            delay: o.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Corner fog — pure CSS driven */}
      <div className="corner-fog corner-fog--left" />
      <div className="corner-fog corner-fog--right" />
    </div>
  );
}
