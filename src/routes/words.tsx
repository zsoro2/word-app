import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus, Shuffle, Loader2, Edit3 } from "lucide-react";
import { useState } from "react";
import { useWords } from "../context/WordContext";
import { ProtectedRoute } from "../components/ProtectedRoute";
import Header from "../components/Header";
import AddWordForm from "../components/AddWordForm";
import WordList from "../components/WordList";

export const Route = createFileRoute("/words")({
  component: AllWordsPage,
});

function AllWordsPage() {
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const {
    words,
    folders,
    isLoading,
    showAddForm,
    setShowAddForm,
    handleAddWord,
    handleShuffleWords,
  } = useWords();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="container mx-auto px-4 py-6 max-w-3xl">
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
                onClick={() => setIsEditMode(!isEditMode)}
                className={`flex flex-1 lg:flex-none items-center justify-center gap-1.5 px-4 py-2 rounded-md transition-colors text-sm ${
                  isEditMode
                    ? "bg-gray-800 text-white hover:bg-gray-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Edit3 className="h-4 w-4" />
                {isEditMode ? "Done" : "Edit"}
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
            />
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
            </div>
          ) : (
            <WordList words={words} isEditMode={isEditMode} />
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
