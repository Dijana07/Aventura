export const AccessType = {
  EDIT: "EDIT",
  VIEW: "VIEW",
} as const;

export type AccessType =
  (typeof AccessType)[keyof typeof AccessType];