import { describe, expect, it } from "vitest";
import { getBootstrapRole, isAllowedUniversityEmail } from "@/lib/auth-policy";

describe("auth policy", () => {
  it("allows rmutsv.ac.th university email addresses", () => {
    expect(isAllowedUniversityEmail("theepakorn.n@rmutsv.ac.th", "rmutsv.ac.th")).toBe(true);
  });

  it("rejects external email addresses", () => {
    expect(isAllowedUniversityEmail("person@gmail.com", "rmutsv.ac.th")).toBe(false);
  });

  it("assigns ADMIN to the approved initial admin", () => {
    expect(getBootstrapRole("theepakorn.n@rmutsv.ac.th", ["theepakorn.n@rmutsv.ac.th"])).toBe(
      "ADMIN",
    );
  });

  it("assigns STAFF to ordinary university users", () => {
    expect(getBootstrapRole("staff@rmutsv.ac.th", ["theepakorn.n@rmutsv.ac.th"])).toBe(
      "STAFF",
    );
  });
});
