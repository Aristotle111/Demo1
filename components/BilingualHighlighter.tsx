"use client";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Inter } from 'next/font/google';

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

export default function BilingualHighlighter({ taskData, currentLanguage }: BilingualHighlighterProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    setShowSolution(false);
  }, [taskData]);

  const oppositeLanguage = currentLanguage === "EN" ? "FR" : "EN";
  const primarySentences = taskData.sentences[currentLanguage];
  const secondarySentences = taskData.sentences[oppositeLanguage];

  return (
    <div className={inter.className}>
      <div 
        className={cn(
          "w-full mx-auto bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-8 md:p-12 shadow-2xl backdrop-blur-md flex flex-col gap-6 text-left transition-all duration-700 ease-in-out",
          isExpanded ? "max-w-7xl" : "max-w-5xl"
        )}
      >
        
        {/* Text Display Area */}
        <div className={cn(
          "grid transition-all duration-700",
          isExpanded ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
        )}>
          
          {/* Primary Language Column */}
          <div className={cn(
            "flex flex-col gap-2 w-full transition-all duration-700",
            isExpanded ? "lg:pr-10" : ""
          )}>
            <h3 className="text-zinc-500 text-sm font-semibold tracking-widest uppercase mb-2">
              {currentLanguage === "EN" ? "English" : "Français"}
            </h3>
            <p className="text-xl md:text-2xl leading-loose font-light tracking-wide text-zinc-300">
              {primarySentences.map((sentence, index) => (
                <span
                  key={`primary-${index}`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={cn(
                    "transition-all duration-300 rounded px-1 -mx-1",
                    isExpanded ? highlightColors[index % highlightColors.length] : "",
                    isExpanded && hoveredIndex === index ? "brightness-125 bg-opacity-20 shadow-[0_0_15px_rgba(255,255,255,0.1)]" : "",
                    isExpanded && hoveredIndex !== null && hoveredIndex !== index ? "opacity-40" : ""
                  )}
                >
                  {sentence}{" "}
                </span>
              ))}
            </p>
          </div>

          {/* Secondary Language Column (Revealed on Expand) */}
          {isExpanded && (
            <div className="flex flex-col gap-2 animate-fade-in border-t pt-8 mt-8 lg:border-t-0 lg:pt-0 lg:mt-0 lg:border-l lg:pl-10 border-zinc-800/50 w-full">
              <h3 className="text-zinc-500 text-sm font-semibold tracking-widest uppercase mb-2">
                {oppositeLanguage === "EN" ? "English" : "Français"}
              </h3>
              <p className="text-xl md:text-2xl leading-loose font-light tracking-wide text-zinc-300">
                {secondarySentences.map((sentence, index) => (
                  <span
                    key={`secondary-${index}`}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className={cn(
                      "transition-all duration-300 rounded px-1 -mx-1",
                      highlightColors[index % highlightColors.length],
                      hoveredIndex === index ? "brightness-125 bg-opacity-20 shadow-[0_0_15px_rgba(255,255,255,0.1)]" : "",
                      hoveredIndex !== null && hoveredIndex !== index ? "opacity-40" : ""
                    )}
                  >
                    {sentence}{" "}
                  </span>
                ))}
              </p>
            </div>
          )}
        </div>

        {/* Expand/Collapse Toggle (Moved between text and solution) */}
        <div className="flex justify-center mt-6 mb-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-6 py-2 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 transition-all border border-zinc-700"
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
          onClick={() => setShowSolution(!showSolution)}
          className={cn(
            "cursor-pointer w-full rounded-xl p-8 border transition-all duration-500 ease-in-out flex items-center justify-center text-center",
            showSolution 
              ? "bg-black/40 border-zinc-700 shadow-inner" 
              : "bg-zinc-800/50 hover:bg-zinc-800/80 border-zinc-700/60 shadow-sm"
          )}
        >
          <div className="transition-opacity duration-500 opacity-100">
            {!showSolution ? (
              <span className="text-zinc-400 font-medium tracking-wide uppercase text-sm">
                Reveal Solution
              </span>
            ) : (
              <p className="text-zinc-200 text-lg font-light tracking-wide leading-relaxed animate-in fade-in duration-700">
                {taskData.solution[currentLanguage]}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}