import type { ProposalStatus, Role } from "@prisma/client";

const elevatedRoles: Role[] = ["OFFICE_HEAD", "VICE_DEAN", "DEAN", "ADMIN"];

export function canAssignRole(actorRole: Role, targetRole: Role) {
  if (!elevatedRoles.includes(targetRole)) {
    return actorRole === "ADMIN";
  }

  return actorRole === "ADMIN";
}

export function canEditProposal(actorRole: Role, isOwner: boolean, status: ProposalStatus) {
  return actorRole === "STAFF" && isOwner && ["DRAFT", "REVISION_REQUESTED"].includes(status);
}

export function canReviewStatus(actorRole: Role, status: ProposalStatus) {
  const allowed: Partial<Record<Role, ProposalStatus[]>> = {
    OFFICE_HEAD: ["OFFICE_REVIEW"],
    VICE_DEAN: ["VICE_DEAN_REVIEW"],
    DEAN: ["DEAN_APPROVAL"],
    ADMIN: ["OFFICE_REVIEW", "VICE_DEAN_REVIEW", "DEAN_APPROVAL"],
  };

  return allowed[actorRole]?.includes(status) ?? false;
}
