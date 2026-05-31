// ─── Pet Provider ───
// Fetches random bio from local data + image from Dog CEO API,
// combines into a full pet profile.

import type { Pet, PetType } from './types';
import {
  DOG_NAMES, CAT_NAMES, RABBIT_NAMES, BIRD_NAMES,
  DOG_BREEDS, CAT_BREEDS, RABBIT_BREEDS, BIRD_BREEDS,
  LOCATIONS, AGES, PERSONALITIES, BIOS,
  CAT_IMAGES, RABBIT_IMAGES, BIRD_IMAGES,
} from './petData';

// ─── Helpers ───

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickMultiple<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function generateId(): string {
  return `pet-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function getDistance(): string {
  const miles = Math.floor(Math.random() * 25) + 1;
  return `${miles} mi`;
}

// ─── Name & Breed by Type ───

function getNameForType(type: PetType): string {
  switch (type) {
    case 'dog': return pickRandom(DOG_NAMES);
    case 'cat': return pickRandom(CAT_NAMES);
    case 'rabbit': return pickRandom(RABBIT_NAMES);
    case 'bird': return pickRandom(BIRD_NAMES);
  }
}

function getBreedForType(type: PetType): string {
  switch (type) {
    case 'dog': return pickRandom(DOG_BREEDS);
    case 'cat': return pickRandom(CAT_BREEDS);
    case 'rabbit': return pickRandom(RABBIT_BREEDS);
    case 'bird': return pickRandom(BIRD_BREEDS);
  }
}

// ─── Image Fetching ───

async function fetchDogImage(): Promise<string> {
  try {
    const res = await fetch('https://dog.ceo/api/breeds/image/random');
    const data = await res.json();
    if (data.status === 'success') {
      return data.message;
    }
  } catch {
    // fallback below
  }
  // Fallback: deterministic placeholder
  return `https://placedog.net/500/600?random=${Math.random()}`;
}

function getFallbackImage(type: PetType): string {
  switch (type) {
    case 'cat': return pickRandom(CAT_IMAGES);
    case 'rabbit': return pickRandom(RABBIT_IMAGES);
    case 'bird': return pickRandom(BIRD_IMAGES);
    default: return `https://placedog.net/500/600?random=${Math.random()}`;
  }
}

async function getImageForType(type: PetType): Promise<string> {
  if (type === 'dog') {
    return fetchDogImage();
  }
  return getFallbackImage(type);
}

// ─── Main Provider Function ───

export async function fetchRandomPet(typeFilter?: PetType): Promise<Pet> {
  const petTypes: PetType[] = ['dog', 'cat', 'rabbit', 'bird'];
  const type = typeFilter || pickRandom(petTypes);

  const [imageUrl] = await Promise.all([getImageForType(type)]);

  return {
    id: generateId(),
    name: getNameForType(type),
    breed: getBreedForType(type),
    age: pickRandom(AGES),
    type,
    location: pickRandom(LOCATIONS),
    bio: pickRandom(BIOS),
    personality: pickMultiple(PERSONALITIES, 3),
    imageUrl,
    distance: getDistance(),
  };
}

export async function fetchMultiplePets(count: number, typeFilter?: PetType): Promise<Pet[]> {
  const promises = Array.from({ length: count }, () => fetchRandomPet(typeFilter));
  return Promise.all(promises);
}
