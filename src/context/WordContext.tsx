import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import type { WordDocument, FolderDocument, NewWordType, NewFolderType } from "../types";
import {
  getWords,
  getFolders,
  createWord,
  createFolder,
  updateFolder,
  deleteFolder,
  deleteWord,
  moveWordsToFolder,
} from "../lib/appwrite";
import { useAuth } from "./AuthContext";

interface WordContextType {
  words: WordDocument[];
  folders: FolderDocument[];
  isLoading: boolean;
  error: string | null;
  showAddForm: boolean;
  showFolderManagement: boolean;
  setShowAddForm: (show: boolean) => void;
  setShowFolderManagement: (show: boolean) => void;
  handleAddWord: (word: NewWordType) => Promise<void>;
  handleDeleteWord: (wordId: string) => Promise<void>;
  handleShuffleWords: () => void;
  handleAddFolder: (folder: NewFolderType) => Promise<void>;
  handleUpdateFolder: (id: string, folder: NewFolderType) => Promise<void>;
  handleDeleteFolder: (id: string) => Promise<void>;
  getFilteredWords: (folderId: string | null) => WordDocument[];
  refreshData: () => Promise<void>;
}

const WordContext = createContext<WordContextType | undefined>(undefined);

export function WordProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [words, setWords] = useState<WordDocument[]>([]);
  const [folders, setFolders] = useState<FolderDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFolderManagement, setShowFolderManagement] = useState(false);

  const refreshData = useCallback(async () => {
    if (!user) {
      setWords([]);
      setFolders([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [fetchedWords, fetchedFolders] = await Promise.all([
        getWords(user.$id),
        getFolders(user.$id),
      ]);
      setWords(fetchedWords);
      setFolders(fetchedFolders);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    } else {
      setWords([]);
      setFolders([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, refreshData]);

  const handleAddWord = async (newWord: NewWordType) => {
    if (!user) return;

    try {
      const createdWord = await createWord(newWord, user.$id);
      setWords((prev) => [createdWord, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add word");
      throw err;
    }
  };

  const handleDeleteWord = async (wordId: string) => {
    try {
      await deleteWord(wordId);
      setWords((prev) => prev.filter((word) => word.$id !== wordId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete word");
      throw err;
    }
  };

  const handleShuffleWords = () => {
    setWords((prev) => {
      const newArray = [...prev];
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
      return newArray;
    });
  };

  const handleAddFolder = async (newFolder: NewFolderType) => {
    if (!user) return;

    try {
      const createdFolder = await createFolder(newFolder, user.$id);
      setFolders((prev) => [createdFolder, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add folder");
      throw err;
    }
  };

  const handleUpdateFolder = async (id: string, updatedFolder: NewFolderType) => {
    try {
      const updated = await updateFolder(id, updatedFolder);
      setFolders((prev) =>
        prev.map((folder) => (folder.$id === id ? updated : folder))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update folder");
      throw err;
    }
  };

  const handleDeleteFolder = async (id: string) => {
    if (!user) return;

    try {
      // Get the first folder to move words to (or create a "General" concept)
      const remainingFolders = folders.filter((f) => f.$id !== id);
      const targetFolderId = remainingFolders[0]?.$id;

      if (targetFolderId) {
        // Move words from deleted folder to first available folder
        await moveWordsToFolder(user.$id, id, targetFolderId);
        
        // Update local state for words
        setWords((prev) =>
          prev.map((word) =>
            word.folderId === id ? { ...word, folderId: targetFolderId } : word
          )
        );
      }

      await deleteFolder(id);
      setFolders((prev) => prev.filter((folder) => folder.$id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete folder");
      throw err;
    }
  };

  const getFilteredWords = (folderId: string | null) => {
    return folderId
      ? words.filter((word) => word.folderId === folderId)
      : words;
  };

  return (
    <WordContext.Provider
      value={{
        words,
        folders,
        isLoading,
        error,
        showAddForm,
        showFolderManagement,
        setShowAddForm,
        setShowFolderManagement,
        handleAddWord,
        handleDeleteWord,
        handleShuffleWords,
        handleAddFolder,
        handleUpdateFolder,
        handleDeleteFolder,
        getFilteredWords,
        refreshData,
      }}
    >
      {children}
    </WordContext.Provider>
  );
}

export function useWords() {
  const context = useContext(WordContext);
  if (context === undefined) {
    throw new Error("useWords must be used within a WordProvider");
  }
  return context;
}
