import { useState } from "react";
import { Pencil, Trash2, Check, X, Loader2 } from "lucide-react";
import type { WordDocument, NewWordType } from "../types";

interface WordCardProps {
  word: WordDocument;
  hideTerms: boolean;
  hideDefinitions: boolean;
  isEditMode: boolean;
  onDelete: (wordId: string) => Promise<void>;
  onUpdate: (wordId: string, word: NewWordType) => Promise<void>;
}

export default function WordCard({
  word,
  hideTerms,
  hideDefinitions,
  isEditMode,
  onDelete,
  onUpdate,
}: WordCardProps) {
  const [revealTerm, setRevealTerm] = useState(false);
  const [revealDefinition, setRevealDefinition] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editForm, setEditForm] = useState<NewWordType>({
    leftWord: word.leftWord,
    leftExample: word.leftExample,
    rightWord: word.rightWord,
    rightExample: word.rightExample,
    folderId: word.folderId,
  });

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({
      leftWord: word.leftWord,
      leftExample: word.leftExample,
      rightWord: word.rightWord,
      rightExample: word.rightExample,
      folderId: word.folderId,
    });
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await onUpdate(word.$id, editForm);
      setIsEditing(false);
    } catch (err) {
      // Error handled by context
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Delete "${word.leftWord}"?`)) {
      setIsDeleting(true);
      try {
        await onDelete(word.$id);
      } catch (err) {
        // Error handled by context
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
      {isEditing ? (
        // Edit Mode
        <div className="grid grid-cols-[1fr_1fr_auto] gap-2 sm:gap-4 p-2 sm:p-4">
          {/* Left column - Term */}
          <div className="space-y-2">
            <input
              type="text"
              value={editForm.leftWord}
              onChange={(e) =>
                setEditForm({ ...editForm, leftWord: e.target.value })
              }
              placeholder="Term"
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
              disabled={isUpdating}
            />
            <input
              type="text"
              value={editForm.leftExample}
              onChange={(e) =>
                setEditForm({ ...editForm, leftExample: e.target.value })
              }
              placeholder="Example (optional)"
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
              disabled={isUpdating}
            />
          </div>

          {/* Right column - Definition */}
          <div className="space-y-2">
            <input
              type="text"
              value={editForm.rightWord}
              onChange={(e) =>
                setEditForm({ ...editForm, rightWord: e.target.value })
              }
              placeholder="Definition"
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
              disabled={isUpdating}
            />
            <input
              type="text"
              value={editForm.rightExample}
              onChange={(e) =>
                setEditForm({ ...editForm, rightExample: e.target.value })
              }
              placeholder="Example (optional)"
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
              disabled={isUpdating}
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-start gap-1">
            <button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="p-2 text-green-600 hover:text-green-700 transition-colors disabled:opacity-50"
              title="Save changes"
            >
              {isUpdating ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Check className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={handleCancel}
              className="p-2 text-gray-600 hover:text-gray-700 transition-colors"
              disabled={isUpdating}
              title="Cancel"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : (
        // Normal Mode
        <div className={`grid gap-2 sm:gap-4 ${isEditMode ? "grid-cols-[1fr_1fr_auto]" : "grid-cols-2"}`}>
          {/* Left column - Term */}
          <div
            onMouseDown={() => setRevealTerm(true)}
            onMouseUp={() => setRevealTerm(false)}
            onMouseLeave={() => setRevealTerm(false)}
            onTouchStart={() => setRevealTerm(true)}
            onTouchEnd={() => setRevealTerm(false)}
            className={`select-none cursor-pointer p-2 sm:p-4 transition-all duration-200 ${
              hideTerms && !revealTerm ? "blur-sm" : ""
            }`}
          >
            <h3 className="text-sm font-medium text-gray-900">
              {word.leftWord}
            </h3>
            {word.leftExample && (
              <p className="text-xs italic text-gray-500 mt-1">
                {word.leftExample}
              </p>
            )}
          </div>

          {/* Right column - Definition */}
          <div
            onMouseDown={() => setRevealDefinition(true)}
            onMouseUp={() => setRevealDefinition(false)}
            onMouseLeave={() => setRevealDefinition(false)}
            onTouchStart={() => setRevealDefinition(true)}
            onTouchEnd={() => setRevealDefinition(false)}
            className={`select-none cursor-pointer p-2 sm:p-4 transition-all duration-200 ${
              hideDefinitions && !revealDefinition ? "blur-sm" : ""
            }`}
          >
            <p className="text-sm font-medium text-gray-900">
              {word.rightWord}
            </p>
            {word.rightExample && (
              <p className="text-xs italic text-gray-500 mt-1">
                {word.rightExample}
              </p>
            )}
          </div>

          {/* Action buttons - only shown in edit mode */}
          {isEditMode && (
            <div className="flex items-start gap-1 p-2 sm:p-4">
              <button
                onClick={handleEdit}
                className="p-2 text-gray-600 hover:text-gray-700 transition-colors"
                disabled={isDeleting}
                title="Edit word"
              >
                <Pencil className="h-5 w-5" />
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-2 text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
                title="Delete word"
              >
                {isDeleting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Trash2 className="h-5 w-5" />
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
