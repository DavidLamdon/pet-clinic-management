export const PET_TYPES = ["Dog", "Cat", "Parrot"] as const;

export type PetType = (typeof PET_TYPES)[number];

export const MODAL_MODES = {
  Add: "add",
  Edit: "edit",
} as const;

export type ModalMode = (typeof MODAL_MODES)[keyof typeof MODAL_MODES];
