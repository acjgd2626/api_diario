
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { AllJournals, FullJournalData, Journal, JournalEntry, MediaFile, MediaType, PersonalDiaryEntry } from '../types';
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY_SECRET = "una-frase-secreta-muy-larga-para-el-diario";

interface JournalContextType {
  journalData: FullJournalData | null;
  activeJournal: Journal | null;
  allJournals: AllJournals;

  createJournal: (name: string, password: string) => void;
  unlockJournal: (journalId: string, password: string) => boolean;
  lockJournal: () => void;
  setJournalPassword: (journalId: string, password: string) => void;

  updateEntry: (key: string, value: string) => void;
  addMedia: (key: string, file: File) => void;
  removeMedia: (key: string, mediaId: string) => void;
  addPersonalDiaryEntry: (entry: Omit<PersonalDiaryEntry, 'id'>) => void;
  updatePersonalDiaryEntry: (entry: PersonalDiaryEntry) => void;
  removePersonalDiaryEntry: (id: string) => void;


  isInitialized: boolean;
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

export const fileToMediaType = (file: File): MediaType | null => {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('audio/')) return 'audio';
  if (file.type.startsWith('video/')) return 'video';
  return null;
}

const DB_NAME = 'PregnancyJournalDB';
const DB_VERSION = 1;
const STORE_NAME = 'journals';

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const saveToIDB = async (key: string, data: any) => {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  tx.objectStore(STORE_NAME).put(data, key);
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
};

const getFromIDB = async (key: string): Promise<any> => {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const request = tx.objectStore(STORE_NAME).get(key);
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const encryptData = (data: FullJournalData, password: string): string => {
  const stringifiedData = JSON.stringify(data);
  return CryptoJS.AES.encrypt(stringifiedData, password + ENCRYPTION_KEY_SECRET).toString();
};

const decryptData = (encryptedData: string, password: string): FullJournalData | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, password + ENCRYPTION_KEY_SECRET);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedString) return null;
    return JSON.parse(decryptedString);
  } catch (e) {
    console.error("Decryption failed", e);
    return null;
  }
};


export const JournalProvider = ({ children }: { children: ReactNode }) => {
  const [allJournals, setAllJournals] = useState<AllJournals>({});
  const [activeJournalId, setActiveJournalId] = useState<string | null>(null);
  const [decryptedData, setDecryptedData] = useState<FullJournalData | null>(null);
  const [sessionPassword, setSessionPassword] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initData = async () => {
      try {
        // Intentar cargar desde IndexedDB primero
        const savedJournals = await getFromIDB('allJournals');
        if (savedJournals) {
          setAllJournals(savedJournals);
        } else {
          // Fallback a localStorage si IndexedDB está vacío
          const localJournals = localStorage.getItem('allPregnancyJournals_v3');
          if (localJournals) {
            const parsed = JSON.parse(localJournals);
            setAllJournals(parsed);
            await saveToIDB('allJournals', parsed);
          } else {
            // Migración desde v2
            const oldSavedJournals = localStorage.getItem('allPregnancyJournals_v2');
            if (oldSavedJournals) {
              const parsedOldJournals = JSON.parse(oldSavedJournals);
              const migratedJournals: AllJournals = {};
              for (const id in parsedOldJournals) {
                migratedJournals[id] = { ...parsedOldJournals[id], isEncrypted: false };
              }
              setAllJournals(migratedJournals);
              await saveToIDB('allJournals', migratedJournals);
              localStorage.removeItem('allPregnancyJournals_v2');
            }
          }
        }
      } catch (error) {
        console.error("Error al cargar datos del diario:", error);
      } finally {
        setIsInitialized(true);
      }
    };
    initData();
  }, []);

  useEffect(() => {
    if (isInitialized) {
      saveToIDB('allJournals', allJournals).catch(err => {
        console.error("Error al guardar en IndexedDB:", err);
        // Fallback a localStorage si falla IDB (aunque IDB es más confiable para datos grandes)
        try {
          localStorage.setItem('allPregnancyJournals_v3', JSON.stringify(allJournals));
        } catch (e) {
          console.warn("LocalStorage excedido, use IndexedDB.");
        }
      });
    }
  }, [allJournals, isInitialized]);

  const activeJournal = activeJournalId ? allJournals[activeJournalId] : null;

  const performJournalUpdate = (updateCallback: (journalData: FullJournalData) => FullJournalData) => {
    if (!activeJournalId || !sessionPassword || !decryptedData) return;
    const updatedData = updateCallback(decryptedData);
    setDecryptedData(updatedData);

    const encryptedData = encryptData(updatedData, sessionPassword);

    setAllJournals(prev => ({
      ...prev,
      [activeJournalId]: {
        ...prev[activeJournalId],
        data: encryptedData,
      }
    }));
  };

  const createJournal = (name: string, password: string) => {
    const newId = `journal-${Date.now()}`;
    if (!name.trim() || !password.trim()) {
      alert("El nombre y la contraseña no pueden estar vacíos.");
      return;
    }
    const initialData: FullJournalData = { pageEntries: {}, personalDiaryEntries: [] };
    const encryptedData = encryptData(initialData, password);

    const newJournal: Journal = {
      id: newId,
      name: name.trim(),
      isEncrypted: true,
      data: encryptedData
    };
    setAllJournals(prev => ({ ...prev, [newId]: newJournal }));
    setActiveJournalId(newId);
    setDecryptedData(initialData);
    setSessionPassword(password);
  };

  const unlockJournal = (journalId: string, password: string): boolean => {
    const journal = allJournals[journalId];
    if (!journal || typeof journal.data !== 'string') return false;

    const data = decryptData(journal.data, password);
    if (data) {
      setActiveJournalId(journalId);
      setDecryptedData(data);
      setSessionPassword(password);
      return true;
    }
    return false;
  };

  const setJournalPassword = (journalId: string, password: string) => {
    const journal = allJournals[journalId];
    if (!journal || journal.isEncrypted || typeof journal.data !== 'object') {
      alert('Este diario ya tiene contraseña o es inválido.');
      return;
    }
    const encryptedData = encryptData(journal.data, password);
    setAllJournals(prev => ({
      ...prev,
      [journalId]: { ...journal, isEncrypted: true, data: encryptedData }
    }));
    // Automatically unlock after setting password
    unlockJournal(journalId, password);
  }

  const lockJournal = () => {
    setActiveJournalId(null);
    setDecryptedData(null);
    setSessionPassword(null);
  };

  const updateEntry = (key: string, value: string) => {
    performJournalUpdate(currentData => ({
      ...currentData,
      pageEntries: {
        ...currentData.pageEntries,
        [key]: { ...currentData.pageEntries[key], text: value },
      }
    }));
  };

  const addMedia = (key: string, file: File) => {
    const mediaType = fileToMediaType(file);
    if (!mediaType) {
      alert('Tipo de archivo no soportado.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target?.result as string;
      if (base64Data) {
        const newMedia: MediaFile = {
          id: `${key}-${Date.now()}`,
          name: file.name,
          type: mediaType,
          data: base64Data,
        };
        performJournalUpdate(currentData => {
          const currentEntry = currentData.pageEntries[key] || { media: [] };
          const updatedMedia = [...(currentEntry.media || []), newMedia];
          return {
            ...currentData,
            pageEntries: {
              ...currentData.pageEntries,
              [key]: { ...currentEntry, media: updatedMedia },
            }
          };
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const removeMedia = (key: string, mediaId: string) => {
    performJournalUpdate(currentData => {
      const currentEntry = currentData.pageEntries[key];
      if (!currentEntry || !currentEntry.media) return currentData;
      const updatedMedia = currentEntry.media.filter(m => m.id !== mediaId);
      return {
        ...currentData,
        pageEntries: {
          ...currentData.pageEntries,
          [key]: { ...currentEntry, media: updatedMedia },
        },
      };
    });
  };

  const addPersonalDiaryEntry = (entry: Omit<PersonalDiaryEntry, 'id'>) => {
    const newEntry: PersonalDiaryEntry = {
      ...entry,
      id: `diary-${Date.now()}`,
      media: entry.media || [],
    };
    performJournalUpdate(currentData => ({
      ...currentData,
      personalDiaryEntries: [...currentData.personalDiaryEntries, newEntry]
    }));
  };

  const updatePersonalDiaryEntry = (updatedEntry: PersonalDiaryEntry) => {
    performJournalUpdate(currentData => ({
      ...currentData,
      personalDiaryEntries: currentData.personalDiaryEntries.map(entry =>
        entry.id === updatedEntry.id ? updatedEntry : entry
      )
    }));
  };

  const removePersonalDiaryEntry = (id: string) => {
    performJournalUpdate(currentData => ({
      ...currentData,
      personalDiaryEntries: currentData.personalDiaryEntries.filter(entry => entry.id !== id)
    }));
  };



  return (
    <JournalContext.Provider value={{
      journalData: decryptedData,
      activeJournal,
      allJournals,
      createJournal,
      unlockJournal,
      lockJournal,
      setJournalPassword,
      updateEntry,
      addMedia,
      removeMedia,
      addPersonalDiaryEntry,
      updatePersonalDiaryEntry,
      removePersonalDiaryEntry,

      isInitialized,
    }}>
      {children}
    </JournalContext.Provider>
  );
};

export const useJournal = (): JournalContextType => {
  const context = useContext(JournalContext);
  if (context === undefined) {
    throw new Error('useJournal debe ser usado dentro de un JournalProvider');
  }
  return context;
};
