import { style, globalStyle, keyframes } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const slideUp = keyframes({
  from: {
    opacity: 0,
    transform: 'translateY(20px) scale(0.96)',
  },
  to: {
    opacity: 1,
    transform: 'translateY(0) scale(1)',
  },
});

const scalePop = keyframes({
  from: { transform: 'scale(0)' },
  to: { transform: 'scale(1)' },
});

export const modalOverlay = style({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.6)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  animation: `${fadeIn} 0.15s ease-out`,
});

export const saveModal = style({
  width: '420px',
  maxWidth: 'calc(100vw - 40px)',
  maxHeight: 'calc(100vh - 80px)',
  background: vars.bg.secondary,
  border: `1px solid ${vars.border.default}`,
  borderRadius: '16px',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
  overflow: 'hidden',
  animation: `${slideUp} 0.2s ease-out`,
});

export const modalHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '20px 24px',
  borderBottom: `1px solid ${vars.border.default}`,
  background: vars.bg.tertiary,
});

export const modalTitle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  fontSize: '16px',
  fontWeight: 600,
  color: vars.text.primary,
});

globalStyle(`${modalTitle} svg`, {
  color: vars.accent.default,
});

export const modalClose = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  background: 'transparent',
  border: 'none',
  borderRadius: '8px',
  color: vars.text.muted,
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  ':hover': {
    background: vars.bg.hover,
    color: vars.text.primary,
  },
});

export const modalBody = style({
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
});

export const formGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const formLabelRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const formLabel = style({
  fontSize: '13px',
  fontWeight: 600,
  color: vars.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
});

export const modalInput = style({
  padding: '12px 14px',
  fontSize: '14px',
});

export const btnNewCollection = style({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  padding: '4px 10px',
  background: 'transparent',
  border: `1px solid ${vars.border.default}`,
  borderRadius: '6px',
  fontSize: '12px',
  fontWeight: 500,
  color: vars.text.secondary,
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  ':hover': {
    background: vars.bg.hover,
    borderColor: vars.accent.default,
    color: vars.accent.default,
  },
});

globalStyle(`${btnNewCollection} svg`, {
  color: vars.accent.default,
});

export const newCollectionInline = style({
  display: 'flex',
  gap: '8px',
  marginBottom: '12px',
});

globalStyle(`${newCollectionInline} .${modalInput}`, {
  flex: 1,
  padding: '10px 12px',
});

export const collectionsList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  maxHeight: '200px',
  overflowY: 'auto',
  padding: '4px',
  margin: '-4px',
});

export const collectionOption = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 14px',
  background: vars.bg.primary,
  border: '1px solid transparent',
  borderRadius: '10px',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  ':hover': {
    background: vars.bg.tertiary,
    borderColor: vars.border.default,
  },
});

export const collectionOptionSelected = style({
  background: vars.accent.subtle,
  borderColor: vars.accent.default,
});

globalStyle(`${collectionOptionSelected} svg`, {
  color: vars.accent.default,
});

export const collectionRadio = style({
  width: '18px',
  height: '18px',
  border: `2px solid ${vars.border.default}`,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  transition: 'all 0.15s ease',
});

globalStyle(`${collectionOptionSelected} .${collectionRadio}`, {
  borderColor: vars.accent.default,
});

export const radioDot = style({
  width: '8px',
  height: '8px',
  background: vars.accent.default,
  borderRadius: '50%',
  animation: `${scalePop} 0.15s ease-out`,
});

globalStyle(`${collectionOption} svg`, {
  color: vars.text.muted,
  flexShrink: 0,
});

export const collectionOptionName = style({
  flex: 1,
  fontSize: '14px',
  fontWeight: 500,
  color: vars.text.primary,
});

export const collectionCount = style({
  fontSize: '12px',
  color: vars.text.muted,
  background: vars.bg.tertiary,
  padding: '2px 8px',
  borderRadius: '10px',
});

globalStyle(`${collectionOptionSelected} .${collectionCount}`, {
  background: 'rgba(6, 182, 212, 0.2)',
  color: vars.accent.default,
});

export const emptyCollections = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '12px',
  padding: '24px',
  color: vars.text.muted,
  textAlign: 'center',
});

export const btnCreateFirst = style({
  padding: '8px 16px',
  background: vars.accent.subtle,
  border: `1px solid ${vars.accent.default}`,
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: 500,
  color: vars.accent.default,
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  ':hover': {
    background: vars.accent.default,
    color: vars.accent.text,
  },
});

export const modalFooter = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '12px',
  padding: '16px 24px',
  borderTop: `1px solid ${vars.border.default}`,
  background: vars.bg.tertiary,
});

