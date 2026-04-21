// components/HouseSection.tsx

'use client';

import React from 'react';
import { House, Candidate, VoteCategory } from '@/lib/types';
import { CandidateCard } from './CandidateCard';
import styles from './HouseSection.module.css';

interface HouseSectionProps {
  house: House;
  candidates: Candidate[];
  votedCaptainId: string | null;
  votedViceCaptainId: string | null;
  isLoading: boolean;
  isStudentHouse: boolean;
  onVote: (id: string, category: VoteCategory) => void;
}

const houseColors: Record<House, string> = {
  Yellow: 'var(--house-yellow)',
  Green: 'var(--house-green)',
  Blue: 'var(--house-blue)',
  Red: 'var(--house-red)',
};

export function HouseSection({
  house,
  candidates,
  votedCaptainId,
  votedViceCaptainId,
  isLoading,
  isStudentHouse,
  onVote,
}: HouseSectionProps) {
  const captains = candidates.filter(c => c.role === 'captain');
  const viceCaptains = candidates.filter(c => c.role === 'vice_captain');

  return (
    <section className={`${styles.section} ${!isStudentHouse ? styles.disabled : ''}`}>
      <div className={styles.header}>
        <div
          className={styles.badge}
          style={{ '--house-color': houseColors[house] } as React.CSSProperties}
        >
          <h2 className={styles.title}>{house} House</h2>
          {!isStudentHouse && <p className={styles.restriction}>Not your house</p>}
        </div>
      </div>

      <div className={styles.rolesContainer}>
        {/* Captains Section */}
        <div className={styles.roleSubSection}>
          <div className={styles.roleHeader}>
            <h3 className={styles.roleTitle}>House Captain</h3>
            {isStudentHouse && votedCaptainId && <span className={styles.check}>✓ Cast</span>}
          </div>
          <div className={styles.grid}>
            {captains.map(candidate => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                isVoted={votedCaptainId === candidate.id}
                isLoading={isLoading || !!votedCaptainId || !isStudentHouse}
                onVote={(id) => onVote(id, 'house_captain')}
              />
            ))}
          </div>
        </div>

        {/* Vice Captains Section */}
        <div className={styles.roleSubSection}>
          <div className={styles.roleHeader}>
            <h3 className={styles.roleTitle}>House Vice Captain</h3>
            {isStudentHouse && votedViceCaptainId && <span className={styles.check}>✓ Cast</span>}
          </div>
          <div className={styles.grid}>
            {viceCaptains.map(candidate => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                isVoted={votedViceCaptainId === candidate.id}
                isLoading={isLoading || !!votedViceCaptainId || !isStudentHouse}
                onVote={(id) => onVote(id, 'house_vice_captain')}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}