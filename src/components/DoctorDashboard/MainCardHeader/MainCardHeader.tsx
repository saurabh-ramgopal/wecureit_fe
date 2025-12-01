import React from 'react';
import styles from './MainCardHeader.module.scss';

interface SetAvailabilityHeaderProps {
  title: string;
  subtitle?: string;
}

const MainCardHeader = ({ title, subtitle }: SetAvailabilityHeaderProps) => {
  return (
    <div className={styles['maincard-header']}>
      <div className={styles['maincard-header__text']}>
        <h2 className={styles['maincard-header__title']}>{title}</h2>
          {subtitle && (
      <p className={styles['maincard-header__subtitle']}>{subtitle}</p>
          )}
      </div>
    </div>
  );
};

export default MainCardHeader;
