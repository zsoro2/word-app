import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import WordCard from "./WordCard";
import { useWords } from "../context/WordContext";
import type { WordDocument } from "../types";

interface WordListProps {
  words: WordDocument[];
  isEditMode: boolean;
}

export default function WordList({ words, isEditMode }: WordListProps) {
  const { handleDeleteWord, handleUpdateWord } = useWords();
  const [hideTerms, setHideTerms] = useState(false);
  const [hideDefinitions, setHideDefinitions] = useState(false);

  const toggleHideTerms = () => {
    setHideTerms(!hideTerms);
  };

  const toggleHideDefinitions = () => {
    setHideDefinitions(!hideDefinitions);
  };

  if (words.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
        <p className="text-gray-500">No words yet. Add your first word!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="grid grid-cols-2 gap-4 p-3 border-b border-gray-100">
        <div className="flex items-center justify-center">
          <button
            onClick={toggleHideTerms}
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            {hideTerms ? (
              <>
                <Eye className="h-4 w-4" />
                <span>Show</span>
              </>
            ) : (
              <>
                <EyeOff className="h-4 w-4" />
                <span>Hide</span>
              </>
            )}
          </button>
        </div>
        <div className="flex items-center justify-center">
          <button
            onClick={toggleHideDefinitions}
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            {hideDefinitions ? (
              <>
                <Eye className="h-4 w-4" />
                <span>Show</span>
              </>
            ) : (
              <>
                <EyeOff className="h-4 w-4" />
                <span>Hide</span>
              </>
            )}
          </button>
        </div>
      </div>
      <div>
        {words.map((word) => (
          <WordCard
            key={word.$id}
            word={word}
            hideTerms={hideTerms}
            hideDefinitions={hideDefinitions}
            isEditMode={isEditMode}
            onDelete={handleDeleteWord}
            onUpdate={handleUpdateWord}
          />
        ))}
      </div>
    </div>
  );
}
