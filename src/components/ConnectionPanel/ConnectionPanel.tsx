import { Component, createSignal, Show } from 'solid-js';
import { useConnection } from '../../stores/connections';
import { useCollections } from '../../stores/collections';
import './ConnectionPanel.css';

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

  const getStatusColor = () => {
    switch (state.status) {
      case 'connected': return 'success';
      case 'connecting': return 'warning';
      case 'error': return 'danger';
      default: return 'muted';
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
    <div class="connection-panel">
      <div class="connection-header">
        <div class="connection-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 11a9 9 0 0 1 9 9"></path>
            <path d="M4 4a16 16 0 0 1 16 16"></path>
            <circle cx="5" cy="19" r="1"></circle>
          </svg>
          <span>WebSocket Connection</span>
        </div>
        <div class={`connection-status badge badge-${getStatusColor()}`}>
          <span class="status-dot"></span>
          {getStatusText()}
        </div>
      </div>

      <div class="connection-form">
        <div class="url-input-group">
          <input
            type="text"
            class="input input-mono url-input"
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
              class="btn btn-primary connect-btn"
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
          <button class="btn btn-danger connect-btn" onClick={handleDisconnect}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            </svg>
            Disconnect
          </button>
        </Show>
      </div>

      <Show when={state.error}>
        <div class="connection-error">
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

