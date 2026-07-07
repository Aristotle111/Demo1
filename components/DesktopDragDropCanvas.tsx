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

export default function DragDropCanvas({ taskData, language }: DragDropCanvasProps) {
  const [pool, setPool] = useState<string[]>([]);
  const [answerBox, setAnswerBox] = useState<string[]>([]);
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const [playClick] = useSound('/sounds/simple_Click.mp3', { volume: 0.35 });
  const [playCorrect] = useSound('/sounds/correct_Answer.mp3', { volume: 0.55 });
  const [playIncorrect] = useSound('/sounds/incorrect_Answer.mp3', { volume: 0.65 });

  useEffect(() => {
    if (taskData) {
      const shuffled = [...taskData.options].sort(() => Math.random() - 0.5);
      setPool(shuffled);
      setAnswerBox([]);
      setStatus(null);
    }
  }, [taskData]);

  if (!taskData) return null;

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

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;
    const newAnswerBox = [...answerBox];
    const draggedItem = newAnswerBox.splice(draggedIndex, 1)[0];
    newAnswerBox.splice(dropIndex, 0, draggedItem);

    playClick();
    setAnswerBox(newAnswerBox);
    setDraggedIndex(null);
    setStatus(null);
  };

  const checkAnswer = () => {
    const isCorrect = answerBox.join("") === taskData.correctOrder.join("");

    if (isCorrect) {
      playCorrect();
    } else {
      playIncorrect();
    }

    setStatus(isCorrect ? "success" : "error");
  };

  return (
  <div className={inter.className}>
    <div className="w-full max-w-4xl mx-auto bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 md:p-6 lg:p-8 shadow-xl backdrop-blur-md flex flex-col gap-5 lg:gap-6">
      <p className="text-zinc-300 text-base lg:text-lg leading-relaxed font-light text-left tracking-wide">
        {taskData.prompt}
      </p>

      {/* The Answer Box */}
      <div className={cn(
        "min-h-[70px] w-full border-2 border-dashed rounded-xl p-3 flex flex-wrap gap-2 items-start content-start transition-colors duration-300",
        status === "success" ? "border-green-500/50 bg-green-500/5" : 
        status === "error" ? "border-red-500/50 bg-red-500/5" : 
        "border-zinc-700 bg-zinc-950/50"
      )}>
        {answerBox.length === 0 && (
          <span className="text-zinc-600 text-sm md:text-base my-auto p-2 mx-auto select-none">
            {uiText.placeholder[language]}
          </span>
        )}
        
        {answerBox.map((item, i) => (
          <button
            key={`ans-${i}`}
            draggable
            onDragStart={(e) => handleDragStart(e, i)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, i)}
            onClick={() => moveToPool(i)}
            className={cn(
              "px-3 py-2.5 bg-white text-black text-sm font-medium rounded-lg shadow-sm hover:scale-105 transition-transform cursor-grab active:cursor-grabbing",
              draggedIndex === i ? "opacity-50" : "opacity-100"
            )}
          >
            {item}
          </button>
        ))}
      </div>

      {/* The Pool (Draggable Items) */}
      <div className="flex flex-wrap gap-2 lg:gap-3 justify-center items-start content-start min-h-[60px]">
        {pool.map((item, i) => (
          <button
            key={`pool-${i}`}
            onClick={() => moveToAnswer(i)}
            className="px-3 py-2.5 bg-zinc-800 text-zinc-200 text-sm border border-zinc-700 font-medium rounded-lg shadow-sm hover:bg-zinc-700 hover:scale-105 transition-all"
          >
            {item}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center pt-2">
        <span className={cn(
          "text-sm lg:text-base font-medium transition-opacity",
          status === "success" ? "text-green-400 opacity-100" :
          status === "error" ? "text-red-400 opacity-100" : "opacity-0"
        )}>
          {status === "success" ? uiText.success[language] : uiText.error[language]}
        </span>
        
        <button 
          onClick={checkAnswer}
          disabled={answerBox.length === 0}
          className="px-4 py-2 bg-white text-black text-sm lg:text-base rounded-lg font-bold disabled:opacity-50 hover:bg-zinc-200 transition-colors"
        >
          {uiText.verifyBtn[language]}
        </button>
      </div>
    </div>
  </div>
);
}