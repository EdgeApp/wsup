import type { Component } from 'solid-js';
import type { ThemeMode } from '../../App';
import * as styles from './ThemeToggle.css';

interface ThemeToggleProps {
  mode: ThemeMode;
  onModeChange: (mode: ThemeMode) => void;
}

const SunIcon = () => (
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
);

const MoonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);

const SystemIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
    <line x1="8" y1="21" x2="16" y2="21"></line>
    <line x1="12" y1="17" x2="12" y2="21"></line>
  </svg>
);

const modeLabels: Record<ThemeMode, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
};

export const ThemeToggle: Component<ThemeToggleProps> = (props) => {
  return (
    <div class={styles.themeToggle}>
      <button
        class={`${styles.themeOption} ${props.mode === 'light' ? styles.themeOptionActive : ''}`}
        onClick={() => props.onModeChange('light')}
        title="Light mode"
      >
        <SunIcon />
      </button>
      <button
        class={`${styles.themeOption} ${props.mode === 'system' ? styles.themeOptionActive : ''}`}
        onClick={() => props.onModeChange('system')}
        title="System preference"
      >
        <SystemIcon />
      </button>
      <button
        class={`${styles.themeOption} ${props.mode === 'dark' ? styles.themeOptionActive : ''}`}
        onClick={() => props.onModeChange('dark')}
        title="Dark mode"
      >
        <MoonIcon />
      </button>
      <span class={styles.themeToggleLabel}>{modeLabels[props.mode]}</span>
    </div>
  );
};

