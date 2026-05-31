// ─── PawsMatch – Tinder for Pets ───

import { useState, useCallback, useRef, useEffect } from 'react';
import { usePetStack } from './usePetStack';
import type { Pet, PetType, SwipeDirection, Match } from './types';

// ─── Icons (inline SVG) ───

function HeartIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function XIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function StarIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function PawIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="currentColor">
      <ellipse cx="30" cy="25" rx="10" ry="12" />
      <ellipse cx="70" cy="25" rx="10" ry="12" />
      <ellipse cx="15" cy="48" rx="9" ry="11" />
      <ellipse cx="85" cy="48" rx="9" ry="11" />
      <ellipse cx="50" cy="65" rx="22" ry="20" />
    </svg>
  );
}

function FilterIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="7" y1="12" x2="17" y2="12" />
      <line x1="10" y1="18" x2="14" y2="18" />
    </svg>
  );
}

function LocationIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
    </svg>
  );
}

// ─── Pet Type Emoji ───

function petTypeEmoji(type: PetType): string {
  switch (type) {
    case 'dog': return '🐕';
    case 'cat': return '🐱';
    case 'rabbit': return '🐰';
    case 'bird': return '🐦';
  }
}

// ─── Confetti Component ───

function Confetti() {
  const colors = ['#fbbf24', '#f59e0b', '#22c55e', '#ef4444', '#fb923c', '#4ade80', '#fcd34d'];
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    color: colors[i % colors.length],
    delay: `${Math.random() * 0.8}s`,
    duration: `${1.5 + Math.random() * 1.5}s`,
    shape: Math.random() > 0.5 ? 'circle' : 'square',
  }));

  return (
    <>
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: p.left,
            backgroundColor: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : '2px',
            '--delay': p.delay,
            '--duration': p.duration,
          } as React.CSSProperties}
        />
      ))}
    </>
  );
}

// ─── Match Modal ───

function MatchModal({ match, onDismiss }: { match: Match; onDismiss: () => void }) {
  return (
    <div className="match-backdrop" onClick={onDismiss} id="match-modal">
      <Confetti />
      <div className="match-card animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <div className="text-5xl mb-3 animate-heartbeat">💕</div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-warm-400 bg-clip-text text-transparent mb-2">
          It's a Match!
        </h2>
        <p className="text-stone-400 mb-6 text-sm">
          You and <span className="text-primary-300 font-semibold">{match.pet.name}</span> liked each other
        </p>
        <div className="relative mx-auto w-28 h-28 mb-6">
          <img
            src={match.pet.imageUrl}
            alt={match.pet.name}
            className="w-full h-full rounded-full object-cover border-3 border-primary-500"
          />
          <div className="absolute -bottom-1 -right-1 bg-friendly-500 rounded-full p-1.5">
            <HeartIcon size={16} />
          </div>
        </div>
        <p className="text-stone-300 text-sm mb-6">{match.pet.bio}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onDismiss}
            className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-warm-500 text-white font-semibold rounded-full hover:from-primary-400 hover:to-warm-400 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            id="match-continue-btn"
          >
            Keep Swiping 🐾
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton Card ───

function SkeletonCard() {
  return (
    <div className="pet-card skeleton" id="skeleton-card">
      <div className="pet-card-overlay">
        <div className="h-8 w-40 bg-white/10 rounded-lg mb-2" />
        <div className="h-4 w-56 bg-white/10 rounded mb-2" />
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-white/10 rounded-full" />
          <div className="h-6 w-20 bg-white/10 rounded-full" />
          <div className="h-6 w-14 bg-white/10 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// ─── Pet Card ───

interface PetCardProps {
  pet: Pet;
  onSwipe: (direction: SwipeDirection) => void;
  swipeAnimation: SwipeDirection | null;
}

function PetCard({ pet, onSwipe, swipeAnimation }: PetCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const currentX = useRef(0);
  const isDragging = useRef(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  const threshold = 100;

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    currentX.current = e.clientX;
    if (cardRef.current) {
      cardRef.current.setPointerCapture(e.pointerId);
      cardRef.current.style.transition = 'none';
    }
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    currentX.current = e.clientX;
    const diff = currentX.current - startX.current;
    setDragOffset(diff);
  }, []);

  const handlePointerUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;

    if (cardRef.current) {
      cardRef.current.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    }

    if (dragOffset > threshold) {
      onSwipe('right');
    } else if (dragOffset < -threshold) {
      onSwipe('left');
    } else {
      setDragOffset(0);
    }
  }, [dragOffset, onSwipe]);

  const rotation = dragOffset * 0.08;
  const opacity = Math.max(0.5, 1 - Math.abs(dragOffset) / 400);

  const animClass = swipeAnimation === 'left'
    ? 'animate-swipe-left'
    : swipeAnimation === 'right'
    ? 'animate-swipe-right'
    : petStack_animClass(dragOffset);

  function petStack_animClass(offset: number) {
    if (offset === 0) return 'animate-card-enter';
    return '';
  }

  const showLikeStamp = dragOffset > 50 || swipeAnimation === 'right';
  const showNopeStamp = dragOffset < -50 || swipeAnimation === 'left';

  return (
    <div
      ref={cardRef}
      className={`pet-card ${animClass}`}
      style={
        !swipeAnimation
          ? {
              transform: `translateX(${dragOffset}px) rotate(${rotation}deg)`,
              opacity,
            }
          : undefined
      }
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      id="pet-card"
    >
      {/* Like stamp */}
      <div
        className={`stamp stamp-like ${showLikeStamp ? 'animate-stamp' : ''}`}
        style={{ opacity: showLikeStamp ? 1 : 0 }}
      >
        LIKE
      </div>

      {/* Nope stamp */}
      <div
        className={`stamp stamp-nope ${showNopeStamp ? 'animate-stamp' : ''}`}
        style={{ opacity: showNopeStamp ? 1 : 0 }}
      >
        NOPE
      </div>

      {/* Image */}
      {!imageLoaded && (
        <div className="absolute inset-0 skeleton" />
      )}
      <img
        src={pet.imageUrl}
        alt={`${pet.name} the ${pet.breed}`}
        className="pet-card-image"
        style={{ opacity: imageLoaded ? 1 : 0 }}
        onLoad={() => setImageLoaded(true)}
        draggable={false}
      />

      {/* Overlay info */}
      <div className="pet-card-overlay">
        <div className="flex items-end gap-2 mb-1">
          <h2 className="text-3xl font-bold text-white">{pet.name}</h2>
          <span className="text-lg text-stone-300 mb-0.5">{pet.age}</span>
          <span className="text-xl ml-1">{petTypeEmoji(pet.type)}</span>
        </div>
        <p className="text-stone-300 text-sm mb-1 flex items-center gap-1">
          <LocationIcon size={14} />
          {pet.location} · {pet.distance}
        </p>
        <p className="text-stone-300 text-sm font-medium mb-2">{pet.breed}</p>
        <div className="flex gap-1.5 flex-wrap">
          {pet.personality.map((trait) => (
            <span
              key={trait}
              className="text-xs px-2.5 py-1 rounded-full bg-white/15 text-white/90 backdrop-blur-sm font-medium"
            >
              {trait}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Filter Bar ───

interface FilterBarProps {
  typeFilter: PetType | undefined;
  setTypeFilter: (type: PetType | undefined) => void;
  locationFilter: string;
  setLocationFilter: (location: string) => void;
}

function FilterBar({ typeFilter, setTypeFilter, locationFilter, setLocationFilter }: FilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);
  const types: { type: PetType; label: string; emoji: string }[] = [
    { type: 'dog', label: 'Dogs', emoji: '🐕' },
    { type: 'cat', label: 'Cats', emoji: '🐱' },
    { type: 'rabbit', label: 'Rabbits', emoji: '🐰' },
    { type: 'bird', label: 'Birds', emoji: '🐦' },
  ];

  const locations = [
    'New York', 'Los Angeles', 'Chicago', 'Austin', 'Denver',
    'Portland', 'Seattle', 'Miami', 'San Francisco',
  ];

  return (
    <div className="w-full max-w-md mx-auto px-4" id="filter-bar">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-2 mx-auto mb-3 text-stone-400 hover:text-primary-400 transition-colors text-sm font-medium"
        id="filter-toggle-btn"
      >
        <FilterIcon />
        Filters
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{ transform: showFilters ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {showFilters && (
        <div className="animate-fade-in-up space-y-3 mb-4">
          {/* Pet type chips */}
          <div className="flex gap-2 justify-center flex-wrap">
            <button
              onClick={() => setTypeFilter(undefined)}
              className={`filter-chip ${!typeFilter ? 'filter-chip-active' : ''}`}
              id="filter-all"
            >
              🌟 All
            </button>
            {types.map(t => (
              <button
                key={t.type}
                onClick={() => setTypeFilter(typeFilter === t.type ? undefined : t.type)}
                className={`filter-chip ${typeFilter === t.type ? 'filter-chip-active' : ''}`}
                id={`filter-${t.type}`}
              >
                {t.emoji} {t.label}
              </button>
            ))}
          </div>

          {/* Location filter */}
          <div className="flex gap-2 justify-center flex-wrap">
            <button
              onClick={() => setLocationFilter('')}
              className={`filter-chip text-xs ${!locationFilter ? 'filter-chip-active' : ''}`}
              id="filter-location-all"
            >
              📍 Any Location
            </button>
            {locations.map(loc => (
              <button
                key={loc}
                onClick={() => setLocationFilter(locationFilter === loc ? '' : loc)}
                className={`filter-chip text-xs ${locationFilter === loc ? 'filter-chip-active' : ''}`}
                id={`filter-location-${loc.toLowerCase().replace(/\s/g, '-')}`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Matches Strip ───

function MatchesStrip({ matches }: { matches: Match[] }) {
  if (matches.length === 0) return null;

  return (
    <div className="w-full max-w-md mx-auto px-4 mb-4" id="matches-strip">
      <div className="flex items-center gap-2 mb-2">
        <HeartIcon size={16} />
        <span className="text-sm font-semibold text-primary-400">
          Matches ({matches.length})
        </span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {matches.map((m, i) => (
          <div
            key={m.pet.id + i}
            className="flex-shrink-0 flex flex-col items-center gap-1 animate-fade-in-up"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <img
              src={m.pet.imageUrl}
              alt={m.pet.name}
              className="matches-avatar"
            />
            <span className="text-xs text-stone-400 font-medium">{m.pet.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main App ───

export default function App() {
  const {
    currentPet,
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
  } = usePetStack();

  const [swipeAnimation, setSwipeAnimation] = useState<SwipeDirection | null>(null);

  const handleSwipe = useCallback((direction: SwipeDirection) => {
    setSwipeAnimation(direction);
    setTimeout(() => {
      swipe(direction);
      setSwipeAnimation(null);
    }, 350);
  }, [swipe]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (latestMatch) {
        if (e.key === 'Escape' || e.key === 'Enter') {
          dismissMatch();
        }
        return;
      }
      if (e.key === 'ArrowLeft') handleSwipe('left');
      if (e.key === 'ArrowRight') handleSwipe('right');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSwipe, latestMatch, dismissMatch]);

  return (
    <div className="animated-bg min-h-screen flex flex-col" id="app-root">
      {/* Header */}
      <header className="glass-header sticky top-0 z-50 py-3 px-4" id="app-header">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-primary-500">
              <PawIcon size={32} />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-400 via-warm-400 to-primary-500 bg-clip-text text-transparent">
              PawsMatch
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {matches.length > 0 && (
              <div className="flex items-center gap-1 text-friendly-400 text-sm font-semibold">
                <HeartIcon size={16} />
                <span>{matches.length}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center pt-4 pb-8 px-4">
        {/* Filters */}
        <FilterBar
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          locationFilter={locationFilter}
          setLocationFilter={setLocationFilter}
        />

        {/* Matches strip */}
        <MatchesStrip matches={matches} />

        {/* Card Stack */}
        <div className="relative w-full max-w-[400px] aspect-[3/4] mb-6" id="card-stack">
          {/* Background cards for depth effect */}
          {!isLoading && currentPet && (
            <>
              <div
                className="absolute inset-0 rounded-[var(--radius-card)] bg-surface-card opacity-30 scale-[0.92] translate-y-4"
                style={{ filter: 'blur(2px)' }}
              />
              <div
                className="absolute inset-0 rounded-[var(--radius-card)] bg-surface-elevated opacity-20 scale-[0.85] translate-y-8"
                style={{ filter: 'blur(4px)' }}
              />
            </>
          )}

          {/* Main card */}
          {isLoading ? (
            <SkeletonCard />
          ) : currentPet ? (
            <PetCard
              key={currentPet.id}
              pet={currentPet}
              onSwipe={handleSwipe}
              swipeAnimation={swipeAnimation}
            />
          ) : (
            <div className="pet-card flex items-center justify-center bg-surface-card" id="empty-state">
              <div className="text-center p-8">
                <div className="text-5xl mb-4">🐾</div>
                <h3 className="text-xl font-bold text-stone-300 mb-2">No more pets nearby</h3>
                <p className="text-stone-500 text-sm mb-4">
                  Try adjusting your filters or check back later!
                </p>
                <button
                  onClick={() => {
                    setTypeFilter(undefined);
                    setLocationFilter('');
                  }}
                  className="px-5 py-2 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-full transition-all duration-200 text-sm"
                  id="reset-filters-btn"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {currentPet && !isLoading && (
          <div className="flex items-center gap-5" id="action-buttons">
            <button
              onClick={() => handleSwipe('left')}
              className="action-btn action-btn-nope"
              disabled={!!swipeAnimation}
              id="nope-btn"
              aria-label="Pass"
            >
              <XIcon size={26} />
            </button>
            <button
              onClick={() => handleSwipe('right')}
              className="action-btn action-btn-like"
              disabled={!!swipeAnimation}
              id="like-btn"
              aria-label="Like"
            >
              <HeartIcon size={30} />
            </button>
            <button
              onClick={() => handleSwipe('right')}
              className="action-btn action-btn-super"
              disabled={!!swipeAnimation}
              id="super-like-btn"
              aria-label="Super Like"
            >
              <StarIcon size={22} />
            </button>
          </div>
        )}

        {/* Keyboard hint */}
        {currentPet && !isLoading && (
          <p className="text-stone-600 text-xs mt-4 text-center">
            Use ← → arrow keys or drag to swipe
          </p>
        )}

        {/* Bio section */}
        {currentPet && !isLoading && (
          <div className="w-full max-w-[400px] mt-6 p-5 bg-surface-card/80 backdrop-blur rounded-2xl border border-white/5" id="pet-bio">
            <h3 className="text-lg font-bold text-white mb-1">About {currentPet.name}</h3>
            <p className="text-stone-400 text-sm leading-relaxed mb-3">{currentPet.bio}</p>
            <div className="flex items-center gap-4 text-xs text-stone-500">
              <span className="flex items-center gap-1">
                {petTypeEmoji(currentPet.type)} {currentPet.breed}
              </span>
              <span className="flex items-center gap-1">
                <LocationIcon size={12} />
                {currentPet.location}
              </span>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-stone-600 text-xs border-t border-white/5" id="app-footer">
        <p>Made with 🐾 by PawsMatch · Every pet deserves love</p>
      </footer>

      {/* Match Modal */}
      {latestMatch && (
        <MatchModal match={latestMatch} onDismiss={dismissMatch} />
      )}

      {/* Hidden preload images */}
      <div className="preload-hidden" aria-hidden="true">
        {preloadUrls.map((url) => (
          <img key={url} src={url} alt="" />
        ))}
      </div>
    </div>
  );
}
