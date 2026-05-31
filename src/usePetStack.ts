// ─── usePetStack Hook ───
// Custom hook managing a prefetch buffer to eliminate swipe latency.
// Preloads the next batch of pets before the user swipes through the current ones.

import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchMultiplePets } from './petProvider';
import type { Pet, PetType, Match, SwipeDirection } from './types';

const BUFFER_SIZE = 5;       // how many pets to keep in the buffer
const PREFETCH_THRESHOLD = 2; // when to trigger a prefetch

interface UsePetStackReturn {
  currentPet: Pet | null;
  nextPets: Pet[];
  isLoading: boolean;
  matches: Match[];
  swipe: (direction: SwipeDirection) => void;
  typeFilter: PetType | undefined;
  setTypeFilter: (type: PetType | undefined) => void;
  locationFilter: string;
  setLocationFilter: (location: string) => void;
  dismissMatch: () => void;
  latestMatch: Match | null;
  preloadUrls: string[];
}

export function usePetStack(): UsePetStackReturn {
  const [petStack, setPetStack] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [matches, setMatches] = useState<Match[]>([]);
  const [typeFilter, setTypeFilter] = useState<PetType | undefined>(undefined);
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [latestMatch, setLatestMatch] = useState<Match | null>(null);
  const isFetching = useRef(false);
  const prevFilter = useRef<{ type: PetType | undefined; location: string }>({
    type: undefined,
    location: '',
  });

  // ─── Fetch & fill the buffer ───
  const fillBuffer = useCallback(async (reset = false) => {
    if (isFetching.current && !reset) return;
    isFetching.current = true;

    try {
      const needed = reset ? BUFFER_SIZE : BUFFER_SIZE;
      const newPets = await fetchMultiplePets(needed, typeFilter);

      // Apply location filter client-side
      const filtered = locationFilter
        ? newPets.filter(p =>
            p.location.toLowerCase().includes(locationFilter.toLowerCase())
          )
        : newPets;

      setPetStack(prev => reset ? filtered : [...prev, ...filtered]);
    } catch (error) {
      console.error('Failed to fetch pets:', error);
    } finally {
      setIsLoading(false);
      isFetching.current = false;
    }
  }, [typeFilter, locationFilter]);

  // ─── Initial load & filter change ───
  useEffect(() => {
    const filterChanged =
      prevFilter.current.type !== typeFilter ||
      prevFilter.current.location !== locationFilter;

    if (filterChanged) {
      prevFilter.current = { type: typeFilter, location: locationFilter };
      setIsLoading(true);
      setPetStack([]);
      fillBuffer(true);
    }
  }, [typeFilter, locationFilter, fillBuffer]);

  // Initial load
  useEffect(() => {
    fillBuffer(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Prefetch when buffer runs low ───
  useEffect(() => {
    if (petStack.length <= PREFETCH_THRESHOLD && !isFetching.current) {
      fillBuffer();
    }
  }, [petStack.length, fillBuffer]);

  // ─── Swipe handler ───
  const swipe = useCallback((direction: SwipeDirection) => {
    if (petStack.length === 0) return;

    const swipedPet = petStack[0];

    if (direction === 'right') {
      // ~40% chance of match for fun
      const isMatch = Math.random() < 0.4;
      if (isMatch) {
        const newMatch: Match = { pet: swipedPet, matchedAt: new Date() };
        setMatches(prev => [newMatch, ...prev]);
        setLatestMatch(newMatch);
      }
    }

    setPetStack(prev => prev.slice(1));
  }, [petStack]);

  // ─── Dismiss match modal ───
  const dismissMatch = useCallback(() => {
    setLatestMatch(null);
  }, []);

  // ─── Current pet & preload URLs ───
  const currentPet = petStack[0] || null;
  const nextPets = petStack.slice(1, 4);

  // Preload URLs for hidden img elements
  const preloadUrls = petStack.slice(1, BUFFER_SIZE).map(p => p.imageUrl);

  return {
    currentPet,
    nextPets,
    isLoading,
    matches,
    swipe,
    typeFilter,
    setTypeFilter,
    locationFilter,
    setLocationFilter,
    dismissMatch,
    latestMatch,
    preloadUrls,
  };
}
