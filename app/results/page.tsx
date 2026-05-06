// app/results/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './results.module.css';

export default function ResultsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch('/api/results');
        const results = await response.json();
        setData(results);
      } catch (error) {
        console.error('Failed to fetch results:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    localStorage.removeItem('school_voting_voter_id');
    localStorage.removeItem('school_voting_house');
    window.location.href = '/';
  };

  if (loading) return (
    <div className={styles.loading}>
      <div className={styles.spinner}></div>
      <p>Generating Official Report...</p>
    </div>
  );

  if (!data?.winners) return <div className={styles.error}>No results found.</div>;

  const { winners, allResults } = data;

  const getResultsByRole = (role: string, house?: string) => {
    return allResults
      .filter((c: any) => c.role === role && (!house || c.house === house))
      .sort((a: any, b: any) => b.voteCount - a.voteCount);
  };

  return (
    <main className={styles.main}>
      <div className={styles.reportSheet}>
        {/* Print Header */}
        <header className={styles.reportHeader}>
          <div className={styles.headerTop}>
            <Image 
              src="/candidates/Alchemist PNG.png" 
              alt="Alchemist Academy" 
              width={60} 
              height={60} 
            />
            <div className={styles.schoolInfo}>
              <h1 className={styles.schoolName}>Alchemist Academy</h1>
              <p className={styles.schoolLocation}>House Election 2026</p>
            </div>
          </div>
          <div className={styles.reportTitleRow}>
            <h2 className={styles.reportTitle}>OFFICIAL ELECTION RESULTS</h2>
            <p className={styles.timestamp}>Generated on: {new Date().toLocaleString()}</p>
          </div>
        </header>

        {/* 1. School Wide Results */}
        <section className={styles.section}>
          <h3 className={styles.sectionHeading}>🎓 School-Wide Representatives</h3>
          
          <div className={styles.tableWrapper}>
            <h4 className={styles.categoryTitle}>School Prefect</h4>
            <ResultTable candidates={getResultsByRole('school_prefect')} />
          </div>

          <div className={styles.tableWrapper}>
            <h4 className={styles.categoryTitle}>School Vice Prefect</h4>
            <ResultTable candidates={getResultsByRole('school_vice_prefect')} />
          </div>
        </section>

        {/* 2. House Results */}
        <section className={styles.section}>
          <h3 className={styles.sectionHeading}>🏠 House Representatives</h3>
          
          {['Yellow', 'Green', 'Blue', 'Red'].map((house, index) => (
            <div key={house} className={styles.houseBlock}>
              <h4 className={`${styles.houseTitle} ${styles[house.toLowerCase()]}`}>
                {house} House
              </h4>
              <div className={styles.houseGrids}>
                <div className={styles.tableWrapper}>
                  <h5 className={styles.roleTitle}>House Captain</h5>
                  <ResultTable candidates={getResultsByRole('captain', house)} />
                </div>
                <div className={styles.tableWrapper}>
                  <h5 className={styles.roleTitle}>House Vice Captain</h5>
                  <ResultTable candidates={getResultsByRole('vice_captain', house)} />
                </div>
              </div>
              
              {/* Only show signature block after the last house (Red) */}
              {house === 'Red' && (
                <div className={styles.reportFooterInner}>
                  <div className={styles.signatureSection}>
                    <div className={styles.sigBox}>
                      <div className={styles.sigLine}></div>
                      <p>School Principal</p>
                    </div>
                  </div>
                  <p className={styles.devNote}>Developed by Singha Tamang</p>
                </div>
              )}
            </div>
          ))}
        </section>
      </div>

      {/* Screen-only Controls */}
      <div className={styles.controls}>
        <button className={styles.backButton} onClick={handleBack}>
          ← Back to Voting
        </button>
        <button className={styles.printButton} onClick={handlePrint}>
          🖨️ Print Report (PDF)
        </button>
      </div>
    </main>
  );
}

function ResultTable({ candidates }: { candidates: any[] }) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.photoCol}>Symbol</th>
          <th>Candidate Name</th>
          <th>House</th>
          <th className={styles.countCol}>Vote Count</th>
        </tr>
      </thead>
      <tbody>
        {candidates.map((c, index) => (
          <tr key={c.id} className={index === 0 && c.voteCount > 0 ? styles.winnerRow : ''}>
            <td className={styles.symbolCell}>
              {c.photo ? (
                <div className={styles.candidatePhotoWrapper}>
                  <Image 
                    src={encodeURI(c.photo)} 
                    alt={c.name} 
                    width={40} 
                    height={40} 
                    className={styles.candidatePhoto} 
                  />
                </div>
              ) : (
                <span className={styles.emojiSymbol}>{c.symbol}</span>
              )}
            </td>
            <td>
              <span className={styles.candidateName}>{c.name}</span>
              {index === 0 && c.voteCount > 0 && <span className={styles.winnerBadge}>Winner</span>}
            </td>
            <td>{c.house}</td>
            <td className={styles.countCol}><strong>{c.voteCount}</strong></td>
          </tr>
        ))}
        {candidates.length === 0 && (
          <tr>
            <td colSpan={4} className={styles.noVotes}>No votes recorded</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
