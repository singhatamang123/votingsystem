// app/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { CANDIDATES, groupCandidatesByHouse } from '@/lib/candidates';
import { useVoting } from '@/lib/useVoting';
import { HouseSection } from '@/components/HouseSection';
import { CandidateCard } from '@/components/CandidateCard';
import { HouseSelector } from '@/components/HouseSelector';
import { VoteCategory } from '@/lib/types';
import styles from './page.module.css';

export default function Home() {
  const { voterId, voterHouse, votedIds, isLoading, isSubmitting, selectHouse, submitVote, resetSystem } = useVoting();
  const [candidateGroups, setCandidateGroups] = useState(groupCandidatesByHouse(CANDIDATES));

  useEffect(() => {
    setCandidateGroups(groupCandidatesByHouse(CANDIDATES));
  }, []);

  const schoolPrefects = CANDIDATES.filter(c => c.role === 'school_prefect');
  const schoolVicePrefects = CANDIDATES.filter(c => c.role === 'school_vice_prefect');

  const handleVote = async (candidateId: string, category: VoteCategory) => {
    await submitVote(candidateId, category);
  };

  if (!voterHouse && !isLoading) {
    return <HouseSelector onSelect={selectHouse} />;
  }

  const totalVotesCast = Object.values(votedIds).filter(Boolean).length;

  // If all votes are cast, show the thank you screen
  if (totalVotesCast === 4 && !isSubmitting) {
    return (
      <main className={styles.main}>
        <div className={styles.thankYouContainer}>
          <div className={styles.thankYouCard}>
            <div className={styles.successIcon}>✓</div>
            <h1 className={styles.thankYouTitle}>Thank You for Voting!</h1>
            <p className={styles.thankYouText}>
              Your 4 votes have been successfully recorded in the system.
            </p>
            <div className={styles.divider}></div>
            <p className={styles.nextStudentNote}>
              Please call the next student and click the button below.
            </p>
            <button className={styles.resetButton} onClick={resetSystem}>
              Next Student →
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.heading}>🏛️ School House Elections</h1>
          <p className={styles.subtitle}>
            Welcome, <strong>{voterHouse} House</strong> student. You have {4 - totalVotesCast} {4 - totalVotesCast === 1 ? 'vote' : 'votes'} remaining.
          </p>
        </div>
      </header>

      {!isLoading ? (
        <div className={styles.container}>
          {/* School Wide Section */}
          <div className={styles.schoolSection}>
            <h2 className={styles.sectionTitle}>🎓 School Representatives</h2>

            <div className={styles.schoolSubSection}>
              <h3 className={styles.subTitle}>School Prefect</h3>
              <div className={styles.candidateGrid}>
                {schoolPrefects.map(candidate => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    isVoted={votedIds.school_prefect === candidate.id}
                    isLoading={isLoading || isSubmitting || !!votedIds.school_prefect}
                    onVote={(id) => handleVote(id, 'school_prefect')}
                  />
                ))}
              </div>
            </div>

            <div className={styles.schoolSubSection}>
              <h3 className={styles.subTitle}>School Vice Prefect</h3>
              <div className={styles.candidateGrid}>
                {schoolVicePrefects.map(candidate => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    isVoted={votedIds.school_vice_prefect === candidate.id}
                    isLoading={isLoading || isSubmitting || !!votedIds.school_vice_prefect}
                    onVote={(id) => handleVote(id, 'school_vice_prefect')}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className={styles.divider}></div>
          <h2 className={styles.sectionTitle}>🏠 House Representatives</h2>
          <p className={styles.sectionNote}>You can only vote for candidates in your own house ({voterHouse}).</p>

          {candidateGroups
            .filter(group => group.house === voterHouse)
            .map(group => (
              <HouseSection
                key={group.house}
                house={group.house}
                candidates={group.candidates}
                votedCaptainId={votedIds.house_captain}
                votedViceCaptainId={votedIds.house_vice_captain}
                isLoading={isLoading || isSubmitting}
                isStudentHouse={true}
                onVote={handleVote}
              />
            ))}
        </div>
      ) : (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Initializing election system...</p>
        </div>
      )}

      <footer className={styles.footer}>
        <p>© 2025 School House Elections. SQLite Secure Storage Active.</p>
        <div className={styles.footerLinks}>
          {voterId && <small className={styles.voterId}>Voter ID: {voterId.substring(0, 8)}... | House: {voterHouse}</small>}
        </div>
      </footer>
    </main>
  );
}