import { Component, createSignal, For, Show, onMount, createEffect } from 'solid-js';
import { Collection } from '../../stores/collections';
import * as styles from './SaveModal.css';
import { btn, btnPrimary, btnSecondary, input } from '../../styles/global.css';

interface SaveModalProps {
  isOpen: boolean;
  collections: Collection[];
  onSave: (collectionId: string, name: string) => void;
  onCancel: () => void;
  onCreateCollection?: (name: string) => void;
}

export const SaveModal: Component<SaveModalProps> = (props) => {
  const [selectedCollectionId, setSelectedCollectionId] = createSignal<string | null>(null);
  const [templateName, setTemplateName] = createSignal('Untitled');
  const [showNewCollection, setShowNewCollection] = createSignal(false);
  const [newCollectionName, setNewCollectionName] = createSignal('');
  
  let nameInputRef: HTMLInputElement | undefined;
  let newCollectionInputRef: HTMLInputElement | undefined;

  // Reset state and focus when modal opens
  createEffect(() => {
    if (props.isOpen) {
      setTemplateName('Untitled');
      setSelectedCollectionId(props.collections[0]?.id || null);
      setShowNewCollection(false);
      setNewCollectionName('');
      // Focus name input after render
      setTimeout(() => {
        nameInputRef?.focus();
        nameInputRef?.select();
      }, 50);
    }
  });

  const handleSave = () => {
    const collectionId = selectedCollectionId();
    const name = templateName().trim() || 'Untitled';
    if (collectionId) {
      props.onSave(collectionId, name);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      props.onCancel();
    } else if (e.key === 'Enter' && !showNewCollection()) {
      handleSave();
    }
  };

  const handleCreateCollection = () => {
    const name = newCollectionName().trim();
    if (name && props.onCreateCollection) {
      props.onCreateCollection(name);
      setNewCollectionName('');
      setShowNewCollection(false);
      // Select the newly created collection (it will be the last one)
      setTimeout(() => {
        const lastCollection = props.collections[props.collections.length - 1];
        if (lastCollection) {
          setSelectedCollectionId(lastCollection.id);
        }
      }, 50);
    }
  };

  const handleNewCollectionKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowNewCollection(false);
      setNewCollectionName('');
    } else if (e.key === 'Enter') {
      handleCreateCollection();
    }
  };

  return (
    <Show when={props.isOpen}>
      <div class={styles.modalOverlay} onClick={props.onCancel} onKeyDown={handleKeyDown}>
        <div class={styles.saveModal} onClick={(e) => e.stopPropagation()}>
          <div class={styles.modalHeader}>
            <div class={styles.modalTitle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
              <span>Save Message</span>
            </div>
            <button class={styles.modalClose} onClick={props.onCancel}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div class={styles.modalBody}>
            <div class={styles.formGroup}>
              <label class={styles.formLabel}>Name</label>
              <input
                ref={nameInputRef}
                type="text"
                class={`${input} ${styles.modalInput}`}
                value={templateName()}
                onInput={(e) => setTemplateName(e.currentTarget.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter a name for this message"
              />
            </div>

            <div class={styles.formGroup}>
              <div class={styles.formLabelRow}>
                <label class={styles.formLabel}>Collection</label>
                <Show when={!showNewCollection()}>
                  <button 
                    class={styles.btnNewCollection} 
                    onClick={() => {
                      setShowNewCollection(true);
                      setTimeout(() => newCollectionInputRef?.focus(), 0);
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    New
                  </button>
                </Show>
              </div>

              <Show when={showNewCollection()}>
                <div class={styles.newCollectionInline}>
                  <input
                    ref={newCollectionInputRef}
                    type="text"
                    class={`${input} ${styles.modalInput}`}
                    value={newCollectionName()}
                    onInput={(e) => setNewCollectionName(e.currentTarget.value)}
                    onKeyDown={handleNewCollectionKeyDown}
                    placeholder="Collection name"
                  />
                  <button 
                    class={`${btn} ${btnPrimary}`} 
                    onClick={handleCreateCollection}
                    disabled={!newCollectionName().trim()}
                  >
                    Create
                  </button>
                  <button 
                    class={`${btn} ${btnSecondary}`} 
                    onClick={() => {
                      setShowNewCollection(false);
                      setNewCollectionName('');
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </Show>

              <div class={styles.collectionsList}>
                <For each={props.collections}>
                  {(collection) => (
                    <div
                      class={`${styles.collectionOption} ${selectedCollectionId() === collection.id ? styles.collectionOptionSelected : ''}`}
                      onClick={() => setSelectedCollectionId(collection.id)}
                    >
                      <div class={styles.collectionRadio}>
                        <Show when={selectedCollectionId() === collection.id}>
                          <div class={styles.radioDot} />
                        </Show>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                      </svg>
                      <span class={styles.collectionOptionName}>{collection.name}</span>
                      <span class={styles.collectionCount}>{collection.templates.length}</span>
                    </div>
                  )}
                </For>
                
                <Show when={props.collections.length === 0}>
                  <div class={styles.emptyCollections}>
                    <span>No collections yet</span>
                    <button 
                      class={styles.btnCreateFirst}
                      onClick={() => {
                        setShowNewCollection(true);
                        setTimeout(() => newCollectionInputRef?.focus(), 0);
                      }}
                    >
                      Create your first collection
                    </button>
                  </div>
                </Show>
              </div>
            </div>
          </div>

          <div class={styles.modalFooter}>
            <button class={`${btn} ${btnSecondary}`} onClick={props.onCancel}>
              Cancel
            </button>
            <button 
              class={`${btn} ${btnPrimary}`} 
              onClick={handleSave}
              disabled={!selectedCollectionId()}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
              Save Message
            </button>
          </div>
        </div>
      </div>
    </Show>
  );
};

