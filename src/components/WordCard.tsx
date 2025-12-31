import { useState } from "react";
import type { WordDocument } from "../types";

interface WordCardProps {
  word: WordDocument;
  hideTerms: boolean;
  hideDefinitions: boolean;
}

export default function WordCard({
  word,
  hideTerms,
  hideDefinitions,
}: WordCardProps) {
  const [revealTerm, setRevealTerm] = useState(false);
  const [revealDefinition, setRevealDefinition] = useState(false);

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4 border-b border-gray-50 hover:bg-gray-50 transition-colors">
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
        <h3 className="text-sm font-medium text-gray-900">{word.leftWord}</h3>
        {word.leftExample && (
          <p className="text-xs italic text-gray-500 mt-1">
            "{word.leftExample}"
          </p>
        )}
      </div>
      <div
        onMouseDown={() => setRevealDefinition(true)}
        onMouseUp={() => setRevealDefinition(false)}
        onMouseLeave={() => setRevealDefinition(false)}
        onTouchStart={() => setRevealDefinition(true)}
        onTouchEnd={() => setRevealDefinition(false)}
        className={`select-none cursor-pointer p-4 sm:p-4 transition-all duration-200 ${
          hideDefinitions && !revealDefinition ? "blur-sm" : ""
        }`}
      >
        <p className="text-sm font-medium text-gray-900">{word.rightWord}</p>
        {word.rightExample && (
          <p className="text-xs italic text-gray-500 mt-1">
            "{word.rightExample}"
          </p>
        )}
      </div>
    </div>
  );
}
