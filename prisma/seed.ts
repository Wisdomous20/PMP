/**
 * @fileOverview This file is used to generate a default administrator account.
 * For production, this should be seeded and then disable the default administrator account
 * after the server is configured with a legitimate organization account.
 *
 * During deployment, this account is generated on every startup.
 */

import bcrypt from "bcrypt";
import {PrismaClient, Prisma, $Enums} from "@prisma/client";
import validator from "validator";

const prisma = new PrismaClient();

// Options
const DEFAULT_PASSWORD_MAX_LENGTH = 8;

function generatePasswordLengthComponents(length: number, componentCount: number, minimumValue: number): Array<number> {
  if (componentCount <= 0 || length <= 0 || minimumValue < 0) {
    throw new Error("Parts and targetSum must be positive integers and minValue cannot be negative");
  }

  const minTotal = componentCount * minimumValue;
  if (minTotal > length) {
    throw new Error("Minimum value per part is too high for the given targetSum and number of parts");
  }

  const remaining = length - minTotal;

  const cuts = new Set<number>();
  while (cuts.size < componentCount - 1) {
    cuts.add(Math.floor(Math.random() * (remaining + 1))); // 0 to remaining
  }

  const sortedCuts = Array.from(cuts).sort((a, b) => a - b);
  const extraParts = [];

  let prev = 0;
  for (const cut of sortedCuts) {
    extraParts.push(cut - prev);
    prev = cut;
  }
  extraParts.push(remaining - prev); // last segment

  return extraParts.map(part => part + minimumValue);
}

function getRandomCombination(alphabet: string, length: number): string {
  const positions = new Uint8Array(length);
  crypto.getRandomValues(positions);

  let combinations = "";
  for (const position of positions) {
    combinations += alphabet[position % alphabet.length];
  }

  return combinations;
}

function generatePassword(): string {
  // Pick a random length of each component of the password.
  const [lower, upper, digit, special] = generatePasswordLengthComponents(DEFAULT_PASSWORD_MAX_LENGTH, 4, 1);

  // Get parts needed for shuffling:
  const lowers = getRandomCombination("abcdefghijklmnopqrstuvwxyz", lower);
  const uppers = getRandomCombination("ABCDEFGHIJKLMNOPQRSTUVWXYZ", upper);
  const digits = getRandomCombination("0123456789", digit);
  const specials = getRandomCombination("!@#$%^&*()_+|~`[]{}\\:;\"'<>,./?", special);

  // Then shuffle for the final output:
  const arr = (lowers + uppers + digits + specials).split("");
  const rng = new Uint32Array(DEFAULT_PASSWORD_MAX_LENGTH);
  crypto.getRandomValues(rng);

  // Fisher–Yates shuffle using secure random numbers
  for (let i = rng.length - 1; i > 0; i--) {
    const j = rng[i] % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const result = arr.join("");

  if (!validator.isStrongPassword(result)) {
    return generatePassword();
  }

  return result;
}

async function main() {
  const hasAdministrator = await prisma.user.findFirst({
    where: {
      user_type: $Enums.user_type.ADMIN,
    }
  });
  if (hasAdministrator) {
    console.log("Account Generation is skipped due to an existing account.");
    return;
  }

  const password = generatePassword();
  const entry = Prisma.validator<Prisma.UserCreateArgs>()({
    data: {
      firstName: "Administrator",
      lastName: "Account",
      email: "pmp-admin@cpu.edu.ph",
      password: await bcrypt.hash(password, 10),
      isVerified: true,
      user_type: $Enums.user_type.ADMIN,
      department: "Office of the Vice President for Administration",
      createdAt: new Date(),
      cellphoneNumber: "09123456789",
    }
  });

  await prisma.user.create(entry);
  await prisma.$disconnect();

  console.log("Account Generation Completed with following credentials:");
  console.log("Email: pmp-admin@cpu.edu.ph");
  console.log("Password: %s", password);
  console.log("");
  console.log("Note: This account is only shown once. Note it during the initial setup.");
  console.log("      Afterwards, you can disable this account after you setup an organization account.");
}

main().catch(console.error);
