// lib/candidates.ts

import { Candidate } from './types';

export const CANDIDATES: Candidate[] = [

  // ─── SCHOOL PREFECT (2 candidates) ───────────────────────────
  { id: 'sp-1', name: 'Riya Lama',     house: 'Yellow', role: 'school_prefect',      symbol: '🌐', photo: '/candidates/Globe.png' },
  { id: 'sp-2', name: 'Roshni Tamang', house: 'Green',  role: 'school_prefect',      symbol: '📚', photo: '/candidates/Book.png' },

  // ─── SCHOOL VICE PREFECT (2 candidates) ─────────────────────
  { id: 'svp-1', name: 'Alisha Dhamala', house: 'Blue',   role: 'school_vice_prefect', symbol: '🧭', photo: '/candidates/Compass Rose.png' },
  { id: 'svp-2', name: 'Yunisha Sah',    house: 'Red',    role: 'school_vice_prefect', symbol: '⚖️', photo: '/candidates/Justice Scale.png' },

  // ─── RED HOUSE ───────────────────────────────────────────────
  // Captains (2)
  { id: 'r-c1',  name: 'Ujwal Acharya',   house: 'Red', role: 'captain',      symbol: '🔥', photo: '/candidates/Fireball.png' },
  { id: 'r-c2',  name: 'Syaron Thakuri',  house: 'Red', role: 'captain',      symbol: '🦅', photo: '/candidates/Phoenix.png' },
  // Vice Captains (3)
  { id: 'r-vc1', name: 'Sadikshya Magar', house: 'Red', role: 'vice_captain', symbol: '❤️', photo: '/candidates/Heart.png' },
  { id: 'r-vc2', name: 'Phurpi Tamang',   house: 'Red', role: 'vice_captain', symbol: '🐉', photo: '/candidates/Dragon.png' },
  { id: 'r-vc3', name: 'Yunika Diyali',   house: 'Red', role: 'vice_captain', symbol: '🌹', photo: '/candidates/Rose.png' },

  // ─── YELLOW HOUSE ────────────────────────────────────────────
  // Captains (2)
  { id: 'y-c1',  name: 'Bishanta Tamang', house: 'Yellow', role: 'captain',      symbol: '☀️', photo: '/candidates/Sun.png' },
  { id: 'y-c2',  name: 'Barsha Thapa',    house: 'Yellow', role: 'captain',      symbol: '⚡', photo: '/candidates/Thunder.png' },
  // Vice Captains (3)
  { id: 'y-vc1', name: 'Karina Tamang',   house: 'Yellow', role: 'vice_captain', symbol: '⭐', photo: '/candidates/Star.png' },
  { id: 'y-vc2', name: 'Nitesh Pandey',   house: 'Yellow', role: 'vice_captain', symbol: '💡', photo: '/candidates/Light Bulb.png' },
  { id: 'y-vc3', name: 'Kushi Chaudhary', house: 'Yellow', role: 'vice_captain', symbol: '🤝', photo: '/candidates/Handshake.png' },

  // ─── BLUE HOUSE ──────────────────────────────────────────────
  // Captains (2)
  { id: 'b-c1',  name: 'Shikha Lama',    house: 'Blue', role: 'captain',      symbol: '🌊', photo: '/candidates/Ocean Wave.png' },
  { id: 'b-c2',  name: 'Mingmar Tamang', house: 'Blue', role: 'captain',      symbol: '🔱', photo: '/candidates/Trident.png' },
  // Vice Captains (4)
  { id: 'b-vc1', name: 'Riya Adhikari',  house: 'Blue', role: 'vice_captain', symbol: '👑', photo: '/candidates/Crown.png' },
  { id: 'b-vc2', name: 'Deepak Magar',   house: 'Blue', role: 'vice_captain', symbol: '☁️', photo: '/candidates/Clouds.png' },
  { id: 'b-vc3', name: 'Mira Tamang',    house: 'Blue', role: 'vice_captain', symbol: '🐋', photo: '/candidates/Blue Whale.png' },
  { id: 'b-vc4', name: 'Lhamu Sikarmi',  house: 'Blue', role: 'vice_captain', symbol: '❄️', photo: '/candidates/Snow Flake.png' },

  // ─── GREEN HOUSE ─────────────────────────────────────────────
  // Captains (2)
  { id: 'g-c1',  name: 'Ajaya Lama',     house: 'Green', role: 'captain',      symbol: '🍃', photo: '/candidates/Leaf.png' },
  { id: 'g-c2',  name: 'Usha Moktan',    house: 'Green', role: 'captain',      symbol: '🌳', photo: '/candidates/Tree.png' },
  // Vice Captains (4)
  { id: 'g-vc1', name: 'Riya Dong',      house: 'Green', role: 'vice_captain', symbol: '🍀', photo: '/candidates/Clover.png' },
  { id: 'g-vc2', name: 'Anuska Khati',   house: 'Green', role: 'vice_captain', symbol: '🌱', photo: '/candidates/Seedling Plant.png' },
  { id: 'g-vc3', name: 'Nargish Khatun', house: 'Green', role: 'vice_captain', symbol: '🐟', photo: '/candidates/Koi Fish.png' },
  { id: 'g-vc4', name: 'Shiwani Tamang', house: 'Green', role: 'vice_captain', symbol: '♻️', photo: '/candidates/Recycle.png' },

];

export const groupCandidatesByHouse = (candidates: Candidate[]) => {
  const houses = ['Yellow', 'Green', 'Blue', 'Red'] as const;
  const houseRoles = ['captain', 'vice_captain'];
  return houses.map(house => ({
    house,
    candidates: candidates.filter(c => c.house === house && houseRoles.includes(c.role)),
  }));
};