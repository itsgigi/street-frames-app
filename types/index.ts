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
  isVerified?: boolean;
}

export interface Photo {
  id: string;
  imageUrl: string;
}

export interface GalleryPhoto extends Photo {
  userId: string;
  walkId: string;
  storagePath?: string;
  createdAt?: string;
  tags: string[];
}

export interface Walk {
  id: string;
  title: string;
  coverImage: string;
  location: string;
  description: string;
  date: string;
  stops: Stop[];
  participantUIDs: string[];
  tags: string[];
}
