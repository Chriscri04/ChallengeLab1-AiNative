import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

// Mock the petProvider to avoid real API calls
vi.mock('../petProvider', () => ({
  fetchRandomPet: vi.fn().mockResolvedValue({
    id: 'test-pet-1',
    name: 'Buddy',
    breed: 'Golden Retriever',
    age: '2 years',
    type: 'dog',
    location: 'New York, NY',
    bio: 'Loves belly rubs and long walks in the park.',
    personality: ['Playful', 'Friendly', 'Energetic'],
    imageUrl: 'https://example.com/dog.jpg',
    distance: '5 mi',
  }),
  fetchMultiplePets: vi.fn().mockResolvedValue([
    {
      id: 'test-pet-1',
      name: 'Buddy',
      breed: 'Golden Retriever',
      age: '2 years',
      type: 'dog',
      location: 'New York, NY',
      bio: 'Loves belly rubs and long walks in the park.',
      personality: ['Playful', 'Friendly', 'Energetic'],
      imageUrl: 'https://example.com/dog.jpg',
      distance: '5 mi',
    },
    {
      id: 'test-pet-2',
      name: 'Luna',
      breed: 'Persian',
      age: '3 years',
      type: 'cat',
      location: 'Los Angeles, CA',
      bio: 'Professional couch potato by day.',
      personality: ['Calm', 'Cuddly', 'Independent'],
      imageUrl: 'https://example.com/cat.jpg',
      distance: '3 mi',
    },
    {
      id: 'test-pet-3',
      name: 'Max',
      breed: 'Labrador',
      age: '1 year',
      type: 'dog',
      location: 'Chicago, IL',
      bio: 'Just a good boy looking for his best friend.',
      personality: ['Loyal', 'Gentle', 'Smart'],
      imageUrl: 'https://example.com/dog2.jpg',
      distance: '8 mi',
    },
    {
      id: 'test-pet-4',
      name: 'Charlie',
      breed: 'Beagle',
      age: '4 years',
      type: 'dog',
      location: 'Austin, TX',
      bio: 'Certified snuggle expert.',
      personality: ['Affectionate', 'Goofy', 'Social'],
      imageUrl: 'https://example.com/dog3.jpg',
      distance: '12 mi',
    },
    {
      id: 'test-pet-5',
      name: 'Thumper',
      breed: 'Holland Lop',
      age: '6 months',
      type: 'rabbit',
      location: 'Denver, CO',
      bio: 'Will trade puppy eyes for treats.',
      personality: ['Curious', 'Sweet', 'Shy'],
      imageUrl: 'https://example.com/rabbit.jpg',
      distance: '2 mi',
    },
  ]),
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the app header with PawsMatch branding', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('PawsMatch')).toBeInTheDocument();
    });
  });

  it('renders the app root element', async () => {
    render(<App />);
    await waitFor(() => {
      const appRoot = document.getElementById('app-root');
      expect(appRoot).toBeInTheDocument();
    });
  });

  it('shows a pet card after loading', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Buddy')).toBeInTheDocument();
    });
  });

  it('shows pet breed information', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Golden Retriever')).toBeInTheDocument();
    });
  });

  it('shows pet personality traits', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Playful')).toBeInTheDocument();
      expect(screen.getByText('Friendly')).toBeInTheDocument();
    });
  });

  it('renders action buttons', async () => {
    render(<App />);
    await waitFor(() => {
      const likeBtn = document.getElementById('like-btn');
      const nopeBtn = document.getElementById('nope-btn');
      expect(likeBtn).toBeInTheDocument();
      expect(nopeBtn).toBeInTheDocument();
    });
  });

  it('renders the filter toggle button', async () => {
    render(<App />);
    await waitFor(() => {
      const filterBtn = document.getElementById('filter-toggle-btn');
      expect(filterBtn).toBeInTheDocument();
    });
  });

  it('shows filter options when filter button is clicked', async () => {
    render(<App />);
    await waitFor(() => {
      const filterBtn = document.getElementById('filter-toggle-btn');
      expect(filterBtn).toBeInTheDocument();
    });

    const filterBtn = document.getElementById('filter-toggle-btn')!;
    fireEvent.click(filterBtn);

    await waitFor(() => {
      expect(screen.getByText('🐕 Dogs')).toBeInTheDocument();
      expect(screen.getByText('🐱 Cats')).toBeInTheDocument();
      expect(screen.getByText('🐰 Rabbits')).toBeInTheDocument();
      expect(screen.getByText('🐦 Birds')).toBeInTheDocument();
    });
  });

  it('renders the footer', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/Every pet deserves love/)).toBeInTheDocument();
    });
  });

  it('shows the bio section for the current pet', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('About Buddy')).toBeInTheDocument();
    });
  });
});
