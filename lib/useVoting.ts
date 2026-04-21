// lib/useVoting.ts

'use client';

import { useState, useEffect } from 'react';
import { House, VoteCategory } from './types';

const VOTER_ID_KEY = 'school_voting_voter_id';
const VOTER_HOUSE_KEY = 'school_voting_house';

export function useVoting() {
  const [voterId, setVoterId] = useState<string>('');
  const [voterHouse, setVoterHouse] = useState<House | null>(null);
  const [votedIds, setVotedIds] = useState<Record<VoteCategory, string | null>>({
    school_prefect: null,
    school_vice_prefect: null,
    house_captain: null,
    house_vice_captain: null,
  });
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize on mount
  useEffect(() => {
    const initialize = async () => {
      const storedVoterId = localStorage.getItem(VOTER_ID_KEY);
      const storedHouse = localStorage.getItem(VOTER_HOUSE_KEY) as House | null;

      let currentVoterId = storedVoterId;
      if (!storedVoterId) {
        currentVoterId = `voter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem(VOTER_ID_KEY, currentVoterId);
      }
      setVoterId(currentVoterId!);
      setVoterHouse(storedHouse);

      // Fetch votes from backend
      try {
        const response = await fetch(`/api/vote?voterId=${currentVoterId}`);
        if (response.ok) {
          const data = await response.json();
          const votesMap = { ...votedIds };
          data.votes.forEach((v: any) => {
            if (v.category in votesMap) {
              votesMap[v.category as VoteCategory] = v.candidate_id;
            }
          });
          setVotedIds(votesMap);
        }
      } catch (error) {
        console.error('Failed to fetch votes:', error);
      }

      setIsInitialLoading(false);
    };

    initialize();
  }, []);

  const selectHouse = (house: House) => {
    localStorage.setItem(VOTER_HOUSE_KEY, house);
    setVoterHouse(house);
  };

  const submitVote = async (candidateId: string, category: VoteCategory) => {
    if (votedIds[category]) {
      console.warn('Already voted in this category');
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voterId, candidateId, category }),
      });

      if (response.ok) {
        setVotedIds(prev => ({
          ...prev,
          [category]: candidateId,
        }));
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to submit vote');
      }
    } catch (error) {
      console.error('Failed to submit vote:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetSystem = () => {
    localStorage.removeItem(VOTER_ID_KEY);
    localStorage.removeItem(VOTER_HOUSE_KEY);
    setVoterId(`voter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    setVoterHouse(null);
    setVotedIds({
      school_prefect: null,
      school_vice_prefect: null,
      house_captain: null,
      house_vice_captain: null,
    });
    localStorage.setItem(VOTER_ID_KEY, `voter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`); // Save new ID immediately
  };

  return {
    voterId,
    voterHouse,
    votedIds,
    isLoading: isInitialLoading,
    isSubmitting,
    selectHouse,
    submitVote,
    resetSystem,
  };
}