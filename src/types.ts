import type { Models } from "appwrite";

// Base types for creating new items (without Appwrite document fields)
export interface NewWordType {
  leftWord: string;
  leftExample: string;
  rightWord: string;
  rightExample: string;
  folderId: string;
}

export interface NewFolderType {
  name: string;
  color: string;
}

// Types with Appwrite document fields
export interface WordType extends NewWordType {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  userId: string;
}

export interface FolderType extends NewFolderType {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  userId: string;
}

// Appwrite document types
export type WordDocument = Models.Document & NewWordType & { userId: string };
export type FolderDocument = Models.Document & NewFolderType & { userId: string };

// User type
export interface User {
  $id: string;
  name: string;
  email: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}
