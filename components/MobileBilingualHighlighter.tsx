"use client";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Inter } from 'next/font/google';
import useSound from 'use-sound';

const inter = Inter({ subsets: ['latin'] });

export interface BilingualTask {
  sentences: {
    EN: string[];
    FR: string[];
  };
  solution: {
    EN: string;
    FR: string;
  };
}

interface BilingualHighlighterProps {
  taskData: BilingualTask;
  currentLanguage: "EN" | "FR";
}

const uiText = {
  compare: { EN: "Compare Translation", FR: "Comparer la traduction" },
  hide: { EN: "Hide Translation", FR: "Masquer la traduction" },
};

const highlightColors = [
  "text-[#ffc4c4] bg-[#ffc4c4]/10 border-[#ffc4c4]/20", 
  "text-[#b7eeff] bg-[#b7eeff]/10 border-[#b7eeff]/20", 
  "text-[#d0bbff] bg-[#d0bbff]/10 border-[#d0bbff]/20", 
  "text-[#bbffbf] bg-[#bbffbf]/10 border-[#bbffbf]/20", 
];

export default function MobileBilingualHighlighter({ taskData, currentLanguage }: BilingualHighlighterProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  
  // Note: Hover states are removed for mobile since there is no mouse pointer
  
  const [playOpenTranslation] = useSound('/sounds/open_Translation.mp3', { volume: 0.1 });
  const [playCloseTranslation] = useSound('/sounds/close_Translation.mp3', { volume: 0.05 });
  const [playRevealSolution] = useSound('/sounds/solution_Reveal.mp3', { volume: 0.1 });

  useEffect(() => {
    setShowSolution(false);
  }, [taskData]);

  const handleToggleExpand = () => {
    if (isExpanded) playCloseTranslation();
    else playOpenTranslation();
    setIsExpanded(!isExpanded);
  };

  const handleToggleSolution = () => {
    if (!showSolution) playRevealSolution();
    setShowSolution(!showSolution);
  };

  const oppositeLanguage = currentLanguage === "EN" ? "FR" : "EN";
  const primarySentences = taskData.sentences[currentLanguage];
  const secondarySentences = taskData.sentences[oppositeLanguage];

  return (
    <div className={inter.className}>
      <div className="w-full max-w-md mx-auto bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 shadow-2xl backdrop-blur-md flex flex-col gap-6 text-left transition-all duration-700 ease-in-out">
        
        {/* Text Display Area */}
        <div className="grid grid-cols-1 transition-all duration-700">
          
          {/* Primary Language Column */}
          <div className="flex flex-col gap-2 w-full">
            <h3 className="text-zinc-500 text-xs font-semibold tracking-widest uppercase mb-1">
              {currentLanguage === "EN" ? "English" : "Français"}
            </h3>
            <p className="text-lg leading-relaxed font-light tracking-wide text-zinc-300">
              {primarySentences.map((sentence, index) => (
                <span
                  key={`primary-${index}`}
                  className={cn(
                    "transition-all duration-300 rounded px-1 -mx-1",
                    isExpanded ? highlightColors[index % highlightColors.length] : ""
                  )}
                >
                  {sentence}{" "}
                </span>
              ))}
            </p>
          </div>

          {/* Secondary Language Column - Stacks below primary on mobile */}
          {isExpanded && (
            <div className="flex flex-col gap-2 animate-fade-in border-t border-zinc-800/50 pt-6 mt-6 w-full">
              <h3 className="text-zinc-500 text-xs font-semibold tracking-widest uppercase mb-1">
                {oppositeLanguage === "EN" ? "English" : "Français"}
              </h3>
              <p className="text-lg leading-relaxed font-light tracking-wide text-zinc-300">
                {secondarySentences.map((sentence, index) => (
                  <span
                    key={`secondary-${index}`}
                    className={cn(
                      "transition-all duration-300 rounded px-1 -mx-1",
                      highlightColors[index % highlightColors.length]
                    )}
                  >
                    {sentence}{" "}
                  </span>
                ))}
              </p>
            </div>
          )}
        </div>

        {/* Expand/Collapse Toggle */}
        <div className="flex justify-center w-full">
          <button
            onClick={handleToggleExpand}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-zinc-800/80 active:bg-zinc-700 text-zinc-300 transition-all border border-zinc-700"
          >
            <span className="text-sm font-medium tracking-wider uppercase">
              {isExpanded ? uiText.hide[currentLanguage] : uiText.compare[currentLanguage]}
            </span>
            <svg 
              className={cn("w-4 h-4 transition-transform duration-300", isExpanded ? "rotate-180" : "")} 
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Solution Reveal Box */}
        <div 
          onClick={handleToggleSolution}
          className={cn(
            "cursor-pointer w-full rounded-xl p-6 border transition-all duration-500 ease-in-out flex items-center justify-center text-center",
            showSolution 
              ? "bg-black/40 border-zinc-700 shadow-inner" 
              : "bg-zinc-800/50 active:bg-zinc-800/80 border-zinc-700/60 shadow-sm"
          )}
        >
          <div className="transition-opacity duration-500 opacity-100">
            {!showSolution ? (
              <span className="text-zinc-400 font-medium tracking-wide uppercase text-sm">
                Reveal Solution
              </span>
            ) : (
              <p className="text-zinc-200 text-base font-light tracking-wide leading-relaxed animate-in fade-in duration-700">
                {taskData.solution[currentLanguage]}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}