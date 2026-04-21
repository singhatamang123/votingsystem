// lib/candidates.ts

import { Candidate } from './types';

export const CANDIDATES: Candidate[] = [
  // YELLOW HOUSE
  { id: 'y-c1', name: 'Aisha Patel', house: 'Yellow', role: 'captain', symbol: '🦁' },
  { id: 'y-c2', name: 'Zaid Khan', house: 'Yellow', role: 'captain', symbol: '🐆' },
  { id: 'y-vc1', name: 'Marco Silva', house: 'Yellow', role: 'vice_captain', symbol: '⭐' },
  { id: 'y-vc2', name: 'Nina Gupta', house: 'Yellow', role: 'vice_captain', symbol: '✨' },

  // GREEN HOUSE
  { id: 'g-c1', name: 'Sakura Yamamoto', house: 'Green', role: 'captain', symbol: '🌲' },
  { id: 'g-c2', name: 'Liam Wilson', house: 'Green', role: 'captain', symbol: '🌳' },
  { id: 'g-vc1', name: 'Hassan Ahmed', house: 'Green', role: 'vice_captain', symbol: '🌱' },
  { id: 'g-vc2', name: 'Elena Rossi', house: 'Green', role: 'vice_captain', symbol: '🌿' },

  // BLUE HOUSE
  { id: 'b-c1', name: 'Emma White', house: 'Blue', role: 'captain', symbol: '🌊' },
  { id: 'b-c2', name: 'Rajesh Kumar', house: 'Blue', role: 'captain', symbol: '🐋' },
  { id: 'b-vc1', name: 'Sophie Martin', house: 'Blue', role: 'vice_captain', symbol: '💧' },
  { id: 'b-vc2', name: 'Kenji Sato', house: 'Blue', role: 'vice_captain', symbol: '❄️' },

  // RED HOUSE
  { id: 'r-c1', name: 'Sofia Rodriguez', house: 'Red', role: 'captain', symbol: '🔥' },
  { id: 'r-c2', name: 'David Okafor', house: 'Red', role: 'captain', symbol: '☄️' },
  { id: 'r-vc1', name: 'Max Mueller', house: 'Red', role: 'vice_captain', symbol: '⚡' },
  { id: 'r-vc2', name: 'Isabella Rossi', house: 'Red', role: 'vice_captain', symbol: '❤️' },

  // SCHOOL WIDE
  { id: 'sp-1', name: 'Arjun Mehra', house: 'Blue', role: 'school_prefect', symbol: '👑' },
  { id: 'sp-2', name: 'Zoe Chen', house: 'Yellow', role: 'school_prefect', symbol: '📚' },
  { id: 'sp-3', name: 'Li Wei', house: 'Green', role: 'school_prefect', symbol: '🎓' },
  { id: 'sp-4', name: 'Sarah Jenkins', house: 'Red', role: 'school_prefect', symbol: '📝' },

  { id: 'svp-1', name: 'James Thompson', house: 'Red', role: 'school_vice_prefect', symbol: '🎯' },
  { id: 'svp-2', name: 'Luna Garcia', house: 'Green', role: 'school_vice_prefect', symbol: '🍀' },
  { id: 'svp-3', name: 'Rohan Sharma', house: 'Blue', role: 'school_vice_prefect', symbol: '🌟' },
  { id: 'svp-4', name: 'Anya Sokolov', house: 'Yellow', role: 'school_vice_prefect', symbol: '📜' },
];

export const groupCandidatesByHouse = (candidates: Candidate[]) => {
  const houses = ['Yellow', 'Green', 'Blue', 'Red'] as const;
  // Only group candidates who have house-specific roles
  const houseRoles = ['captain', 'vice_captain'];
  return houses.map(house => ({
    house,
    candidates: candidates.filter(c => c.house === house && houseRoles.includes(c.role)),
  }));
};