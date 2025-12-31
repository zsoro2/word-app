import { useState } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import type { NewWordType, FolderDocument } from "../types";

interface AddWordFormProps {
  visible: boolean;
  onClose: () => void;
  onAddWord: (word: NewWordType) => Promise<void>;
  folders: FolderDocument[];
  defaultFolderId?: string;
}

export default function AddWordForm({
  visible,
  onClose,
  onAddWord,
  folders,
  defaultFolderId,
}: AddWordFormProps) {
  const [leftWord, setLeftWord] = useState("");
  const [leftExample, setLeftExample] = useState("");
  const [rightWord, setRightWord] = useState("");
  const [rightExample, setRightExample] = useState("");
  const [folderId, setFolderId] = useState(defaultFolderId || folders[0]?.$id || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (leftWord.trim() && rightWord.trim()) {
      setIsLoading(true);
      setError("");
      try {
        await onAddWord({
          leftWord,
          leftExample,
          rightWord,
          rightExample,
          folderId,
        });
        resetForm();
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add word");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const resetForm = () => {
    setLeftWord("");
    setLeftExample("");
    setRightWord("");
    setRightExample("");
    setFolderId(defaultFolderId || folders[0]?.$id || "");
    setError("");
  };

  if (!visible) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 animate-fadeIn">
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="leftWord"
              className="block text-gray-700 font-medium mb-2"
            >
              Left Word
            </label>
            <input
              id="leftWord"
              type="text"
              value={leftWord}
              onChange={(e) => setLeftWord(e.target.value)}
              placeholder="Enter word"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="rightWord"
              className="block text-gray-700 font-medium mb-2"
            >
              Right Word
            </label>
            <input
              id="rightWord"
              type="text"
              value={rightWord}
              onChange={(e) => setRightWord(e.target.value)}
              placeholder="Enter translation"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="leftExample"
              className="block text-gray-700 font-medium mb-2"
            >
              Left Example (Optional)
            </label>
            <input
              id="leftExample"
              type="text"
              value={leftExample}
              onChange={(e) => setLeftExample(e.target.value)}
              placeholder="Enter example sentence"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="rightExample"
              className="block text-gray-700 font-medium mb-2"
            >
              Right Example (Optional)
            </label>
            <input
              id="rightExample"
              type="text"
              value={rightExample}
              onChange={(e) => setRightExample(e.target.value)}
              placeholder="Enter example translation"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="folder"
            className="block text-gray-700 font-medium mb-2"
          >
            Folder
          </label>
          <select
            id="folder"
            value={folderId}
            onChange={(e) => setFolderId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
            disabled={isLoading}
          >
            {folders.map((folder) => (
              <option key={folder.$id} value={folder.$id}>
                {folder.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="flex items-center gap-1 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            disabled={isLoading}
          >
            <X className="h-5 w-5" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Plus className="h-5 w-5" />
            )}
            Add Word
          </button>
        </div>
      </form>
    </div>
  );
}
