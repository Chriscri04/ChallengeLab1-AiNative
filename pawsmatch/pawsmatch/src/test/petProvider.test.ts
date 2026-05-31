import { describe, it, expect, vi } from 'vitest';
import { fetchRandomPet, fetchMultiplePets } from '../petProvider';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('petProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({
        status: 'success',
        message: 'https://images.dog.ceo/breeds/retriever-golden/test.jpg',
      }),
    });
  });

  it('fetchRandomPet returns a pet with required fields', async () => {
    const pet = await fetchRandomPet();

    expect(pet).toHaveProperty('id');
    expect(pet).toHaveProperty('name');
    expect(pet).toHaveProperty('breed');
    expect(pet).toHaveProperty('age');
    expect(pet).toHaveProperty('type');
    expect(pet).toHaveProperty('location');
    expect(pet).toHaveProperty('bio');
    expect(pet).toHaveProperty('personality');
    expect(pet).toHaveProperty('imageUrl');
    expect(pet).toHaveProperty('distance');
  });

  it('fetchRandomPet returns a dog when type filter is "dog"', async () => {
    const pet = await fetchRandomPet('dog');
    expect(pet.type).toBe('dog');
  });

  it('fetchRandomPet returns a cat when type filter is "cat"', async () => {
    const pet = await fetchRandomPet('cat');
    expect(pet.type).toBe('cat');
  });

  it('fetchRandomPet has 3 personality traits', async () => {
    const pet = await fetchRandomPet();
    expect(pet.personality).toHaveLength(3);
  });

  it('fetchMultiplePets returns the requested number of pets', async () => {
    const pets = await fetchMultiplePets(3);
    expect(pets).toHaveLength(3);
  });

  it('fetchMultiplePets with type filter returns only that type', async () => {
    const pets = await fetchMultiplePets(3, 'rabbit');
    pets.forEach(pet => {
      expect(pet.type).toBe('rabbit');
    });
  });

  it('fetchRandomPet generates a unique id', async () => {
    const pet1 = await fetchRandomPet();
    const pet2 = await fetchRandomPet();
    expect(pet1.id).not.toBe(pet2.id);
  });

  it('fetchRandomPet uses dog CEO API for dog images', async () => {
    await fetchRandomPet('dog');
    expect(mockFetch).toHaveBeenCalledWith('https://dog.ceo/api/breeds/image/random');
  });

  it('fetchRandomPet does not call API for non-dog types', async () => {
    await fetchRandomPet('cat');
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
