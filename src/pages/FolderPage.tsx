import { Folder, Settings, Plus } from "lucide-react";
import type { FolderDocument } from "../types";

interface FolderPageProps {
  folders: FolderDocument[];
  onSelectFolder: (id: string | null) => void;
  onManageFolders: () => void;
}

export default function FolderPage({
  folders,
  onSelectFolder,
  onManageFolders,
}: FolderPageProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">Folders</h2>
        <button
          onClick={onManageFolders}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900"
        >
          <Settings className="h-4 w-4" />
          Manage Folders
        </button>
      </div>

      {folders.length === 0 ? (
        <div className="text-center py-12">
          <Folder className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No folders yet</h3>
          <p className="text-gray-500 mb-4">Create your first folder to organize your vocabulary.</p>
          <button
            onClick={onManageFolders}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Folder
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => onSelectFolder(null)}
            className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors text-left"
          >
            <Folder className="h-5 w-5 text-gray-800" />
            <div>
              <div className="font-medium text-gray-900">All Words</div>
              <div className="text-sm text-gray-500">View all vocabulary</div>
            </div>
          </button>

          {folders.map((folder) => (
            <button
              key={folder.$id}
              onClick={() => onSelectFolder(folder.$id)}
              className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors text-left"
            >
              <Folder className="h-5 w-5" style={{ color: folder.color }} />
              <div>
                <div className="font-medium text-gray-900">{folder.name}</div>
                <div className="text-sm text-gray-500">View words in folder</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
