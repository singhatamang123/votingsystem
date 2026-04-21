// components/HouseSelector.tsx

'use client';

import React from 'react';
import { House } from '@/lib/types';
import styles from './HouseSelector.module.css';

interface HouseSelectorProps {
  onSelect: (house: House) => void;
}

export function HouseSelector({ onSelect }: HouseSelectorProps) {
  const houses: House[] = ['Yellow', 'Green', 'Blue', 'Red'];

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>🏠 Welcome to Elections</h2>
        <p className={styles.subtitle}>Please select your House to continue</p>
        
        <div className={styles.grid}>
          {houses.map(house => (
            <button
              key={house}
              className={`${styles.button} ${styles[house.toLowerCase()]}`}
              onClick={() => onSelect(house)}
            >
              <span className={styles.houseName}>{house} House</span>
            </button>
          ))}
        </div>
        
        <p className={styles.note}>
          Note: You can only vote for candidates in your own house for House Representation.
        </p>
      </div>
    </div>
  );
}
