import { useState, useCallback, useEffect } from 'react';
import { usePetStack } from './usePetStack';
import { PawIcon, HeartIcon, StarIcon, XIcon, AlertIcon } from './components/Icons'; // Añadimos un icono de alerta
import FilterBar from './components/FilterBar';
import MatchesStrip from './components/MatchesStrip';
import PetCard from './components/PetCard';
import MatchModal from './components/MatchModal';
import SkeletonCard from './components/SkeletonCard';
import type { SwipeDirection } from './types';

export default function App() {
  const {
    currentPet,
    isLoading,
    error,             // Parchado: Capturamos el estado de error del proveedor
    refetchPets,       // Parchado: Función para reintentar si falla la red
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

  // Accesibilidad: Atajos de teclado para flechas
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (latestMatch) {
        if (e.key === 'Escape' || e.key === 'Enter') dismissMatch();
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
            <div className="text-primary-500"><PawIcon size={32} /></div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-400 via-warm-400 to-primary-500 bg-clip-text text-transparent">
              PawsMatch
            </h1>
          </div>
          {matches.length > 0 && (
            <div className="flex items-center gap-1 text-friendly-400 text-sm font-semibold">
              <HeartIcon size={16} />
              <span>{matches.length}</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center pt-4 pb-8 px-4">
        <FilterBar 
          typeFilter={typeFilter} 
          setTypeFilter={setTypeFilter} 
          locationFilter={locationFilter} 
          setLocationFilter={setLocationFilter} 
        />

        <MatchesStrip matches={matches} />

        {/* Card Stack Container */}
        <div className="relative w-full max-w-[400px] aspect-[3/4] mb-6" id="card-stack">
          
          {/* 1. ESTADO: CARGANDO */}
          {isLoading && <SkeletonCard />}

          {/* 2. ESTADO: ERROR (Parchado del punto de Error Handling) */}
          {!isLoading && error && (
            <div className="pet-card flex items-center justify-center bg-surface-card border border-red-500/30" id="error-state">
              <div className="text-center p-8">
                <div className="text-red-400 mb-3 flex justify-center">
                  <AlertIcon size={48} />
                </div>
                <h3 className="text-lg font-bold text-stone-200 mb-2">Hubo un problema de conexión</h3>
                <p className="text-stone-400 text-sm mb-5">
                  No pudimos cargar los perfiles de las mascotas. Revisa tu internet.
                </p>
                <button 
                  onClick={() => refetchPets?.()} 
                  className="px-5 py-2 bg-gradient-to-r from-red-500 to-warm-500 hover:opacity-90 text-white font-semibold rounded-full transition-all text-sm shadow-md"
                >
                  Reintentar Conexión
                </button>
              </div>
            </div>
          )}

          {/* 3. ESTADO: FLUJO EXITOSO O EMPTY STATE */}
          {!isLoading && !error && (
            currentPet ? (
              <>
                {/* Background depth cards */}
                <div className="absolute inset-0 rounded-[var(--radius-card)] bg-surface-card opacity-30 scale-[0.92] translate-y-4" style={{ filter: 'blur(2px)' }} />
                <div className="absolute inset-0 rounded-[var(--radius-card)] bg-surface-elevated opacity-20 scale-[0.85] translate-y-8" style={{ filter: 'blur(4px)' }} />
                
                <PetCard 
                  key={currentPet.id} 
                  pet={currentPet} 
                  onSwipe={handleSwipe} 
                  swipeAnimation={swipeAnimation} 
                />
              </>
            ) : (
              <div className="pet-card flex items-center justify-center bg-surface-card" id="empty-state">
                <div className="text-center p-8">
                  <div className="text-5xl mb-4">🐾</div>
                  <h3 className="text-xl font-bold text-stone-300 mb-2">No more pets nearby</h3>
                  <p className="text-stone-500 text-sm mb-4">Try adjusting your filters or check back later!</p>
                  <button 
                    onClick={() => { setTypeFilter(undefined); setLocationFilter(''); }} 
                    className="px-5 py-2 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-full transition-all duration-200 text-sm" 
                    id="reset-filters-btn"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )
          )}
        </div>

        {/* Action Buttons (Solo visibles si hay una mascota válida en pantalla sin errores) */}
        {currentPet && !isLoading && !error && (
          <div className="flex items-center gap-5" id="action-buttons">
            <button 
              onClick={() => handleSwipe('left')} 
              className="action-btn action-btn-nope" 
              disabled={!!swipeAnimation} 
              id="nope-btn" 
              aria-label="Pass Pet"
            >
              <XIcon size={26} />
            </button>
            <button 
              onClick={() => handleSwipe('right')} 
              className="action-btn action-btn-like" 
              disabled={!!swipeAnimation} 
              id="like-btn" 
              aria-label="Like Pet"
            >
              <HeartIcon size={30} />
            </button>
            <button 
              onClick={() => handleSwipe('right')} 
              className="action-btn action-btn-super" 
              disabled={!!swipeAnimation} 
              id="super-like-btn" 
              aria-label="Super Like Pet"
            >
              <StarIcon size={22} />
            </button>
          </div>
        )}

        {currentPet && !isLoading && !error && (
          <p className="text-stone-600 text-xs mt-4 text-center">
            Use ← → arrow keys or drag to swipe
          </p>
        )}
      </main>

      {/* Match Modal */}
      {latestMatch && <MatchModal match={latestMatch} onDismiss={dismissMatch} />}

      {/* Hidden preload images (Parchado con inline styles estrictos de no-renderizado/no-layout-shift) */}
      <div style={{ display: 'none', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
        {preloadUrls.map((url) => (
          <img key={url} src={url} alt="" loading="eager" />
        ))}
      </div>
    </div>
  );
}