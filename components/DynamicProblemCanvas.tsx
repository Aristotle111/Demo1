"use client";
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Inter } from 'next/font/google';
import useSound from 'use-sound';
import { BlockMath } from 'react-katex';

const inter = Inter({ subsets: ['latin'] });

function normalCDF(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  let prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  if (z > 0) prob = 1 - prob;
  return prob;
}

export interface DynamicProblemTask {
  title?: Record<"EN" | "FR", string>;
  textStart: string;
  textEnd: string;
  defaultNumber: number;
  increment: number;
  mu: number;
  sigma: number;
  explanationTemplates: {
    less: string;
    greater: string;
    between: string;
  };
}

interface DynamicProblemCanvasProps {
  taskData: DynamicProblemTask;
  language: "EN" | "FR";
  onTextChange?: (fullText: string) => void;
}

const uiText = {
  less: { EN: "less than", FR: "inférieur à" },
  greater: { EN: "greater than", FR: "supérieur à" },
  between: { EN: "between", FR: "compris entre" },
  and: { EN: "and", FR: "et" },
  solutionBtn: { EN: "Solution", FR: "Solution" },
  hideSolution: { EN: "Hide Solution", FR: "Masquer la solution" }
};

type Operator = "less" | "greater" | "between";

export default function DynamicProblemCanvas({ taskData, language, onTextChange }: DynamicProblemCanvasProps) {
  const [operator, setOperator] = useState<Operator>("greater");
  const [val1, setVal1] = useState<number>(taskData.defaultNumber);
  const [val2, setVal2] = useState<number>(taskData.defaultNumber + taskData.increment);
  const [showSolution, setShowSolution] = useState<boolean>(false);

  const [playRevealSolution] = useSound('/sounds/solution_Reveal.mp3', { volume: 0.55 });

  useEffect(() => {
    setVal1(taskData.defaultNumber);
    setVal2(taskData.defaultNumber + taskData.increment);
    setShowSolution(false);
  }, [taskData]);

  const fullProblemText = useMemo(() => {
    const operatorLabel = uiText[operator][language];
    
    if (operator === "between") {
      const andWord = uiText.and[language];
      return `${taskData.textStart} ${operatorLabel} ${val1} ${andWord} ${val2} ${taskData.textEnd}`.replace(/\s+/g, ' ').trim();
    }
    
    return `${taskData.textStart} ${operatorLabel} ${val1} ${taskData.textEnd}`.replace(/\s+/g, ' ').trim();
  }, [taskData, operator, val1, val2, language]);

  useEffect(() => {
    if (onTextChange) {
      onTextChange(fullProblemText);
    }
  }, [fullProblemText, onTextChange]);

  const handleToggleSolution = () => {
    if (!showSolution) {
      playRevealSolution();
    }
    setShowSolution(!showSolution);
  };

  const mathData = useMemo(() => {
    const z1 = (val1 - taskData.mu) / taskData.sigma;
    const cdf1 = normalCDF(z1);
    
    if (operator === "between") {
      const z2 = (val2 - taskData.mu) / taskData.sigma;
      const cdf2 = normalCDF(z2);
      const prob = Math.abs(cdf2 - cdf1);
      const lowerZ = Math.min(z1, z2);
      const upperZ = Math.max(z1, z2);
      return { z1, z2, prob, lowerZ, upperZ };
    }

    const prob = operator === "greater" ? 1 - cdf1 : cdf1;
    return { z1, z2: 0, prob, lowerZ: z1, upperZ: z1 };
  }, [val1, val2, taskData.mu, taskData.sigma, operator]);

  const explanationString = taskData.explanationTemplates[operator]
    .replace("{{z}}", mathData.z1.toFixed(2))
    .replace("{{z1}}", mathData.lowerZ.toFixed(2))
    .replace("{{z2}}", mathData.upperZ.toFixed(2))
    .replace("{{prob}}", mathData.prob.toFixed(4));

  return (
    <div className={`${inter.className}`}>
      <div className="w-full mx-auto max-w-3xl lg:max-w-4xl bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 md:p-8 lg:p-10 shadow-xl backdrop-blur-md flex flex-col gap-6 text-left">
        <div className="text-zinc-300 text-base md:text-lg lg:text-xl leading-[2.5rem] font-light tracking-wide">
          <span>{taskData.textStart}</span>
          
          <select
            value={operator}
            onChange={(e) => setOperator(e.target.value as Operator)}
            className="mx-2 my-1 inline-block bg-zinc-950/80 border border-zinc-700 text-white text-sm md:text-base rounded-lg px-2 py-1 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all cursor-pointer"
          >
            <option value="less">{uiText.less[language]}</option>
            <option value="greater">{uiText.greater[language]}</option>
            <option value="between">{uiText.between[language]}</option>
          </select>

          <input
            type="number"
            step={taskData.increment}
            value={val1}
            onChange={(e) => setVal1(parseFloat(e.target.value) || 0)}
            className="mx-2 my-1 inline-block w-16 lg:w-20 bg-zinc-950/80 border border-zinc-700 text-white text-sm md:text-base rounded-lg px-2 py-1 outline-none text-center focus:border-blue-400 transition-all"
          />

          {operator === "between" && (
            <>
              <span className="mx-2">{uiText.and[language]}</span>
              <input
                type="number"
                step={taskData.increment}
                value={val2}
                onChange={(e) => setVal2(parseFloat(e.target.value) || 0)}
                className="mx-2 my-1 inline-block w-16 lg:w-20 bg-zinc-950/80 border border-zinc-700 text-white text-sm md:text-base rounded-lg px-2 py-1 outline-none text-center focus:border-blue-400 transition-all"
              />
            </>
          )}
          
          <span>{taskData.textEnd}</span>
        </div>

        {/* Solution Dropdown */}
        <div className="mt-2">
          <button
            onClick={handleToggleSolution}
            className="w-full bg-zinc-800/40 hover:bg-zinc-800/60 text-zinc-300 font-medium py-3 px-5 rounded-xl flex justify-between items-center transition-all border border-zinc-700/50 shadow-sm"
          >
            <span className="text-sm lg:text-base tracking-wide">{showSolution ? uiText.hideSolution[language] : uiText.solutionBtn[language]}</span>
            <span className={cn("text-xl transition-transform duration-300", showSolution ? "rotate-45" : "")}>+</span>
          </button>

          {showSolution && (
            <div className="mt-4 p-5 lg:p-8 bg-black/30 border border-zinc-800/60 rounded-xl animate-fade-in">
              <div className="w-full text-sm md:text-base lg:text-md bg-zinc-950/40 p-4 rounded-lg border border-zinc-800/50 text-white">
                {operator !== "between" ? (
                  <>
                    <div className="mb-3">
                      <BlockMath math={`z = \\frac{x - \\mu}{\\sigma} = \\frac{${val1} - ${taskData.mu}}{${taskData.sigma}} = ${mathData.z1.toFixed(2)}`} />
                    </div>
                    <div>
                      <BlockMath math={`P(Z ${operator === 'greater' ? '>' : '<'} ${mathData.z1.toFixed(2)}) = ${mathData.prob.toFixed(4)}`} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-2">
                      <BlockMath math={`z_1 = \\frac{${val1} - ${taskData.mu}}{${taskData.sigma}} = ${mathData.z1.toFixed(2)}`} />
                    </div>
                    <div className="mb-3">
                      <BlockMath math={`z_2 = \\frac{${val2} - ${taskData.mu}}{${taskData.sigma}} = ${mathData.z2.toFixed(2)}`} />
                    </div>
                    <div>
                      <BlockMath math={`P(${mathData.lowerZ.toFixed(2)} < Z < ${mathData.upperZ.toFixed(2)}) = ${mathData.prob.toFixed(4)}`} />
                    </div>
                  </>
                )}
              </div>

              {/* Explanation Text */}
              <p className="mt-4 text-zinc-400 text-sm lg:text-base font-light tracking-wide leading-relaxed">
                {explanationString}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}