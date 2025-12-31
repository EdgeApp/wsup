import { Component, createSignal, Show } from 'solid-js';
import { useConnection } from '../../stores/connections';
import { useCollections } from '../../stores/collections';
import * as styles from './ConnectionPanel.css';
import { btn, btnPrimary, btnDanger, input, inputMono, badge, badgeSuccess, badgeWarning, badgeDanger, badgeMuted } from '../../styles/global.css';

export const ConnectionPanel: Component = () => {
  const { state, connect, disconnect, setUrl } = useConnection();
  const { addToHistory } = useCollections();
  const [inputUrl, setInputUrl] = createSignal(state.url);

  const handleConnect = () => {
    const url = inputUrl().trim();
    if (!url) return;
    
    addToHistory(url);
    connect(url);
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && state.status === 'disconnected') {
      handleConnect();
    }
  };

  const getBadgeClass = () => {
    switch (state.status) {
      case 'connected': return badgeSuccess;
      case 'connecting': return badgeWarning;
      case 'error': return badgeDanger;
      default: return badgeMuted;
    }
  };

  const getStatusText = () => {
    switch (state.status) {
      case 'connected': return 'Connected';
      case 'connecting': return 'Connecting...';
      case 'error': return 'Error';
      default: return 'Disconnected';
    }
  };

  return (
    <div class={styles.connectionPanel}>
      <div class={styles.connectionHeader}>
        <div class={styles.connectionTitle}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 11a9 9 0 0 1 9 9"></path>
            <path d="M4 4a16 16 0 0 1 16 16"></path>
            <circle cx="5" cy="19" r="1"></circle>
          </svg>
          <span>WebSocket Connection</span>
        </div>
        <div class={`${styles.connectionStatus} ${badge} ${getBadgeClass()}`}>
          <span class={styles.statusDot}></span>
          {getStatusText()}
        </div>
      </div>

      <div class={styles.connectionForm}>
        <div class={styles.urlInputGroup}>
          <input
            type="text"
            class={`${input} ${inputMono} ${styles.urlInput}`}
            placeholder="wss://echo.websocket.org"
            value={inputUrl()}
            onInput={(e) => setInputUrl(e.currentTarget.value)}
            onKeyDown={handleKeyDown}
            disabled={state.status === 'connecting' || state.status === 'connected'}
          />
        </div>

        <Show
          when={state.status === 'connected' || state.status === 'connecting'}
          fallback={
            <button
              class={`${btn} ${btnPrimary} ${styles.connectBtn}`}
              onClick={handleConnect}
              disabled={!inputUrl().trim()}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              Connect
            </button>
          }
        >
          <button class={`${btn} ${btnDanger} ${styles.connectBtn}`} onClick={handleDisconnect}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            </svg>
            Disconnect
          </button>
        </Show>
      </div>

      <Show when={state.error}>
        <div class={styles.connectionError}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>{state.error}</span>
        </div>
      </Show>
    </div>
  );
};

