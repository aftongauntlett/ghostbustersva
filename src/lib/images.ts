import { getImage } from "astro:assets";
import type { ImageMetadata } from "astro";

interface ResponsiveImageOptions {
  src: string;
  widths: number[];
  sizes: string;
  width: number;
  height: number;
  format?: "webp" | "avif";
  quality?: number;
}

export interface ResponsiveImageAttrs {
  src: string;
  srcset?: string;
  sizes: string;
  width: number;
  height: number;
}

const localImageModules = import.meta.glob("../../images/**/*.{jpg,jpeg,png,webp,avif}", {
  eager: true,
}) as Record<string, { default: ImageMetadata }>;

const localImageMap = new Map<string, ImageMetadata>(
  Object.entries(localImageModules).map(([modulePath, mod]) => {
    const publicPath = modulePath.replace(/^\.\.\/\.\.\//, "/");
    return [publicPath, mod.default];
  }),
);

function resolveImageSource(src: string): ImageMetadata | string {
  return localImageMap.get(src) ?? src;
}

export async function getResponsiveImageAttrs({
  src,
  widths,
  sizes,
  width,
  height,
  format = "webp",
  quality = 75,
}: ResponsiveImageOptions): Promise<ResponsiveImageAttrs> {
  try {
    const variants = await Promise.all(
      widths.map((variantWidth) =>
        getImage({
          src: resolveImageSource(src),
          width: variantWidth,
          format,
          quality,
        }),
      ),
    );

    const fallback = variants[variants.length - 1];
    const srcset = variants.map((variant, index) => `${variant.src} ${widths[index]}w`).join(", ");

    return {
      src: fallback.src,
      srcset,
      sizes,
      width,
      height,
    };
  } catch {
    return {
      src,
      sizes,
      width,
      height,
    };
  }
}
