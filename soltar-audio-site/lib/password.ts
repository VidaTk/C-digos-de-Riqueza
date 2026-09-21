import { timingSafeEqual } from "crypto";
import { SITE_PASSWORD } from "./env";

export function isPasswordCorrect(candidate: string): boolean {
  const expected = Buffer.from(SITE_PASSWORD);
  const given = Buffer.from(candidate);
  if (expected.length !== given.length) return false;
  return timingSafeEqual(expected, given);
}
