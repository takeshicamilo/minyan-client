export enum PrayerType {
  SHACHARIT = 'SHACHARIT',
  MINCHA = 'MINCHA',
  MAARIV = 'MAARIV',
}

export enum ParticipantStatus {
  RSVP = 'RSVP',
  PRESENT = 'PRESENT',
}

export interface User {
  id: number;
  email: string;
  phone: string;
  createdAt: string;
}

export interface MinyanParticipant {
  id: number;
  user: User;
  status: ParticipantStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Minyan {
  id: number;
  organizer: User;
  prayerType: PrayerType;
  startTime: string;
  endTime: string;
  latitude: number;
  longitude: number;
  participants: MinyanParticipant[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateMinyanRequest {
  prayerType: PrayerType;
  startTime: string;
  endTime: string;
  latitude: number;
  longitude: number;
}

export interface GetNearbyMinyanimRequest {
  latitude: number;
  longitude: number;
  radius?: number;
}

export interface MinyanApiResponse {
  message: string;
  minyan?: Minyan;
  minyanim?: Minyan[];
  organized?: Minyan[];
  participating?: Minyan[];
}

export interface CreateMinyanResponse {
  message: string;
  minyan: Minyan;
}

export interface NearbyMinyanimResponse {
  message: string;
  minyanim: Minyan[];
}

export interface MyMinyanimResponse {
  message: string;
  organized: Minyan[];
  participating: Minyan[];
}
