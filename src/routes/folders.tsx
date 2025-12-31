import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useWords } from "../context/WordContext";
import { ProtectedRoute } from "../components/ProtectedRoute";
import FolderPage from "../pages/FolderPage";
import FolderManagement from "../pages/FolderManagement";
import Header from "../components/Header";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/folders")({
  component: FoldersPage,
});

function FoldersPage() {
  const navigate = useNavigate();
  const {
    folders,
    isLoading,
    showFolderManagement,
    setShowFolderManagement,
    handleAddFolder,
    handleUpdateFolder,
    handleDeleteFolder,
  } = useWords();

  const handleSelectFolder = (id: string | null) => {
    if (id) {
      navigate({ to: "/folder/$folderId", params: { folderId: id } });
    } else {
      navigate({ to: "/words" });
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="container mx-auto px-4 py-6 max-w-3xl">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
            </div>
          ) : (
            <FolderPage
              folders={folders}
              onSelectFolder={handleSelectFolder}
              onManageFolders={() => setShowFolderManagement(true)}
            />
          )}

          {showFolderManagement && (
            <FolderManagement
              folders={folders}
              onAddFolder={handleAddFolder}
              onUpdateFolder={handleUpdateFolder}
              onDeleteFolder={handleDeleteFolder}
              onClose={() => setShowFolderManagement(false)}
            />
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
