// ─── Pet Types ───

export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: string;
  type: PetType;
  location: string;
  bio: string;
  personality: string[];
  imageUrl: string;
  distance: string;
}

export type PetType = 'dog' | 'cat' | 'rabbit' | 'bird';

export type SwipeDirection = 'left' | 'right';

export interface Match {
  pet: Pet;
  matchedAt: Date;
}
