// components/HouseSelector.tsx

'use client';

import React from 'react';
import Image from 'next/image';
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
        <div className={styles.logoWrapper}>
          <Image 
            src="/candidates/Alchemist PNG.png" 
            alt="Alchemist Academy Logo" 
            width={100} 
            height={100} 
            className={styles.logo}
          />
        </div>
        <h2 className={styles.title}>Alchemist Academy</h2>
        <p className={styles.subtitle}>Please select your House to begin voting</p>
        
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
          Select your official house. You can only vote for candidates within your own house for Captain and Vice Captain roles.
        </p>
      </div>
    </div>
  );
}
