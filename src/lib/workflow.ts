import type { ProposalStatus, Role } from "@prisma/client";

const transitions: Partial<Record<ProposalStatus, Partial<Record<Role, ProposalStatus[]>>>> = {
  DRAFT: {
    STAFF: ["SUBMITTED"],
  },
  SUBMITTED: {
    STAFF: ["CANCELLED"],
    OFFICE_HEAD: ["OFFICE_REVIEW"],
  },
  OFFICE_REVIEW: {
    OFFICE_HEAD: ["REVISION_REQUESTED", "EVALUATED"],
    ADMIN: ["REVISION_REQUESTED", "EVALUATED"],
  },
  REVISION_REQUESTED: {
    STAFF: ["SUBMITTED", "CANCELLED"],
  },
  EVALUATED: {
    OFFICE_HEAD: ["VICE_DEAN_REVIEW"],
    ADMIN: ["VICE_DEAN_REVIEW"],
  },
  VICE_DEAN_REVIEW: {
    VICE_DEAN: ["DEAN_APPROVAL", "REJECTED"],
    ADMIN: ["DEAN_APPROVAL", "REJECTED"],
  },
  DEAN_APPROVAL: {
    DEAN: ["APPROVED", "REJECTED"],
    ADMIN: ["APPROVED", "REJECTED"],
  },
};

export function getNextStatuses(status: ProposalStatus, role: Role) {
  return transitions[status]?.[role] ?? [];
}

export function canTransition(status: ProposalStatus, role: Role, nextStatus: ProposalStatus) {
  return getNextStatuses(status, role).includes(nextStatus);
}
