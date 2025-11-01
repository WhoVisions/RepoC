import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

const isBrowser = typeof window !== 'undefined';
const STORAGE_TEST_KEY = '__persistent_chat_memory__';

type StorageFactory = () => Storage | null;

export type DefaultChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system' | string;
  content: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
};

export type ChatMessageInitializer<TMessage> =
  | TMessage[]
  | (() => TMessage[]);

export interface PersistentChatMemoryOptions<TMessage> {
  /**
   * Storage key to persist the chat memory. Defaults to a storage-specific key.
   */
  storageKey?: string;
  /**
   * Initial messages used when no stored value is present.
   */
  initialMessages?: ChatMessageInitializer<TMessage>;
  /**
   * Override the backing storage implementation.
   */
  storage?: Storage | null;
  /**
   * Disable persistence while keeping stateful behaviour.
   */
  disabled?: boolean;
  /**
   * Opt out of syncing updates across browser tabs.
   */
  syncTabs?: boolean;
  /**
   * Customiser for serialising chat messages before writing to storage.
   */
  serializer?: (messages: TMessage[]) => string;
  /**
   * Customiser for parsing chat messages read from storage.
   */
  parser?: (rawValue: string) => TMessage[];
}

export interface PersistentChatMemoryResult<TMessage> {
  messages: TMessage[];
  setMessages: Dispatch<SetStateAction<TMessage[]>>;
  appendMessage: (
    message: TMessage | ((previous: TMessage[]) => TMessage),
  ) => void;
  updateMessage: (
    matcher: (message: TMessage, index: number) => boolean,
    updater: (message: TMessage, index: number) => TMessage,
  ) => void;
  removeMessage: (
    matcher: (message: TMessage, index: number) => boolean,
  ) => void;
  replaceMessages: (
    next: TMessage[] | ((previous: TMessage[]) => TMessage[]),
  ) => void;
  clearMessages: () => void;
  reload: () => void;
  storageKey: string;
  isHydrated: boolean;
  error: Error | null;
  isStorageAvailable: boolean;
}

const defaultParser = <T,>(value: string): T => JSON.parse(value) as T;
const defaultSerializer = <T,>(value: T): string => JSON.stringify(value);

const ensureStorage = (storage: Storage | null | undefined): Storage | null => {
  if (!storage) return null;

  try {
    storage.setItem(STORAGE_TEST_KEY, STORAGE_TEST_KEY);
    storage.removeItem(STORAGE_TEST_KEY);
    return storage;
  } catch (error) {
    if (typeof console !== 'undefined') {
      console.warn('[usePersistentChatMemory] storage unavailable:', error);
    }
    return null;
  }
};

const getLocalStorage: StorageFactory = () => {
  if (!isBrowser) return null;
  return ensureStorage(window.localStorage);
};

const getSessionStorage: StorageFactory = () => {
  if (!isBrowser) return null;
  return ensureStorage(window.sessionStorage);
};

const resolveInitialMessages = <TMessage,>(
  initial?: ChatMessageInitializer<TMessage>,
): TMessage[] => {
  if (typeof initial === 'function') {
    const result = initial();
    return Array.isArray(result) ? [...result] : [];
  }

  return Array.isArray(initial) ? [...initial] : [];
};

const useInitialMessages = <TMessage,>(
  initial?: ChatMessageInitializer<TMessage>,
) => {
  const ref = useRef<TMessage[]>();

  if (!ref.current) {
    ref.current = resolveInitialMessages(initial);
  }

  return ref;
};

const createPersistentChatMemoryHook = (
  storageFactory: StorageFactory,
  defaultStorageKey: string,
) => {
  return function usePersistentChatMemory<TMessage = DefaultChatMessage>(
    options: PersistentChatMemoryOptions<TMessage> = {},
  ): PersistentChatMemoryResult<TMessage> {
    const {
      storageKey = defaultStorageKey,
      initialMessages,
      storage: storageOverride,
      disabled = false,
      syncTabs = true,
      parser: parserOverride,
      serializer: serializerOverride,
    } = options;

    const initialMessagesRef = useInitialMessages(initialMessages);

    const storage = useMemo(() => {
      if (disabled) return null;
      if (storageOverride) return ensureStorage(storageOverride);
      return storageFactory();
    }, [disabled, storageOverride]);

    const [messages, setMessages] = useState<TMessage[]>(
      initialMessagesRef.current ?? [],
    );
    const [isHydrated, setIsHydrated] = useState<boolean>(
      () => disabled || !storage,
    );
    const [error, setError] = useState<Error | null>(null);

    const parser = useMemo(
      () =>
        parserOverride ??
        ((value: string) => defaultParser<TMessage[]>(value)),
      [parserOverride],
    );

    const serializer = useMemo(
      () =>
        serializerOverride ??
        ((value: TMessage[]) => defaultSerializer(value)),
      [serializerOverride],
    );

    const handleError = useCallback((unknownError: unknown) => {
      const normalised =
        unknownError instanceof Error
          ? unknownError
          : new Error(String(unknownError));

      setError(normalised);

      if (typeof console !== 'undefined') {
        console.error('[usePersistentChatMemory] error:', normalised);
      }

      return normalised;
    }, []);

    const parseStored = useCallback(
      (rawValue: string | null) => {
        if (rawValue == null) {
          return undefined;
        }

        try {
          const parsed = parser(rawValue);
          setError(null);
          return Array.isArray(parsed) ? [...parsed] : undefined;
        } catch (innerError) {
          handleError(innerError);
          return undefined;
        }
      },
      [handleError, parser],
    );

    useEffect(() => {
      if (disabled) {
        setIsHydrated(true);
        return;
      }

      if (!storage) {
        setIsHydrated(true);
        return;
      }

      let cancelled = false;

      try {
        const storedValue = storage.getItem(storageKey);
        const parsed = parseStored(storedValue);

        if (!cancelled) {
          if (parsed !== undefined) {
            setMessages(parsed);
          } else if (storedValue == null && initialMessagesRef.current) {
            setMessages([...initialMessagesRef.current]);
          }
        }
      } catch (readError) {
        if (!cancelled) {
          handleError(readError);
        }
      } finally {
        if (!cancelled) {
          setIsHydrated(true);
        }
      }

      return () => {
        cancelled = true;
      };
    }, [disabled, handleError, initialMessagesRef, parseStored, storage, storageKey]);

    useEffect(() => {
      if (!storage || disabled || !isHydrated) {
        return;
      }

      try {
        const serialised = serializer(messages);
        storage.setItem(storageKey, serialised);
        setError(null);
      } catch (writeError) {
        handleError(writeError);
      }
    }, [disabled, handleError, isHydrated, messages, serializer, storage, storageKey]);

    useEffect(() => {
      if (!storage || disabled || !syncTabs || !isBrowser) {
        return;
      }

      const handleStorageEvent = (event: StorageEvent) => {
        if (event.storageArea !== storage) return;
        if (event.key !== storageKey) return;

        if (event.newValue == null) {
          setMessages([]);
          return;
        }

        const parsed = parseStored(event.newValue);
        if (parsed !== undefined) {
          setMessages(parsed);
        }
      };

      window.addEventListener('storage', handleStorageEvent);
      return () => window.removeEventListener('storage', handleStorageEvent);
    }, [disabled, parseStored, storage, storageKey, syncTabs]);

    const appendMessage = useCallback(
      (message: TMessage | ((previous: TMessage[]) => TMessage)) => {
        setMessages((previous) => [
          ...previous,
          typeof message === 'function'
            ? (message as (prev: TMessage[]) => TMessage)(previous)
            : message,
        ]);
      },
      [],
    );

    const updateMessage = useCallback(
      (
        matcher: (message: TMessage, index: number) => boolean,
        updater: (message: TMessage, index: number) => TMessage,
      ) => {
        setMessages((previous) =>
          previous.map((message, index) =>
            matcher(message, index) ? updater(message, index) : message,
          ),
        );
      },
      [],
    );

    const removeMessage = useCallback(
      (matcher: (message: TMessage, index: number) => boolean) => {
        setMessages((previous) =>
          previous.filter((message, index) => !matcher(message, index)),
        );
      },
      [],
    );

    const replaceMessages = useCallback(
      (next: TMessage[] | ((previous: TMessage[]) => TMessage[])) => {
        setMessages((previous) =>
          typeof next === 'function'
            ? (next as (prev: TMessage[]) => TMessage[])(previous)
            : next,
        );
      },
      [],
    );

    const clearMessages = useCallback(() => {
      setMessages([]);
    }, []);

    const reload = useCallback(() => {
      if (disabled) {
        setMessages(initialMessagesRef.current ?? []);
        setIsHydrated(true);
        return;
      }

      if (!storage) {
        setMessages(initialMessagesRef.current ?? []);
        setIsHydrated(true);
        return;
      }

      try {
        const storedValue = storage.getItem(storageKey);
        const parsed = parseStored(storedValue);

        if (parsed !== undefined) {
          setMessages(parsed);
        } else if (storedValue == null) {
          setMessages(initialMessagesRef.current ?? []);
        }

        setIsHydrated(true);
      } catch (readError) {
        handleError(readError);
      }
    }, [disabled, handleError, initialMessagesRef, parseStored, storage, storageKey]);

    return {
      messages,
      setMessages,
      appendMessage,
      updateMessage,
      removeMessage,
      replaceMessages,
      clearMessages,
      reload,
      storageKey,
      isHydrated,
      error,
      isStorageAvailable: Boolean(storage),
    };
  };
};

export const useLocalChatMemory = createPersistentChatMemoryHook(
  getLocalStorage,
  'chat:memory:local',
);

export const useSessionChatMemory = createPersistentChatMemoryHook(
  getSessionStorage,
  'chat:memory:session',
);

export { createPersistentChatMemoryHook };

