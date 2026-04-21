// lib/types.ts

export type Role = 'captain' | 'vice_captain' | 'school_prefect' | 'school_vice_prefect';
export type House = 'Yellow' | 'Green' | 'Blue' | 'Red';

export interface Candidate {
  id: string;
  name: string;
  house: House;
  role: Role;
  symbol: string; // emoji or image path
}

export type VoteCategory = 'school_prefect' | 'school_vice_prefect' | 'house_captain' | 'house_vice_captain';

export interface VotingState {
  voterId: string;
  voterHouse: House | null;
  votedIds: {
    school_prefect: string | null;
    school_vice_prefect: string | null;
    house_captain: string | null;
    house_vice_captain: string | null;
  };
}

export interface CandidateGroup {
  house: House;
  candidates: Candidate[];
}