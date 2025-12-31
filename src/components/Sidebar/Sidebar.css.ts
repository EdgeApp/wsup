import { style, globalStyle, keyframes } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

const pulseConnecting = keyframes({
  '0%, 100%': { opacity: 1 },
  '50%': { opacity: 0.4 },
});

export const sidebarContent = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

export const sidebarHeader = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '16px',
  height: '61px',
  boxSizing: 'border-box',
  borderBottom: `1px solid ${vars.border.default}`,
  background: vars.bg.secondary,
  WebkitAppRegion: 'drag',
  // @ts-ignore
  appRegion: 'drag',
  userSelect: 'none',
});

export const windowControls = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  WebkitAppRegion: 'no-drag',
  // @ts-ignore
  appRegion: 'no-drag',
});

export const windowBtn = style({
  width: '12px',
  height: '12px',
  borderRadius: '50%',
  border: 'none',
  cursor: 'pointer',
  position: 'relative',
  transition: 'all 0.15s ease',
});

export const windowBtnIcon = style({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0,
  transition: 'opacity 0.1s ease',
});

globalStyle(`${windowControls}:hover .${windowBtnIcon}`, {
  opacity: 1,
});

export const windowBtnClose = style({
  background: '#ff5f57',
  ':hover': {
    background: '#ff3b30',
  },
});

globalStyle(`${windowBtnClose} .${windowBtnIcon}::before`, {
  content: '"×"',
  fontSize: '10px',
  fontWeight: 'bold',
  color: '#4a0002',
  lineHeight: 1,
});

export const windowBtnMinimize = style({
  background: '#febc2e',
  ':hover': {
    background: '#f5a623',
  },
});

globalStyle(`${windowBtnMinimize} .${windowBtnIcon}::before`, {
  content: '"−"',
  fontSize: '12px',
  fontWeight: 'bold',
  color: '#985700',
  lineHeight: 1,
  marginTop: '-2px',
});

export const windowBtnMaximize = style({
  background: '#28c840',
  ':hover': {
    background: '#1fb834',
  },
});

globalStyle(`${windowBtnMaximize} .${windowBtnIcon}::before`, {
  content: '"+"',
  fontSize: '10px',
  fontWeight: 'bold',
  color: '#006500',
  lineHeight: 1,
});

export const sidebarLogo = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

globalStyle(`${sidebarLogo} svg`, {
  color: vars.accent.default,
});

export const logoText = style({
  fontSize: '18px',
  fontWeight: 700,
  letterSpacing: '-0.5px',
  background: `linear-gradient(135deg, ${vars.accent.default} 0%, ${vars.msg.recvAccent} 100%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
});

export const newCollectionForm = style({
  padding: '12px 16px',
  borderBottom: `1px solid ${vars.border.default}`,
  background: vars.bg.tertiary,
});

globalStyle(`${newCollectionForm} .input`, {
  marginBottom: '8px',
});

export const formActions = style({
  display: 'flex',
  gap: '8px',
  justifyContent: 'flex-end',
});

export const btnSm = style({
  padding: '6px 12px',
  fontSize: '12px',
});

export const sidebarSection = style({
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

export const templatesSection = style({
  flex: 1,
});

export const sidebarSectionLast = style({
  flexShrink: 0,
  maxHeight: '200px',
  borderTop: `1px solid ${vars.border.default}`,
});

export const collectionsList = style({
  flex: 1,
  overflowY: 'auto',
  paddingBottom: '8px',
});

export const collection = style({
  borderBottom: `1px solid ${vars.border.default}`,
  ':last-child': {
    borderBottom: 'none',
  },
});

export const collectionHeader = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px 16px',
  cursor: 'pointer',
  transition: 'background 0.1s ease',
  ':hover': {
    background: vars.bg.hover,
  },
});

export const collectionChevron = style({
  transition: 'transform 0.15s ease',
  color: vars.text.muted,
});

export const collectionChevronExpanded = style({
  transform: 'rotate(90deg)',
});

globalStyle(`${collectionHeader} svg:not(.${collectionChevron})`, {
  color: vars.status.warning,
});

export const collectionName = style({
  flex: 1,
  fontSize: '13px',
  fontWeight: 500,
  color: vars.text.primary,
});

export const collectionCount = style({
  fontSize: '11px',
  color: vars.text.muted,
  background: vars.bg.tertiary,
  padding: '2px 6px',
  borderRadius: '10px',
});

export const collectionAddBtn = style({
  opacity: 0,
  padding: '4px',
  color: vars.text.muted,
  background: 'transparent',
  transition: 'all 0.1s ease',
  ':hover': {
    color: vars.accent.default,
    background: vars.bg.hover,
  },
});

globalStyle(`${collectionHeader}:hover .${collectionAddBtn}`, {
  opacity: 1,
});

export const collectionItems = style({
  padding: '4px 8px 8px 8px',
});

export const templateItem = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  padding: '10px 12px 10px 32px',
  margin: '2px 0',
  borderRadius: '6px',
  cursor: 'pointer',
  position: 'relative',
  transition: 'all 0.1s ease',
  ':hover': {
    background: vars.bg.hover,
  },
});

export const templateItemOpen = style({
  background: vars.accent.subtle,
});

globalStyle(`${templateItemOpen} .template-name`, {
  color: vars.accent.default,
});

export const templateItemSelected = style({
  background: vars.accent.subtle,
  border: `1px solid ${vars.accent.default}`,
  margin: '2px 0',
});

export const newTemplateItem = style({
  background: vars.accent.subtle,
  border: `1px solid ${vars.accent.default}`,
});

export const itemDelete = style({
  position: 'absolute',
  right: '8px',
  top: '50%',
  transform: 'translateY(-50%)',
  opacity: 0,
  padding: '4px',
  borderRadius: '4px',
  color: vars.text.muted,
  background: 'transparent',
  transition: 'all 0.1s ease',
  ':hover': {
    background: vars.status.dangerBg,
    color: vars.status.danger,
  },
});

globalStyle(`${templateItem}:hover .${itemDelete}, ${templateItemSelected} .${itemDelete}`, {
  opacity: 1,
});

export const templateInfo = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

export const templateName = style({
  fontSize: '13px',
  fontWeight: 500,
  color: vars.text.primary,
});

export const templateNameInput = style({
  flex: 1,
  minWidth: 0,
  padding: '4px 8px',
  background: vars.bg.secondary,
  border: `1px solid ${vars.border.default}`,
  borderRadius: '4px',
  fontSize: '13px',
  fontWeight: 500,
  color: vars.text.primary,
  ':focus': {
    outline: 'none',
    borderColor: vars.accent.default,
    background: vars.bg.tertiary,
  },
});

export const templateFormat = style({
  fontSize: '9px',
  fontWeight: 600,
  padding: '2px 5px',
  borderRadius: '3px',
  textTransform: 'uppercase',
  letterSpacing: '0.3px',
});

export const formatJson = style({
  background: 'rgba(34, 197, 94, 0.15)',
  color: vars.status.success,
});

export const formatText = style({
  background: 'rgba(6, 182, 212, 0.15)',
  color: vars.accent.default,
});

export const formatBinary = style({
  background: 'rgba(139, 92, 246, 0.15)',
  color: vars.msg.recvAccent,
});

export const templateVars = style({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: '10px',
  color: vars.text.muted,
});

export const addTemplateForm = style({
  padding: '10px 12px',
  margin: '4px 0 4px 20px',
  background: vars.bg.tertiary,
  borderRadius: '6px',
});

globalStyle(`${addTemplateForm} .input, ${addTemplateForm} .select`, {
  marginBottom: '8px',
  padding: '8px 12px',
  fontSize: '12px',
});

globalStyle(`${addTemplateForm} .select`, {
  width: '100%',
});

export const templateContentInput = style({
  minHeight: '60px',
  resize: 'vertical',
  fontSize: '11px !important' as any,
  lineHeight: 1.5,
});

export const templateHint = style({
  fontSize: '10px',
  color: vars.text.muted,
  marginBottom: '8px',
});

globalStyle(`${templateHint} code`, {
  background: vars.bg.secondary,
  padding: '2px 4px',
  borderRadius: '3px',
  fontFamily: "'JetBrains Mono', monospace",
  color: vars.accent.default,
});

export const addItemBtn = style({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  width: '100%',
  padding: '8px 12px 8px 32px',
  fontSize: '12px',
  color: vars.text.muted,
  background: 'transparent',
  borderRadius: '6px',
  transition: 'all 0.1s ease',
  ':hover': {
    background: vars.bg.hover,
    color: vars.accent.default,
  },
});

export const connectionsSection = style({
  flexShrink: 0,
});

export const connectionsList = style({
  flex: 1,
  overflowY: 'auto',
  padding: '0 8px 8px 8px',
});

export const newConnectionForm = style({
  padding: '8px',
  marginBottom: '4px',
});

globalStyle(`${newConnectionForm} .input`, {
  marginBottom: '8px',
  fontSize: '12px',
});

export const connectionItem = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '8px 10px',
  margin: '2px 0',
  borderRadius: '6px',
  cursor: 'pointer',
  transition: 'all 0.1s ease',
  border: '1px solid transparent',
  ':hover': {
    background: vars.bg.hover,
  },
});

export const connectionItemSelected = style({
  background: vars.bg.tertiary,
  borderColor: vars.accent.default,
});

export const connectionItemConnected = style({});

globalStyle(`${connectionItemConnected} .connection-url`, {
  color: vars.text.primary,
});

export const connectionInfo = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flex: 1,
  minWidth: 0,
});

export const connectionStatusDot = style({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  flexShrink: 0,
});

export const statusConnected = style({
  background: vars.status.success,
  boxShadow: `0 0 6px ${vars.status.success}`,
});

export const statusConnecting = style({
  background: vars.status.warning,
  animation: `${pulseConnecting} 1s ease-in-out infinite`,
});

export const statusError = style({
  background: vars.status.danger,
});

export const statusDisconnected = style({
  background: vars.text.muted,
  opacity: 0.5,
});

export const connectionUrl = style({
  fontSize: '12px',
  color: vars.text.muted,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

export const connectionActions = style({
  display: 'flex',
  gap: '4px',
  opacity: 0,
  transition: 'opacity 0.1s ease',
});

globalStyle(`${connectionItem}:hover .${connectionActions}, ${connectionItemSelected} .${connectionActions}`, {
  opacity: 1,
});

export const btnXs = style({
  padding: '4px',
  borderRadius: '4px',
});

export const btnDangerHover = style({
  ':hover': {
    background: vars.status.dangerBg,
    color: vars.status.danger,
  },
});

export const emptyState = style({
  padding: '24px 16px',
  textAlign: 'center',
  color: vars.text.muted,
  fontSize: '12px',
});

export const emptyCollection = style({
  padding: '16px 12px 16px 32px',
  fontSize: '12px',
  color: vars.text.muted,
  fontStyle: 'italic',
});

