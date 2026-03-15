export interface Stop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

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
}
