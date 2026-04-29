export interface Stop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

export interface UserProfile {
  id: string;        // Firebase Auth UID
  name: string;
  handle: string;    // set once on account creation, never editable
  biography: string;
  profilePhoto: string;
}

// Used for mock event participants (walk attendees)
export interface User {
  id: string;
  name: string;
  surname: string;
  avatar: string;
  email: string;
}

export interface Photo {
  id: string;
  imageUrl: string;
}

export interface Walk {
  id: string;
  title: string;
  coverImage: string;
  location: string;
  description: string;
  date: string;
  stops: Stop[];
  participantUids: string[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  coverImage: string;
  participantsCount: number;
  stops: Stop[];
  participants: User[];
  photos?: Photo[];
  centerLatitude?: number;
  centerLongitude?: number;
}
