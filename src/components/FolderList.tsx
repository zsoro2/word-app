import React from 'react';
import { Folder } from 'lucide-react';
import { FolderType } from '../types';

interface FolderListProps {
  folders: FolderType[];
  selectedFolder: string | null;
  onSelectFolder: (folderId: string | null) => void;
}

const FolderList: React.FC<FolderListProps> = ({ folders, selectedFolder, onSelectFolder }) => {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelectFolder(null)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors text-sm ${
            selectedFolder === null
              ? 'bg-gray-800 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Folder className="h-4 w-4" />
          All
        </button>
        {folders.map((folder) => (
          <button
            key={folder.id}
            onClick={() => onSelectFolder(folder.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors text-sm ${
              selectedFolder === folder.id
                ? 'text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            style={{
              backgroundColor: selectedFolder === folder.id ? folder.color : undefined,
            }}
          >
            <Folder className="h-4 w-4" />
            {folder.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FolderList;