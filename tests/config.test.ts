import { describe, it, expect } from "vitest";
import { siteConfig } from "../src/config";

describe("siteConfig", () => {
  it("has a non-empty title", () => {
    expect(siteConfig.title).toBeTruthy();
  });

  it("nav contains Home link", () => {
    const home = siteConfig.nav.find((n) => n.label === "Home");
    expect(home).toBeDefined();
    expect(home?.href).toBe("/");
  });

  it("Store link is marked external", () => {
    const store = siteConfig.nav.find((n) => n.label === "Store");
    expect(store).toBeDefined();
    expect("external" in store!).toBe(true);
  });

  it("footer logos include both required images", () => {
    const alts = siteConfig.footerLogos.map((l) => l.alt);
    expect(alts).toContain("Ghost Corps Franchise Logo");
    expect(alts).toContain("501st Legion Basic Certification Logo");
  });
});
