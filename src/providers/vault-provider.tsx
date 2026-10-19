import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type {
  Collection,
  ItemInput,
  SavedItem,
  VaultData,
} from "@/domain/models";

const STORAGE_KEY = "@salvaqui/vault/v1";
const EMPTY_VAULT: VaultData = { version: 1, items: [], collections: [] };

type VaultContextValue = {
  data: VaultData;
  loading: boolean;
  loadFailed: boolean;
  error: string | null;
  addItem: (input: ItemInput) => string;
  updateItem: (id: string, input: ItemInput) => void;
  removeItem: (id: string) => void;
  toggleFavorite: (id: string) => void;
  addCollection: (name: string) => string;
  renameCollection: (id: string, name: string) => void;
  removeCollection: (id: string) => void;
  retrySave: () => void;
};

const VaultContext = createContext<VaultContextValue | null>(null);

function isVault(value: unknown): value is VaultData {
  if (!value || typeof value !== "object") return false;
  const data = value as Partial<VaultData>;
  return (
    data.version === 1 &&
    Array.isArray(data.items) &&
    Array.isArray(data.collections)
  );
}

export function VaultProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<VaultData>(EMPTY_VAULT);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveNonce, setSaveNonce] = useState(0);
  const writeQueue = useRef<Promise<void>>(Promise.resolve());
  const initialLoadFailed = useRef(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const parsed: unknown = raw === null ? EMPTY_VAULT : JSON.parse(raw);
        if (!isVault(parsed))
          throw new Error("Formato de dados não reconhecido");
        if (active) setData(parsed);
      } catch {
        // Never overwrite unreadable existing data with an empty vault.
        initialLoadFailed.current = true;
        if (active) setLoadFailed(true);
        if (active)
          setError(
            "Não foi possível carregar seus dados locais. Reinicie o aplicativo.",
          );
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (loading || initialLoadFailed.current) return;
    const snapshot = JSON.stringify(data);
    writeQueue.current = writeQueue.current
      .catch(() => undefined)
      .then(async () => {
        await AsyncStorage.setItem(STORAGE_KEY, snapshot);
        setError(null);
      })
      .catch(() => {
        setError(
          "Não foi possível salvar. Verifique o armazenamento e tente novamente.",
        );
      });
  }, [data, loading, saveNonce]);

  const addItem = useCallback((input: ItemInput) => {
    const id = Crypto.randomUUID();
    const now = new Date().toISOString();
    const item: SavedItem = {
      ...input,
      id,
      favorite: false,
      createdAt: now,
      updatedAt: now,
    };
    setData((current) => ({ ...current, items: [item, ...current.items] }));
    return id;
  }, []);

  const updateItem = useCallback((id: string, input: ItemInput) => {
    setData((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === id
          ? { ...item, ...input, updatedAt: new Date().toISOString() }
          : item,
      ),
    }));
  }, []);

  const removeItem = useCallback((id: string) => {
    setData((current) => ({
      ...current,
      items: current.items.filter((item) => item.id !== id),
    }));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setData((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === id
          ? {
              ...item,
              favorite: !item.favorite,
              updatedAt: new Date().toISOString(),
            }
          : item,
      ),
    }));
  }, []);

  const addCollection = useCallback((name: string) => {
    const id = Crypto.randomUUID();
    const collection: Collection = {
      id,
      name: name.trim(),
      createdAt: new Date().toISOString(),
    };
    setData((current) => ({
      ...current,
      collections: [...current.collections, collection],
    }));
    return id;
  }, []);

  const renameCollection = useCallback((id: string, name: string) => {
    setData((current) => ({
      ...current,
      collections: current.collections.map((collection) =>
        collection.id === id
          ? { ...collection, name: name.trim() }
          : collection,
      ),
    }));
  }, []);

  const removeCollection = useCallback((id: string) => {
    setData((current) => ({
      ...current,
      collections: current.collections.filter(
        (collection) => collection.id !== id,
      ),
      // Don't delete saved items: move them out of the removed collection.
      items: current.items.map((item) =>
        item.collectionId === id ? { ...item, collectionId: null } : item,
      ),
    }));
  }, []);

  return (
    <VaultContext.Provider
      value={{
        data,
        loading,
        loadFailed,
        error,
        addItem,
        updateItem,
        removeItem,
        toggleFavorite,
        addCollection,
        renameCollection,
        removeCollection,
        retrySave: () => setSaveNonce((n) => n + 1),
      }}
    >
      {children}
    </VaultContext.Provider>
  );
}

export function useVault() {
  const context = useContext(VaultContext);
  if (!context)
    throw new Error("useVault deve ser utilizado dentro de VaultProvider");
  return context;
}
