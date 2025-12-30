import { createContext, useContext, ParentComponent, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';
export type MessageType = 'sent' | 'received';
export type MessageFormat = 'json' | 'text' | 'binary';

export interface Message {
  id: string;
  type: MessageType;
  content: string;
  format: MessageFormat;
  timestamp: Date;
  size: number;
}

export interface Connection {
  id: string;
  url: string;
  status: ConnectionStatus;
  error: string | null;
  messages: Message[];
  ws: WebSocket | null;
  createdAt: Date;
}

interface ConnectionsState {
  connections: Connection[];
  selectedId: string | null;
}

interface ConnectionContextValue {
  state: ConnectionsState;
  selectedConnection: () => Connection | undefined;
  addConnection: (url: string) => string;
  removeConnection: (id: string) => void;
  selectConnection: (id: string) => void;
  connect: (id: string) => void;
  disconnect: (id: string) => void;
  send: (message: string, format: MessageFormat) => void;
  clearMessages: (id?: string) => void;
  updateConnectionUrl: (id: string, url: string) => void;
}

const STORAGE_KEY = 'wsup-connections';

const ConnectionContext = createContext<ConnectionContextValue>();

export const ConnectionProvider: ParentComponent = (props) => {
  const [state, setState] = createStore<ConnectionsState>({
    connections: [],
    selectedId: null,
  });

  const generateId = () => Math.random().toString(36).substring(2, 9);

  // Load saved connections on mount (without WebSocket instances)
  onMount(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const connections = parsed.connections.map((conn: any) => ({
          ...conn,
          status: 'disconnected' as ConnectionStatus,
          error: null,
          messages: [],
          ws: null,
          createdAt: new Date(conn.createdAt),
        }));
        setState('connections', connections);
        if (parsed.selectedId && connections.find((c: Connection) => c.id === parsed.selectedId)) {
          setState('selectedId', parsed.selectedId);
        } else if (connections.length > 0) {
          setState('selectedId', connections[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load connections:', err);
    }
  });

  const saveToStorage = () => {
    try {
      const toSave = {
        connections: state.connections.map(conn => ({
          id: conn.id,
          url: conn.url,
          createdAt: conn.createdAt,
        })),
        selectedId: state.selectedId,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (err) {
      console.error('Failed to save connections:', err);
    }
  };

  const selectedConnection = () => {
    return state.connections.find(c => c.id === state.selectedId);
  };

  const addConnection = (url: string): string => {
    const id = generateId();
    const newConnection: Connection = {
      id,
      url,
      status: 'disconnected',
      error: null,
      messages: [],
      ws: null,
      createdAt: new Date(),
    };
    setState('connections', conns => [...conns, newConnection]);
    setState('selectedId', id);
    saveToStorage();
    return id;
  };

  const removeConnection = (id: string) => {
    const conn = state.connections.find(c => c.id === id);
    if (conn?.ws) {
      conn.ws.close();
    }
    setState('connections', conns => conns.filter(c => c.id !== id));
    
    // Select another connection if the removed one was selected
    if (state.selectedId === id) {
      const remaining = state.connections.filter(c => c.id !== id);
      setState('selectedId', remaining.length > 0 ? remaining[0].id : null);
    }
    saveToStorage();
  };

  const selectConnection = (id: string) => {
    setState('selectedId', id);
    saveToStorage();
  };

  const connect = (id: string) => {
    const connIndex = state.connections.findIndex(c => c.id === id);
    if (connIndex === -1) return;

    const conn = state.connections[connIndex];
    
    // Close existing connection if any
    if (conn.ws) {
      conn.ws.close();
    }

    setState('connections', connIndex, 'status', 'connecting');
    setState('connections', connIndex, 'error', null);

    try {
      const ws = new WebSocket(conn.url);

      ws.onopen = () => {
        const idx = state.connections.findIndex(c => c.id === id);
        if (idx !== -1) {
          setState('connections', idx, 'status', 'connected');
        }
      };

      ws.onmessage = (event) => {
        const idx = state.connections.findIndex(c => c.id === id);
        if (idx === -1) return;

        const isBinary = event.data instanceof Blob || event.data instanceof ArrayBuffer;
        let content = '';
        let format: MessageFormat = 'text';
        let size = 0;

        if (isBinary) {
          if (event.data instanceof Blob) {
            size = event.data.size;
            content = `Binary data (${size} bytes)`;
          } else {
            size = event.data.byteLength;
            content = `Binary data (${size} bytes)`;
          }
          format = 'binary';
        } else {
          content = event.data;
          size = new Blob([content]).size;
          try {
            JSON.parse(content);
            format = 'json';
          } catch {
            format = 'text';
          }
        }

        const message: Message = {
          id: generateId(),
          type: 'received',
          content,
          format,
          timestamp: new Date(),
          size,
        };

        setState('connections', idx, 'messages', msgs => [...msgs, message]);
      };

      ws.onerror = () => {
        const idx = state.connections.findIndex(c => c.id === id);
        if (idx !== -1) {
          setState('connections', idx, 'status', 'error');
          setState('connections', idx, 'error', 'Connection error occurred');
        }
      };

      ws.onclose = () => {
        const idx = state.connections.findIndex(c => c.id === id);
        if (idx !== -1) {
          const currentStatus = state.connections[idx].status;
          if (currentStatus !== 'error') {
            setState('connections', idx, 'status', 'disconnected');
          }
          setState('connections', idx, 'ws', null);
        }
      };

      setState('connections', connIndex, 'ws', ws);
    } catch (err) {
      setState('connections', connIndex, 'status', 'error');
      setState('connections', connIndex, 'error', err instanceof Error ? err.message : 'Failed to connect');
    }
  };

  const disconnect = (id: string) => {
    const connIndex = state.connections.findIndex(c => c.id === id);
    if (connIndex === -1) return;

    const conn = state.connections[connIndex];
    if (conn.ws) {
      conn.ws.close();
      setState('connections', connIndex, 'ws', null);
    }
    setState('connections', connIndex, 'status', 'disconnected');
  };

  const send = (message: string, format: MessageFormat) => {
    const conn = selectedConnection();
    if (!conn?.ws || conn.status !== 'connected') {
      return;
    }

    const connIndex = state.connections.findIndex(c => c.id === conn.id);
    if (connIndex === -1) return;

    try {
      if (format === 'json') {
        JSON.parse(message);
      }

      conn.ws.send(message);

      const msg: Message = {
        id: generateId(),
        type: 'sent',
        content: message,
        format,
        timestamp: new Date(),
        size: new Blob([message]).size,
      };

      setState('connections', connIndex, 'messages', msgs => [...msgs, msg]);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const clearMessages = (id?: string) => {
    const targetId = id || state.selectedId;
    if (!targetId) return;
    
    const connIndex = state.connections.findIndex(c => c.id === targetId);
    if (connIndex !== -1) {
      setState('connections', connIndex, 'messages', []);
    }
  };

  const updateConnectionUrl = (id: string, url: string) => {
    const connIndex = state.connections.findIndex(c => c.id === id);
    if (connIndex !== -1) {
      setState('connections', connIndex, 'url', url);
      saveToStorage();
    }
  };

  const value: ConnectionContextValue = {
    state,
    selectedConnection,
    addConnection,
    removeConnection,
    selectConnection,
    connect,
    disconnect,
    send,
    clearMessages,
    updateConnectionUrl,
  };

  return (
    <ConnectionContext.Provider value={value}>
      {props.children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = () => {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error('useConnection must be used within ConnectionProvider');
  }
  return context;
};
