const GIVEBACK_ENDPOINT = "https://gb.j5bot.workers.dev/ghostbustersgiveback/";
const TEAM_NAME = "Ghostbusters, Virginia";
const GIVEBACK_GOAL = 25000;
const REQUEST_TIMEOUT_MS = 10000;

export type GivebackData = {
  raised: number;
  goal: number;
};

// TEMPORARY: the Giveback API is currently down. Until it's fixed, fall back
// to this hand-entered total so the donation meter still shows real progress.
// Remove this once the live API is restored.
const FALLBACK_GIVEBACK_DATA: GivebackData = {
  raised: 30273.46,
  goal: GIVEBACK_GOAL,
};

export class GivebackRequestTimeoutError extends Error {
  constructor(timeoutMs: number) {
    super(`Giveback request timed out after ${timeoutMs}ms.`);
    this.name = "GivebackRequestTimeoutError";
  }
}

export function isGivebackRequestTimeoutError(
  error: unknown,
): error is GivebackRequestTimeoutError {
  return error instanceof GivebackRequestTimeoutError;
}

function isAbortError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    typeof (error as { name?: unknown }).name === "string" &&
    (error as { name: string }).name === "AbortError"
  );
}

/**
 * Parse a raw dollar string from the markup into a whole-dollar integer.
 * Strips currency symbols, commas, and whitespace before parsing.
 */
function parseDollars(raw: string): number {
  const cleaned = raw.replace(/[^0-9.]/g, "");
  const value = parseFloat(cleaned);
  if (!Number.isFinite(value) || cleaned === "") {
    throw new Error(`Invalid raised amount in Giveback markup: "${raw}"`);
  }
  return Math.round(value);
}

/**
 * Extract the GBVA total from the raw markup.
 * The markup contains lines like:
 *   …Ghostbusters, Virginia…
 *   :"$1,234",
 */
function parseMarkup(markup: string): GivebackData {
  const lines = markup.split("\n");

  const teamLineIndex = lines.findIndex((line) => line.includes(TEAM_NAME));
  if (teamLineIndex === -1) {
    throw new Error(`Giveback markup does not contain team "${TEAM_NAME}".`);
  }

  const totalLine = lines[teamLineIndex + 1];
  if (totalLine === undefined || totalLine.trim() === "") {
    throw new Error(`Giveback markup missing total line after "${TEAM_NAME}".`);
  }

  const parts = totalLine.split(':"');
  if (parts.length < 2) {
    throw new Error(`Giveback total line has unexpected format: "${totalLine.trim()}"`);
  }

  // parts[1] looks like: `$1,234",` — drop the trailing two chars (`",`)
  const rawValue = parts[1].slice(0, -2);

  return { raised: parseDollars(rawValue), goal: GIVEBACK_GOAL };
}

async function fetchGivebackData(): Promise<GivebackData> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  let response: Response;

  try {
    response = await fetch(GIVEBACK_ENDPOINT, {
      signal: controller.signal,
    });
  } catch (error) {
    if (isAbortError(error)) {
      throw new GivebackRequestTimeoutError(REQUEST_TIMEOUT_MS);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    throw new Error(`Giveback request failed: ${response.status}`);
  }

  const markup = await response.text();
  return parseMarkup(markup);
}

export async function getGivebackData(): Promise<GivebackData> {
  try {
    const data = await fetchGivebackData();

    // The API currently responds with HTTP 200 and a placeholder "$0" amount
    // for our team instead of erroring, so a non-positive total is treated
    // as broken too. See FALLBACK_GIVEBACK_DATA above.
    if (data.raised <= 0) {
      throw new Error(`Giveback API returned a non-positive raised amount: ${data.raised}`);
    }

    return data;
  } catch (error) {
    // TEMPORARY: see FALLBACK_GIVEBACK_DATA above.
    console.warn("Giveback API unavailable, using fallback donation total.", error);
    return FALLBACK_GIVEBACK_DATA;
  }
}
