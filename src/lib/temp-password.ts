import { randomBytes } from "crypto";

/**
 * One-time temporary password for create / promote / reset.
 * Avoids ambiguous characters (0/O, 1/l/I) so staff can read it aloud or copy it.
 */
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";

export function generateTempPassword(length = 12): string {
  const bytes = randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i++) {
    out += ALPHABET[bytes[i]! % ALPHABET.length];
  }
  return out;
}
