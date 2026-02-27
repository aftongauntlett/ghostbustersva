export function resolveMotionOff(storedPreference: string | null, osReduce: boolean): boolean {
  return storedPreference !== null ? storedPreference === "off" : osReduce;
}
