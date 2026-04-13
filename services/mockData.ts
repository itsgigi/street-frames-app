import { Event, Stop, User, Photo } from '@/types';

// Mock stops for the next event
const mockStops: Stop[] = [
  {
    id: 'stop-1',
    name: 'Duomo di Milano',
    latitude: 45.4642,
    longitude: 9.1914,
  },
  {
    id: 'stop-2',
    name: 'Brera District',
    latitude: 45.4722,
    longitude: 9.1881,
  },
  {
    id: 'stop-3',
    name: 'Navigli Canals',
    latitude: 45.4508,
    longitude: 9.1714,
  },
  {
    id: 'stop-4',
    name: 'Porta Nuova',
    latitude: 45.4833,
    longitude: 9.1900,
  },
  {
    id: 'stop-5',
    name: 'Sforza Castle',
    latitude: 45.4709,
    longitude: 9.1791,
  },
];

// Mock users/participants
const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Marco',
    surname: 'Rossi',
    avatar: 'https://i.pravatar.cc/150?img=1',
    email: 'marco.rossi@example.com',
  },
  {
    id: 'user-2',
    name: 'Sofia',
    surname: 'Bianchi',
    avatar: 'https://i.pravatar.cc/150?img=2',
    email: 'sofia.bianchi@example.com',
  },
  {
    id: 'user-3',
    name: 'Luca',
    surname: 'Ferrari',
    avatar: 'https://i.pravatar.cc/150?img=3',
    email: 'luca.ferrari@example.com',
  },
  {
    id: 'user-4',
    name: 'Giulia',
    surname: 'Romano',
    avatar: 'https://i.pravatar.cc/150?img=4',
    email: 'giulia.romano@example.com',
  },
  {
    id: 'user-5',
    name: 'Alessandro',
    surname: 'Colombo',
    avatar: 'https://i.pravatar.cc/150?img=5',
    email: 'alessandro.colombo@example.com',
  },
];

// Mock photos
export const mockPhotos: Photo[] = [
  {
    id: 'photo-1',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400',
  },
  {
    id: 'photo-2',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
  },
  {
    id: 'photo-3',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400',
  },
  {
    id: 'photo-4',
    imageUrl: 'https://images.unsplash.com/photo-1508767815186-f4625a5e944e?w=400',
  },
  {
    id: 'photo-5',
    imageUrl: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400',
  },
  {
    id: 'photo-6',
    imageUrl: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400',
  },
];

// Next event (upcoming)
export const nextEvent: Event = {
  id: 'event-next',
  title: 'Brera Golden Hour',
  description: 'Join us for a beautiful golden hour photography session in the charming Brera district. Capture the warm light and beautiful architecture.',
  date: '2026-11-15T17:00:00Z',
  location: 'Brera District, Milan',
  coverImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
  participantsCount: 24,
  stops: mockStops,
  participants: mockUsers,
};

// Past events
export const pastEvents: Event[] = [
  {
    id: 'event-1',
    title: 'Navigli Night Walk',
    description: 'A beautiful evening capturing the canals and nightlife of Navigli.',
    date: '2026-10-12T19:00:00Z',
    location: 'Navigli, Milan',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    participantsCount: 18,
    stops: [],
    participants: [],
    centerLatitude: 45.4508,
    centerLongitude: 9.1714,
    photos: [
      { id: 'p1-1', imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400' },
      { id: 'p1-2', imageUrl: 'https://images.unsplash.com/photo-1508767815186-f4625a5e944e?w=400' },
    ],
  },
  {
    id: 'event-2',
    title: 'Duomo Architecture Study',
    description: 'Exploring the iconic Duomo and its architectural details.',
    date: '2026-09-28T10:00:00Z',
    location: 'Piazza del Duomo, Milan',
    coverImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800',
    participantsCount: 15,
    stops: [],
    participants: [],
    centerLatitude: 45.4642,
    centerLongitude: 9.1914,
    photos: [
      { id: 'p2-1', imageUrl: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400' },
      { id: 'p2-2', imageUrl: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400' },
    ],
  },
  {
    id: 'event-3',
    title: 'Galleria Silhouettes',
    description: 'Capturing the beautiful silhouettes and architecture of Galleria Vittorio Emanuele II.',
    date: '2026-09-05T14:00:00Z',
    location: 'Galleria Vittorio Emanuele II, Milan',
    coverImage: 'https://images.unsplash.com/photo-1508767815186-f4625a5e944e?w=800',
    participantsCount: 22,
    stops: [],
    participants: [],
    centerLatitude: 45.4654,
    centerLongitude: 9.1896,
    photos: [
      { id: 'p3-1', imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400' },
      { id: 'p3-2', imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400' },
    ],
  },
];

// Helper function to get event by ID
export const getEventById = (id: string): Event | undefined => {
  if (id === 'event-next') {
    return nextEvent;
  }
  return pastEvents.find(event => event.id === id);
};

// Helper function to get all events
export const getAllEvents = (): Event[] => {
  return [nextEvent, ...pastEvents];
};
