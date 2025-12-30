import { createContext, useContext, ParentComponent, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';

export type MessageFormat = 'json' | 'text' | 'binary';

export interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  format: MessageFormat;
  description?: string;
  variables?: TemplateVariable[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateVariable {
  name: string;
  defaultValue: string;
  description?: string;
}

export interface Collection {
  id: string;
  name: string;
  templates: MessageTemplate[];
  isExpanded: boolean;
}

export interface HistoryItem {
  url: string;
  lastUsed: Date;
}

interface CollectionsState {
  collections: Collection[];
  history: HistoryItem[];
}

interface CollectionsContextValue {
  state: CollectionsState;
  addCollection: (name: string) => void;
  removeCollection: (id: string) => void;
  renameCollection: (id: string, name: string) => void;
  toggleCollection: (id: string) => void;
  expandCollection: (id: string) => void;
  addTemplate: (collectionId: string, template: Omit<MessageTemplate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  removeTemplate: (collectionId: string, templateId: string) => void;
  updateTemplate: (collectionId: string, templateId: string, updates: Partial<MessageTemplate>) => void;
  addToHistory: (url: string) => void;
  clearHistory: () => void;
  resolveTemplate: (template: MessageTemplate, variables: Record<string, string>) => string;
  parseTemplateVariables: (content: string) => string[];
}

const STORAGE_KEY = 'wsup-collections';
const HISTORY_KEY = 'wsup-history';

const CollectionsContext = createContext<CollectionsContextValue>();

export const CollectionsProvider: ParentComponent = (props) => {
  const [state, setState] = createStore<CollectionsState>({
    collections: [],
    history: [],
  });

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const createDefaultCollections = () => [{
    id: generateId(),
    name: 'Examples',
    isExpanded: true,
    templates: [
      {
        id: generateId(),
        name: 'Hello World',
        content: '{"message": "Hello, World!"}',
        format: 'json' as MessageFormat,
        description: 'Simple hello world message',
        variables: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: generateId(),
        name: 'Echo with Variables',
        content: '{"action": "echo", "data": {"name": "{{name}}", "timestamp": "{{timestamp}}"}}',
        format: 'json' as MessageFormat,
        description: 'Echo message with template variables',
        variables: [
          { name: 'name', defaultValue: 'User', description: 'Your name' },
          { name: 'timestamp', defaultValue: new Date().toISOString(), description: 'Current timestamp' },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  }];

  // Load from localStorage on mount
  onMount(() => {
    try {
      const savedCollections = localStorage.getItem(STORAGE_KEY);
      if (savedCollections) {
        const parsed = JSON.parse(savedCollections);
        // Check if this is the old format (has 'connections' instead of 'templates')
        const isOldFormat = parsed.length > 0 && 'connections' in parsed[0];
        if (isOldFormat) {
          // Clear old format and use defaults
          localStorage.removeItem(STORAGE_KEY);
          setState('collections', createDefaultCollections());
        } else {
          // Convert date strings back to Date objects
          parsed.forEach((col: Collection) => {
            if (col.templates) {
              col.templates.forEach((tmpl: MessageTemplate) => {
                tmpl.createdAt = new Date(tmpl.createdAt);
                tmpl.updatedAt = new Date(tmpl.updatedAt);
              });
            } else {
              col.templates = [];
            }
          });
          setState('collections', parsed);
        }
      } else {
        // Create a default collection with example templates
        setState('collections', createDefaultCollections());
      }

      const savedHistory = localStorage.getItem(HISTORY_KEY);
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        parsed.forEach((item: HistoryItem) => {
          item.lastUsed = new Date(item.lastUsed);
        });
        setState('history', parsed);
      }
    } catch (err) {
      console.error('Failed to load collections:', err);
    }
  });

  const saveToStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.collections));
      localStorage.setItem(HISTORY_KEY, JSON.stringify(state.history));
    } catch (err) {
      console.error('Failed to save collections:', err);
    }
  };

  const addCollection = (name: string) => {
    const newCollection: Collection = {
      id: generateId(),
      name,
      templates: [],
      isExpanded: true,
    };
    setState('collections', (cols) => [...cols, newCollection]);
    saveToStorage();
  };

  const removeCollection = (id: string) => {
    setState('collections', (cols) => cols.filter((c) => c.id !== id));
    saveToStorage();
  };

  const renameCollection = (id: string, name: string) => {
    setState(
      'collections',
      (col) => col.id === id,
      'name',
      name
    );
    saveToStorage();
  };

  const toggleCollection = (id: string) => {
    setState(
      'collections',
      (col) => col.id === id,
      'isExpanded',
      (expanded) => !expanded
    );
  };

  const expandCollection = (id: string) => {
    setState(
      'collections',
      (col) => col.id === id,
      'isExpanded',
      true
    );
  };

  const addTemplate = (
    collectionId: string,
    template: Omit<MessageTemplate, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const now = new Date();
    const newTemplate: MessageTemplate = {
      ...template,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    setState(
      'collections',
      (col) => col.id === collectionId,
      'templates',
      (tmpls) => [...tmpls, newTemplate]
    );
    saveToStorage();
  };

  const removeTemplate = (collectionId: string, templateId: string) => {
    setState(
      'collections',
      (col) => col.id === collectionId,
      'templates',
      (tmpls) => tmpls.filter((t) => t.id !== templateId)
    );
    saveToStorage();
  };

  const updateTemplate = (
    collectionId: string,
    templateId: string,
    updates: Partial<MessageTemplate>
  ) => {
    setState(
      'collections',
      (col) => col.id === collectionId,
      'templates',
      (tmpl) => tmpl.id === templateId,
      (tmpl) => ({ ...tmpl, ...updates, updatedAt: new Date() })
    );
    saveToStorage();
  };

  const addToHistory = (url: string) => {
    setState('history', (hist) => {
      // Remove existing entry for this URL
      const filtered = hist.filter((h) => h.url !== url);
      // Add to beginning
      const newHist = [{ url, lastUsed: new Date() }, ...filtered];
      // Keep only last 20 items
      return newHist.slice(0, 20);
    });
    saveToStorage();
  };

  const clearHistory = () => {
    setState('history', []);
    saveToStorage();
  };

  // Parse template variables from content (e.g., {{variableName}})
  const parseTemplateVariables = (content: string): string[] => {
    const regex = /\{\{(\w+)\}\}/g;
    const variables: string[] = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      if (!variables.includes(match[1])) {
        variables.push(match[1]);
      }
    }
    return variables;
  };

  // Resolve template with variable values
  const resolveTemplate = (template: MessageTemplate, variables: Record<string, string>): string => {
    let content = template.content;
    for (const [key, value] of Object.entries(variables)) {
      content = content.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
    }
    return content;
  };

  const value: CollectionsContextValue = {
    state,
    addCollection,
    removeCollection,
    renameCollection,
    toggleCollection,
    expandCollection,
    addTemplate,
    removeTemplate,
    updateTemplate,
    addToHistory,
    clearHistory,
    resolveTemplate,
    parseTemplateVariables,
  };

  return (
    <CollectionsContext.Provider value={value}>
      {props.children}
    </CollectionsContext.Provider>
  );
};

export const useCollections = () => {
  const context = useContext(CollectionsContext);
  if (!context) {
    throw new Error('useCollections must be used within CollectionsProvider');
  }
  return context;
};
