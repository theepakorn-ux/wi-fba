import { describe, expect, it } from "vitest";
import { getNextStatuses } from "@/lib/workflow";

describe("proposal workflow", () => {
  it("moves draft proposals to submitted", () => {
    expect(getNextStatuses("DRAFT", "STAFF")).toEqual(["SUBMITTED"]);
  });

  it("allows office heads to evaluate or request revision", () => {
    expect(getNextStatuses("OFFICE_REVIEW", "OFFICE_HEAD")).toEqual([
      "REVISION_REQUESTED",
      "EVALUATED",
    ]);
  });

  it("allows vice dean to forward to dean approval or reject", () => {
    expect(getNextStatuses("VICE_DEAN_REVIEW", "VICE_DEAN")).toEqual([
      "DEAN_APPROVAL",
      "REJECTED",
    ]);
  });

  it("allows dean final decision", () => {
    expect(getNextStatuses("DEAN_APPROVAL", "DEAN")).toEqual(["APPROVED", "REJECTED"]);
  });
});
