import { describe, expect, it } from "vitest";
import { canAssignRole, canEditProposal, canReviewStatus } from "@/lib/rbac";

describe("rbac", () => {
  it("allows only admins to assign elevated roles", () => {
    expect(canAssignRole("ADMIN", "DEAN")).toBe(true);
    expect(canAssignRole("STAFF", "DEAN")).toBe(false);
  });

  it("allows staff to edit draft and revision proposals", () => {
    expect(canEditProposal("STAFF", true, "DRAFT")).toBe(true);
    expect(canEditProposal("STAFF", true, "REVISION_REQUESTED")).toBe(true);
    expect(canEditProposal("STAFF", true, "SUBMITTED")).toBe(false);
  });

  it("maps reviewer roles to their allowed statuses", () => {
    expect(canReviewStatus("OFFICE_HEAD", "OFFICE_REVIEW")).toBe(true);
    expect(canReviewStatus("VICE_DEAN", "VICE_DEAN_REVIEW")).toBe(true);
    expect(canReviewStatus("DEAN", "DEAN_APPROVAL")).toBe(true);
    expect(canReviewStatus("STAFF", "DEAN_APPROVAL")).toBe(false);
  });
});
