import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from './theme.css';

// Reset
globalStyle('*', {
  margin: 0,
  padding: 0,
  boxSizing: 'border-box',
});

globalStyle('html, body, #root', {
  height: '100%',
  overflow: 'hidden',
});

globalStyle('body', {
  fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif",
  fontSize: '14px',
  lineHeight: 1.5,
  background: vars.bg.primary,
  color: vars.text.primary,
  transition: 'background-color 0.2s ease, color 0.2s ease',
});

globalStyle('code, pre, .mono', {
  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
});

globalStyle('button', {
  fontFamily: 'inherit',
  cursor: 'pointer',
  border: 'none',
  background: 'none',
});

globalStyle('input, textarea, select', {
  fontFamily: 'inherit',
  fontSize: 'inherit',
});

// Scrollbars
globalStyle('::-webkit-scrollbar', {
  width: '8px',
  height: '8px',
});

globalStyle('::-webkit-scrollbar-track', {
  background: 'transparent',
});

globalStyle('::-webkit-scrollbar-thumb', {
  background: vars.scrollbar.default,
  borderRadius: '4px',
});

globalStyle('::-webkit-scrollbar-thumb:hover', {
  background: vars.scrollbar.hover,
});

// App Layout
export const app = style({
  display: 'flex',
  height: '100vh',
  background: vars.bg.primary,
});

export const sidebar = style({
  width: '280px',
  minWidth: '280px',
  background: vars.bg.secondary,
  borderRight: `1px solid ${vars.border.default}`,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

export const sidebarFooter = style({
  padding: '16px',
  borderTop: `1px solid ${vars.border.default}`,
  marginTop: 'auto',
});

export const mainPanel = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  background: vars.bg.primary,
});

// Common Button Styles
export const btn = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  padding: '10px 20px',
  borderRadius: '8px',
  fontWeight: 500,
  fontSize: '14px',
  transition: 'all 0.15s ease',
});

export const btnPrimary = style({
  background: vars.accent.default,
  color: vars.accent.text,
  ':hover': {
    background: vars.accent.hover,
    transform: 'translateY(-1px)',
  },
  ':active': {
    transform: 'translateY(0)',
  },
});

export const btnSecondary = style({
  background: vars.bg.tertiary,
  color: vars.text.primary,
  border: `1px solid ${vars.border.default}`,
  ':hover': {
    background: vars.bg.hover,
    borderColor: vars.border.hover,
  },
});

export const btnDanger = style({
  background: vars.status.danger,
  color: 'white',
  ':hover': {
    background: vars.status.dangerHover,
  },
});

export const btnIcon = style({
  padding: '8px',
  borderRadius: '6px',
  background: 'transparent',
  color: vars.text.secondary,
  ':hover': {
    background: vars.bg.hover,
    color: vars.text.primary,
  },
});

// Input Styles
export const input = style({
  width: '100%',
  padding: '12px 16px',
  background: vars.input.bg,
  border: `1px solid ${vars.border.default}`,
  borderRadius: '8px',
  color: vars.text.primary,
  fontSize: '14px',
  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
  ':focus': {
    outline: 'none',
    borderColor: vars.accent.default,
    boxShadow: `0 0 0 3px ${vars.accent.glow}`,
  },
  '::placeholder': {
    color: vars.text.muted,
  },
});

export const inputMono = style({
  fontFamily: "'JetBrains Mono', monospace",
});

// Select Styles
export const select = style({
  appearance: 'none',
  padding: '10px 36px 10px 14px',
  background: vars.input.bg,
  border: `1px solid ${vars.border.default}`,
  borderRadius: '8px',
  color: vars.text.primary,
  fontSize: '13px',
  cursor: 'pointer',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  ':focus': {
    outline: 'none',
    borderColor: vars.accent.default,
  },
});

// Badge
export const badge = style({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '4px 10px',
  borderRadius: '20px',
  fontSize: '11px',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
});

export const badgeSuccess = style({
  background: vars.status.successBg,
  color: vars.status.success,
});

export const badgeWarning = style({
  background: vars.status.warningBg,
  color: vars.status.warning,
});

export const badgeDanger = style({
  background: vars.status.dangerBg,
  color: vars.status.danger,
});

export const badgeMuted = style({
  background: vars.bg.tertiary,
  color: vars.text.secondary,
});

// Section Headers
export const sectionHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 16px',
  fontSize: '11px',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.8px',
  color: vars.text.muted,
  flexShrink: 0,
});

