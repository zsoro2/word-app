import { useState } from "react";
import { Folder, Plus, Pencil, Trash2, X, Check, Loader2 } from "lucide-react";
import type { FolderDocument, NewFolderType } from "../types";

interface FolderManagementProps {
  folders: FolderDocument[];
  onAddFolder: (folder: NewFolderType) => Promise<void>;
  onUpdateFolder: (id: string, folder: NewFolderType) => Promise<void>;
  onDeleteFolder: (id: string) => Promise<void>;
  onClose: () => void;
}

export default function FolderManagement({
  folders,
  onAddFolder,
  onUpdateFolder,
  onDeleteFolder,
  onClose,
}: FolderManagementProps) {
  const [newFolder, setNewFolder] = useState<NewFolderType>({
    name: "",
    color: "#6366F1",
  });
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<NewFolderType>({ name: "", color: "" });
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [isUpdatingFolder, setIsUpdatingFolder] = useState(false);
  const [deletingFolderId, setDeletingFolderId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolder.name.trim()) {
      setIsAddingFolder(true);
      setError("");
      try {
        await onAddFolder(newFolder);
        setNewFolder({ name: "", color: "#6366F1" });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add folder");
      } finally {
        setIsAddingFolder(false);
      }
    }
  };

  const handleEdit = (folder: FolderDocument) => {
    setEditingFolder(folder.$id);
    setEditForm({ name: folder.name, color: folder.color });
    setError("");
  };

  const handleUpdate = async (id: string) => {
    if (editForm.name.trim()) {
      setIsUpdatingFolder(true);
      setError("");
      try {
        await onUpdateFolder(id, editForm);
        setEditingFolder(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update folder");
      } finally {
        setIsUpdatingFolder(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this folder? All words in this folder will be moved to another folder."
      )
    ) {
      setDeletingFolderId(id);
      setError("");
      try {
        await onDeleteFolder(id);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete folder");
      } finally {
        setDeletingFolderId(null);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 sm:p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-800">Manage Folders</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={newFolder.name}
                onChange={(e) =>
                  setNewFolder({ ...newFolder, name: e.target.value })
                }
                placeholder="New folder name"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                disabled={isAddingFolder}
              />
              <div className="flex gap-2">
                <input
                  type="color"
                  value={newFolder.color}
                  onChange={(e) =>
                    setNewFolder({ ...newFolder, color: e.target.value })
                  }
                  className="w-14 h-10 p-1 border border-gray-300 rounded-md cursor-pointer"
                  disabled={isAddingFolder}
                />
                <button
                  type="submit"
                  disabled={isAddingFolder || !newFolder.name.trim()}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  {isAddingFolder ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Plus className="h-5 w-5" />
                  )}
                  Add Folder
                </button>
              </div>
            </div>
          </form>

          {folders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No folders yet. Create your first folder above.
            </div>
          ) : (
            <div className="space-y-3">
              {folders.map((folder) => (
                <div
                  key={folder.$id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  {editingFolder === folder.$id ? (
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                        disabled={isUpdatingFolder}
                      />
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={editForm.color}
                          onChange={(e) =>
                            setEditForm({ ...editForm, color: e.target.value })
                          }
                          className="w-14 h-10 p-1 border border-gray-300 rounded-md cursor-pointer"
                          disabled={isUpdatingFolder}
                        />
                        <button
                          onClick={() => handleUpdate(folder.$id)}
                          disabled={isUpdatingFolder}
                          className="p-2 text-green-600 hover:text-green-700 transition-colors disabled:opacity-50"
                        >
                          {isUpdatingFolder ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <Check className="h-5 w-5" />
                          )}
                        </button>
                        <button
                          onClick={() => setEditingFolder(null)}
                          className="p-2 text-gray-600 hover:text-gray-700 transition-colors"
                          disabled={isUpdatingFolder}
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <Folder
                          className="h-5 w-5"
                          style={{ color: folder.color }}
                        />
                        <span className="font-medium text-gray-800">
                          {folder.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(folder)}
                          className="p-2 text-gray-600 hover:text-gray-700 transition-colors"
                          disabled={deletingFolderId === folder.$id}
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(folder.$id)}
                          disabled={
                            deletingFolderId === folder.$id || folders.length === 1
                          }
                          className="p-2 text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
                          title={
                            folders.length === 1
                              ? "Cannot delete the last folder"
                              : "Delete folder"
                          }
                        >
                          {deletingFolderId === folder.$id ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <Trash2 className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
