export const PET_TYPES = ["Dog", "Cat", "Parrot"] as const;

export type PetType = (typeof PET_TYPES)[number];
