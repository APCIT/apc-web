/**
 * ASP.NET Identity 2.x password hasher (produce hashes only).
 * Format: base64(0x00 || salt_16 || subkey_32).
 * PBKDF2 with HMAC-SHA1, 1000 iterations, 128-bit salt, 256-bit subkey.
 * Login verification still uses aspnetcore-identity-password-hasher (it accepts both V2 and V3).
 */

import { randomBytes, pbkdf2 } from "crypto";
import { promisify } from "util";

const SALT_SIZE = 128 / 8; // 16 bytes
const SUBKEY_LENGTH = 256 / 8; // 32 bytes
const ITERATIONS = 1000;

const pbkdf2Async = promisify(pbkdf2);

export async function hashIdentityV2(password: string): Promise<string> {
  const salt = randomBytes(SALT_SIZE);
  const subkey = await pbkdf2Async(
    password,
    salt,
    ITERATIONS,
    SUBKEY_LENGTH,
    "sha1"
  );
  const output = Buffer.alloc(1 + SALT_SIZE + SUBKEY_LENGTH);
  output[0] = 0x00; // Identity V2 format marker
  salt.copy(output, 1);
  subkey.copy(output, 1 + SALT_SIZE);
  return output.toString("base64");
}
