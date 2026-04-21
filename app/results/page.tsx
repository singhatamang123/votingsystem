// app/results/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import styles from './results.module.css';

const CHART_COLORS = ['#fbbf24', '#6366f1', '#10b981', '#ef4444', '#8b5cf6', '#ec4899'];

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

  if (loading) return (
    <div className={styles.loading}>
      <div className={styles.spinner}></div>
      <p>Calculating official results...</p>
    </div>
  );

  if (!data?.winners) return <div className={styles.error}>No results found.</div>;

  const { winners, allResults } = data;

  const getChartData = (role: string, house?: string) => {
    return allResults
      .filter((c: any) => c.role === role && (!house || c.house === house))
      .map((c: any) => ({
        name: c.name,
        value: c.voteCount
      }))
      .filter((c: any) => c.value > 0);
  };

  const handleBack = () => {
    localStorage.removeItem('school_voting_voter_id');
    localStorage.removeItem('school_voting_house');
    window.location.href = '/';
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>🏆 Election Results 2025</h1>
          <p className={styles.subtitle}>Official Proclamation of the Student Government Representatives</p>
        </header>

        <section className={styles.hallOfFame}>
          {/* School Wide Winners */}
          <div className={styles.majorCategory}>
            <h2 className={styles.categoryTitle}>🎓 School-Wide Representatives</h2>
            <div className={styles.winnerGrid}>
              <div className={styles.winnerItem}>
                <WinnerCard label="School Prefect" candidate={winners.school_prefect} variant="gold" />
                <div className={styles.chartContainer}>
                  <ResultsChart data={getChartData('school_prefect')} title="Prefect Vote Distribution" />
                </div>
              </div>
              <div className={styles.winnerItem}>
                <WinnerCard label="School Vice Prefect" candidate={winners.school_vice_prefect} variant="silver" />
                <div className={styles.chartContainer}>
                  <ResultsChart data={getChartData('school_vice_prefect')} title="Vice Prefect Vote Distribution" />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.divider}></div>

          {/* House Winners */}
          <div className={styles.majorCategory}>
            <h2 className={styles.categoryTitle}>🏠 House Representatives</h2>
            
            <div className={styles.houseGroup}>
              {['Yellow', 'Green', 'Blue', 'Red'].map(house => (
                <div key={house} className={styles.houseSection}>
                  <h3 className={`${styles.houseTitle} ${styles[house.toLowerCase() + 'Text']}`}>
                    {house} House Results
                  </h3>
                  <div className={styles.winnerGrid}>
                    <div className={styles.winnerItem}>
                      <WinnerCard label="House Captain" candidate={winners.houses[house].captain} variant={house.toLowerCase()} />
                      <div className={styles.chartContainer}>
                        <ResultsChart data={getChartData('captain', house)} title="Captain Votes" small />
                      </div>
                    </div>
                    <div className={styles.winnerItem}>
                      <WinnerCard label="House Vice Captain" candidate={winners.houses[house].vice_captain} variant={house.toLowerCase()} />
                      <div className={styles.chartContainer}>
                        <ResultsChart data={getChartData('vice_captain', house)} title="Vice Captain Votes" small />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className={styles.footer}>
          <div className={styles.footerButtons}>
            <button className={styles.backButton} onClick={handleBack}>
              ← Back to Home
            </button>
            <button className={styles.printButton} onClick={handlePrint}>
              🖨️ Print Official Report
            </button>
          </div>
          <p className={styles.timestamp}>Report Generated: {new Date().toLocaleString()}</p>
        </footer>
      </div>
    </main>
  );
}

function ResultsChart({ data, title, small = false }: { data: any[], title: string, small?: boolean }) {
  if (data.length === 0) return <p className={styles.noData}>No votes recorded for this category.</p>;

  return (
    <div className={styles.chartWrapper}>
      <h4 className={styles.chartTitle}>{title}</h4>
      <ResponsiveContainer width="100%" height={small ? 200 : 250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={small ? 40 : 60}
            outerRadius={small ? 60 : 80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: 'white' }}
            itemStyle={{ color: 'white' }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function WinnerCard({ label, candidate, variant }: { label: string, candidate: any, variant: string }) {
  if (!candidate) return <div className={`${styles.winnerCard} ${styles[variant]}`}>No Candidate Selected</div>;

  return (
    <div className={`${styles.winnerCard} ${styles[variant]}`}>
      <div className={styles.cardHeader}>{label}</div>
      <div className={styles.symbol}>{candidate.symbol}</div>
      <div className={styles.winnerInfo}>
        <h3 className={styles.winnerName}>{candidate.name}</h3>
        <div className={styles.voteBadge}>
          {candidate.voteCount} Votes
        </div>
      </div>
    </div>
  );
}
