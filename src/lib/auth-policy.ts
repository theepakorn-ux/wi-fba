import type { Role } from "@prisma/client";

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isAllowedUniversityEmail(email: string, allowedDomain: string) {
  const normalizedEmail = normalizeEmail(email);
  const normalizedDomain = allowedDomain.trim().toLowerCase();
  return normalizedEmail.endsWith(`@${normalizedDomain}`);
}

export function getBootstrapRole(email: string, initialAdminEmails: string[]): Role {
  const normalizedEmail = normalizeEmail(email);
  const normalizedAdmins = initialAdminEmails.map(normalizeEmail);
  return normalizedAdmins.includes(normalizedEmail) ? "ADMIN" : "STAFF";
}
