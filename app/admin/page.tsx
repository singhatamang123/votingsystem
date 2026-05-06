// app/admin/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import styles from './admin.module.css';

const ADMIN_SECRET = 'school-admin-2025';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [totalVotes, setTotalVotes] = useState<number | null>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_SECRET) {
      setIsAuthenticated(true);
      fetchStats();
    } else {
      setStatus({ type: 'error', message: 'Incorrect password. Please try again.' });
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`/api/admin/reset?secret=${ADMIN_SECRET}`);
      const data = await res.json();
      setTotalVotes(data.totalVotes);
    } catch {
      setTotalVotes(0);
    }
  };

  const handleReset = async () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }

    setIsLoading(true);
    setStatus(null);

    try {
      const res = await fetch('/api/admin/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: ADMIN_SECRET }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', message: data.message });
        setTotalVotes(0);
        setConfirmReset(false);
      } else {
        setStatus({ type: 'error', message: data.error });
      }
    } catch {
      setStatus({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className={styles.main}>
        <div className={styles.loginCard}>
          <div className={styles.lockIcon}>🔐</div>
          <h1 className={styles.title}>Admin Access</h1>
          <p className={styles.subtitle}>Enter the admin password to continue</p>

          <form onSubmit={handleLogin} className={styles.form}>
            <input
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={styles.input}
              autoFocus
            />
            <button type="submit" className={styles.loginButton}>
              Login →
            </button>
          </form>

          {status && <p className={styles.errorMsg}>{status.message}</p>}
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.adminCard}>
        <div className={styles.adminHeader}>
          <h1 className={styles.title}>⚙️ Admin Panel</h1>
          <p className={styles.subtitle}>Manage the election database</p>
        </div>

        <div className={styles.statBox}>
          <p className={styles.statLabel}>Total Votes in Database</p>
          <p className={styles.statNumber}>{totalVotes ?? '...'}</p>
          <button className={styles.refreshBtn} onClick={fetchStats}>↻ Refresh</button>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>🗑️ Reset All Votes</h2>
          <p className={styles.warning}>
            This will permanently delete <strong>ALL votes</strong> from the database.
            Use this before starting a new election. This action cannot be undone.
          </p>

          {confirmReset && (
            <div className={styles.confirmBox}>
              ⚠️ Are you absolutely sure? This will delete all <strong>{totalVotes}</strong> votes.
            </div>
          )}

          <button
            className={`${styles.resetBtn} ${confirmReset ? styles.confirmActive : ''}`}
            onClick={handleReset}
            disabled={isLoading}
          >
            {isLoading ? 'Resetting...' : confirmReset ? '⚠️ Confirm — Delete All Votes' : '🗑️ Reset Database'}
          </button>

          {confirmReset && (
            <button className={styles.cancelBtn} onClick={() => setConfirmReset(false)}>
              Cancel
            </button>
          )}
        </div>

        {status && (
          <div className={`${styles.statusMsg} ${styles[status.type]}`}>
            {status.type === 'success' ? '✓' : '✗'} {status.message}
          </div>
        )}

        <div className={styles.links}>
          <button className={styles.linkBtn} onClick={() => window.location.href = '/'}>← Home</button>
          <button className={styles.linkBtn} onClick={() => window.location.href = '/results'}>📊 Results</button>
        </div>

        <footer className={styles.adminFooter}>
          <p>Developed by Singha Tamang</p>
        </footer>
      </div>
    </main>
  );
}
