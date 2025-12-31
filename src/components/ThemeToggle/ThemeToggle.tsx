import { Component } from 'solid-js';
import * as styles from './ThemeToggle.css';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
}

export const ThemeToggle: Component<ThemeToggleProps> = (props) => {
  return (
    <button
      class={styles.themeToggle}
      onClick={props.onToggle}
      title={`Switch to ${props.theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <div class={styles.themeToggleTrack} data-theme={props.theme}>
        <span class={`${styles.themeToggleIcon} ${styles.sunIcon}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        </span>
        <span class={`${styles.themeToggleIcon} ${styles.moonIcon}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </span>
        <div class={styles.themeToggleThumb}></div>
      </div>
      <span class={styles.themeToggleLabel}>
        {props.theme === 'dark' ? 'Dark' : 'Light'} mode
      </span>
    </button>
  );
};

