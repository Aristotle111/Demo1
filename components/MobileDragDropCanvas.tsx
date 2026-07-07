"use client";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Inter } from 'next/font/google';
import useSound from 'use-sound';

const inter = Inter({ subsets: ['latin'] });

export interface DragDropTask {
  prompt: string;
  options: string[];
  correctOrder: string[];
}

interface DragDropCanvasProps {
  taskData: DragDropTask;
  language: "EN" | "FR";
}

const uiText = {
  placeholder: {
    EN: "Click the pieces to construct your answer...",
    FR: "Cliquez sur les pièces pour construire votre réponse..."
  },
  success: {
    EN: "Correct! Well done.",
    FR: "Correct ! Bien joué."
  },
  error: {
    EN: "Not quite, try adjusting the order.",
    FR: "Pas tout à fait, essayez de modifier l'ordre."
  },
  verifyBtn: {
    EN: "Verify Answer",
    FR: "Vérifier la réponse"
  }
};

export default function MobileDragDropCanvas({ taskData, language }: DragDropCanvasProps) {
  const [pool, setPool] = useState<string[]>([]);
  const [answerBox, setAnswerBox] = useState<string[]>([]);
  const [status, setStatus] = useState<"success" | "error" | null>(null);

  const [playClick] = useSound('/sounds/simple_Click.mp3', { volume: 0.35 });
  const [playCorrect] = useSound('/sounds/correct_Answer.mp3', { volume: 0.35 });
  const [playIncorrect] = useSound('/sounds/incorrect_Answer.mp3', { volume: 0.55 });

  useEffect(() => {
    if (taskData) {
      const shuffled = [...taskData.options].sort(() => Math.random() - 0.5);
      setPool(shuffled);
      setAnswerBox([]);
      setStatus(null);
    }
  }, [taskData]);

  if (!taskData) return null;

  // Touch-to-move logic (replaces drag and drop for mobile)
  const moveToAnswer = (index: number) => {
    playClick();
    const item = pool[index];
    setPool(pool.filter((_, i) => i !== index));
    setAnswerBox([...answerBox, item]);
    setStatus(null);
  };

  const moveToPool = (index: number) => {
    playClick();
    const item = answerBox[index];
    setAnswerBox(answerBox.filter((_, i) => i !== index));
    setPool([...pool, item]);
    setStatus(null);
  };

  const checkAnswer = () => {
    const isCorrect = answerBox.join("") === taskData.correctOrder.join("");
    if (isCorrect) playCorrect();
    else playIncorrect();
    setStatus(isCorrect ? "success" : "error");
  };

  return (
    <div className={inter.className}>
      <div className="w-full max-w-md mx-auto bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 shadow-2xl backdrop-blur-md flex flex-col gap-6">
        
        <p className="text-zinc-300 text-lg leading-relaxed font-light text-left tracking-wide">
          {taskData.prompt}
        </p>

        {/* The Answer Box */}
        <div className={cn(
          "min-h-[100px] w-full border-2 border-dashed rounded-xl p-3 flex flex-wrap gap-2 items-start content-start transition-colors duration-300",
          status === "success" ? "border-green-500/50 bg-green-500/5" : 
          status === "error" ? "border-red-500/50 bg-red-500/5" : 
          "border-zinc-700 bg-zinc-950/50"
        )}>
          {answerBox.length === 0 && (
            <span className="text-zinc-600 text-base text-center w-full my-auto select-none">
              {uiText.placeholder[language]}
            </span>
          )}
          
          {answerBox.map((item, i) => (
            <button
              key={`ans-${i}`}
              onClick={() => moveToPool(i)}
              className="px-3 py-2 bg-white text-black text-sm font-medium rounded-lg shadow-sm active:scale-95 transition-transform"
            >
              {item}
            </button>
          ))}
        </div>

        {/* The Pool */}
        <div className="flex flex-wrap gap-2 justify-center items-start content-start min-h-[80px]">
          {pool.map((item, i) => (
            <button
              key={`pool-${i}`}
              onClick={() => moveToAnswer(i)}
              className="px-3 py-2 bg-zinc-800 text-zinc-200 text-sm border border-zinc-700 font-medium rounded-lg shadow-sm active:bg-zinc-700 active:scale-95 transition-all"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4 mt-2">
          {status && (
            <span className={cn(
              "text-center text-lg font-medium",
              status === "success" ? "text-green-400" : "text-red-400"
            )}>
              {status === "success" ? uiText.success[language] : uiText.error[language]}
            </span>
          )}
          
          <button 
            onClick={checkAnswer}
            disabled={answerBox.length === 0}
            className="w-full py-3 bg-white text-black text-lg rounded-xl font-bold disabled:opacity-50 active:bg-zinc-200 transition-colors"
          >
            {uiText.verifyBtn[language]}
          </button>
        </div>
      </div>
    </div>
  );
}