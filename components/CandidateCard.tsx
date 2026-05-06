// components/CandidateCard.tsx

'use client';

import React from 'react';
import Image from 'next/image';
import { Candidate, Role } from '@/lib/types';
import styles from './CandidateCard.module.css';

interface CandidateCardProps {
  candidate: Candidate;
  isVoted: boolean;
  isLoading: boolean;
  onVote: (id: string) => void;
}

const getRoleLabel = (role: Role): string => {
  const labels: Record<Role, string> = {
    captain: 'Captain',
    vice_captain: 'Vice Captain',
    school_prefect: 'School Prefect',
    school_vice_prefect: 'School Vice Prefect',
  };
  return labels[role];
};

export function CandidateCard({
  candidate,
  isVoted,
  isLoading,
  onVote,
}: CandidateCardProps) {
  return (
    <div className={`${styles.card} ${isVoted ? styles.votedCard : ''}`}>
      <div className={styles.avatarContainer}>
        {candidate.photo ? (
          <Image
            src={encodeURI(candidate.photo)}
            alt={candidate.name}
            width={160}
            height={160}
            className={styles.photo}
          />
        ) : (
          <span className={styles.symbol}>{candidate.symbol}</span>
        )}
        {isVoted && <div className={styles.votedOverlay}>✓</div>}
      </div>

      <div className={styles.content}>
        <h3 className={styles.name}>{candidate.name}</h3>
        <p className={styles.role}>{getRoleLabel(candidate.role)}</p>
      </div>

      <button
        className={`${styles.voteButton} ${isVoted ? styles.voted : ''}`}
        onClick={() => onVote(candidate.id)}
        disabled={isVoted || isLoading}
        title={isVoted ? 'You have already voted' : `Vote for ${candidate.name}`}
      >
        {isVoted ? '✓ Voted' : isLoading ? '...' : 'Vote'}
      </button>
    </div>
  );
}