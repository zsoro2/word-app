import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus, Shuffle, Loader2 } from "lucide-react";
import { useWords } from "../context/WordContext";
import { ProtectedRoute } from "../components/ProtectedRoute";
import Header from "../components/Header";
import AddWordForm from "../components/AddWordForm";
import WordList from "../components/WordList";

export const Route = createFileRoute("/folder/$folderId")({
  component: FolderWordsPage,
});

function FolderWordsPage() {
  const { folderId } = Route.useParams();
  const navigate = useNavigate();
  const {
    folders,
    isLoading,
    showAddForm,
    setShowAddForm,
    handleAddWord,
    handleShuffleWords,
    getFilteredWords,
  } = useWords();

  const filteredWords = getFilteredWords(folderId);
  const currentFolder = folders.find((f) => f.$id === folderId);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="container mx-auto px-4 py-6 max-w-3xl">
          {currentFolder && (
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {currentFolder.name}
            </h2>
          )}

          <div className="flex flex-wrap flex-col md:flex-row gap-2 mb-6 justify-between items-start md:items-center">
            <button
              onClick={() => navigate({ to: "/folders" })}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to Folders
            </button>
            <div className="flex gap-2 mt-5 lg:mt-0 w-full lg:w-auto">
              <button
                onClick={handleShuffleWords}
                className="flex flex-1 lg:flex-none items-center justify-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
              >
                <Shuffle className="h-4 w-4" />
                Shuffle Words
              </button>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex flex-1 lg:flex-none items-center justify-center gap-1.5 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors text-sm"
              >
                <Plus className="h-4 w-4" />
                Add Word
              </button>
            </div>
          </div>

          {showAddForm && (
            <AddWordForm
              visible={showAddForm}
              onClose={() => setShowAddForm(false)}
              onAddWord={handleAddWord}
              folders={folders}
              defaultFolderId={folderId}
            />
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
            </div>
          ) : (
            <WordList words={filteredWords} />
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
