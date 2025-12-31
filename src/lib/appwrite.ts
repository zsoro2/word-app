import { Account, Client, Databases, ID, Query } from "appwrite";
import type {
  NewWordType,
  NewFolderType,
  WordDocument,
  FolderDocument,
  LoginCredentials,
  SignupCredentials,
  User,
} from "../types";

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);

// Database and collection IDs - you'll set these in your .env file
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const FOLDERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_FOLDERS_COLLECTION_ID;
const WORDS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_WORDS_COLLECTION_ID;

// ============================================
// AUTH FUNCTIONS
// ============================================

export async function createAccount(credentials: SignupCredentials): Promise<User> {
  const { name, email, password } = credentials;
  
  // Create the account
  await account.create(ID.unique(), email, password, name);
  
  // Log them in automatically
  await account.createEmailPasswordSession(email, password);
  
  // Return the user
  const user = await account.get();
  return {
    $id: user.$id,
    name: user.name,
    email: user.email,
  };
}

export async function login(credentials: LoginCredentials): Promise<User> {
  const { email, password } = credentials;
  
  await account.createEmailPasswordSession(email, password);
  
  const user = await account.get();
  return {
    $id: user.$id,
    name: user.name,
    email: user.email,
  };
}

export async function logout(): Promise<void> {
  await account.deleteSession("current");
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const user = await account.get();
    return {
      $id: user.$id,
      name: user.name,
      email: user.email,
    };
  } catch {
    return null;
  }
}

export async function updateUserName(name: string): Promise<User> {
  const user = await account.updateName(name);
  return {
    $id: user.$id,
    name: user.name,
    email: user.email,
  };
}

// ============================================
// FOLDER FUNCTIONS
// ============================================

export async function getFolders(userId: string): Promise<FolderDocument[]> {
  const response = await databases.listDocuments(
    DATABASE_ID,
    FOLDERS_COLLECTION_ID,
    [Query.equal("userId", userId), Query.orderDesc("$createdAt"), Query.limit(9999)]
  );
  return response.documents as unknown as FolderDocument[];
}

export async function createFolder(
  folder: NewFolderType,
  userId: string
): Promise<FolderDocument> {
  const response = await databases.createDocument(
    DATABASE_ID,
    FOLDERS_COLLECTION_ID,
    ID.unique(),
    {
      ...folder,
      userId,
    }
  );
  return response as unknown as FolderDocument;
}

export async function updateFolder(
  folderId: string,
  folder: NewFolderType
): Promise<FolderDocument> {
  const response = await databases.updateDocument(
    DATABASE_ID,
    FOLDERS_COLLECTION_ID,
    folderId,
    folder
  );
  return response as unknown as FolderDocument;
}

export async function deleteFolder(folderId: string): Promise<void> {
  await databases.deleteDocument(DATABASE_ID, FOLDERS_COLLECTION_ID, folderId);
}

// ============================================
// WORD FUNCTIONS
// ============================================

export async function getWords(userId: string): Promise<WordDocument[]> {
  const response = await databases.listDocuments(
    DATABASE_ID,
    WORDS_COLLECTION_ID,
    [Query.equal("userId", userId), Query.orderDesc("$createdAt"), Query.limit(9999)]
  );
  return response.documents as unknown as WordDocument[];
}

export async function getWordsByFolder(
  userId: string,
  folderId: string
): Promise<WordDocument[]> {
  const response = await databases.listDocuments(
    DATABASE_ID,
    WORDS_COLLECTION_ID,
    [
      Query.equal("userId", userId),
      Query.equal("folderId", folderId),
      Query.orderDesc("$createdAt"),
      Query.limit(9999),
    ]
  );
  return response.documents as unknown as WordDocument[];
}

export async function createWord(
  word: NewWordType,
  userId: string
): Promise<WordDocument> {
  const response = await databases.createDocument(
    DATABASE_ID,
    WORDS_COLLECTION_ID,
    ID.unique(),
    {
      ...word,
      userId,
    }
  );
  return response as unknown as WordDocument;
}

export async function updateWord(
  wordId: string,
  word: Partial<NewWordType>
): Promise<WordDocument> {
  const response = await databases.updateDocument(
    DATABASE_ID,
    WORDS_COLLECTION_ID,
    wordId,
    word
  );
  return response as unknown as WordDocument;
}

export async function deleteWord(wordId: string): Promise<void> {
  await databases.deleteDocument(DATABASE_ID, WORDS_COLLECTION_ID, wordId);
}

export async function moveWordsToFolder(
  userId: string,
  fromFolderId: string,
  toFolderId: string
): Promise<void> {
  const words = await getWordsByFolder(userId, fromFolderId);
  
  await Promise.all(
    words.map((word) =>
      databases.updateDocument(DATABASE_ID, WORDS_COLLECTION_ID, word.$id, {
        folderId: toFolderId,
      })
    )
  );
}

export { client, account, databases, ID };
