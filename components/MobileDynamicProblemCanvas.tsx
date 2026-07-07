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
  title: string;
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

export default function MobileDynamicProblemCanvas({ taskData, language }: DynamicProblemCanvasProps) {
  const [operator, setOperator] = useState<Operator>("greater");
  const [val1, setVal1] = useState<number>(taskData.defaultNumber);
  const [val2, setVal2] = useState<number>(taskData.defaultNumber + taskData.increment);
  const [showSolution, setShowSolution] = useState<boolean>(false);

  const [playRevealSolution] = useSound('/sounds/solution_Reveal.mp3', { volume: 0.1 });

  useEffect(() => {
    setVal1(taskData.defaultNumber);
    setVal2(taskData.defaultNumber + taskData.increment);
    setShowSolution(false);
  }, [taskData]);

  const handleToggleSolution = () => {
    if (!showSolution) playRevealSolution();
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
    <div className={inter.className}>
      <div className="w-full max-w-md mx-auto bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 shadow-2xl backdrop-blur-md flex flex-col gap-5 text-left overflow-hidden">
        
        {/* Problem Text */}
        <div className="text-zinc-300 text-lg leading-relaxed font-light tracking-wide flex flex-col gap-4">
          <span>{taskData.textStart}</span>
          
          {/* Mobile Control Panel */}
          <div className="flex flex-col gap-3 bg-zinc-950/40 p-4 rounded-xl border border-zinc-800">
            <select
              value={operator}
              onChange={(e) => setOperator(e.target.value as Operator)}
              className="w-full bg-zinc-900 border border-zinc-700 text-white text-base rounded-lg px-3 py-3 outline-none focus:border-blue-400 transition-all cursor-pointer appearance-none text-center"
            >
              <option value="less">{uiText.less[language]}</option>
              <option value="greater">{uiText.greater[language]}</option>
              <option value="between">{uiText.between[language]}</option>
            </select>

            <div className="flex items-center gap-2 w-full">
              <input
                type="number"
                step={taskData.increment}
                value={val1}
                onChange={(e) => setVal1(parseFloat(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-700 text-white text-base rounded-lg px-3 py-3 outline-none text-center focus:border-blue-400 transition-all"
              />
              
              {operator === "between" && (
                <>
                  <span className="text-sm font-medium px-1">{uiText.and[language]}</span>
                  <input
                    type="number"
                    step={taskData.increment}
                    value={val2}
                    onChange={(e) => setVal2(parseFloat(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-700 text-white text-base rounded-lg px-3 py-3 outline-none text-center focus:border-blue-400 transition-all"
                  />
                </>
              )}
            </div>
          </div>
          
          <span>{taskData.textEnd}</span>
        </div>

        {/* Solution Dropdown */}
        <div className="mt-2 w-full min-w-0">
          <button
            onClick={handleToggleSolution}
            className="w-full bg-zinc-800/50 active:bg-zinc-800 text-zinc-200 font-medium py-3 px-5 rounded-xl flex justify-between items-center transition-all border border-zinc-700/60 shadow-sm"
          >
            <span className="text-base tracking-wide">{showSolution ? uiText.hideSolution[language] : uiText.solutionBtn[language]}</span>
            <span className={cn("text-xl transition-transform duration-300", showSolution ? "rotate-45" : "")}>+</span>
          </button>

          {showSolution && (
            <div className="mt-3 p-5 bg-black/40 border border-zinc-800/80 rounded-xl animate-fade-in flex flex-col gap-4 w-full min-w-0 overflow-hidden">
                <div className="w-full bg-zinc-950/50 p-4 rounded-lg border border-zinc-800 shadow-inner overflow-hidden min-w-0 [&_.katex-display]:overflow-x-auto [&_.katex-display]:overflow-y-hidden [&_.katex-display]:pb-2 [&_.katex-display]:m-0">
                    <div className="text-zinc-200 w-full flex flex-col gap-4">
                        {operator !== "between" ? (
                        <>
                            <div>
                              <BlockMath math={`z = \\frac{x - \\mu}{\\sigma} = \\frac{${val1} - ${taskData.mu}}{${taskData.sigma}} = ${mathData.z1.toFixed(2)}`} />
                            </div>
                            <div>
                              <BlockMath math={`P(Z ${operator === 'greater' ? '>' : '<'} ${mathData.z1.toFixed(2)}) = ${mathData.prob.toFixed(4)}`} />
                            </div>
                        </>
                        ) : (
                        <>
                            <div>
                              <BlockMath math={`z_1 = \\frac{${val1} - \\mu}{\\sigma} = ${mathData.z1.toFixed(2)}`} />
                            </div>
                            <div>
                              <BlockMath math={`z_2 = \\frac{${val2} - \\mu}{\\sigma} = ${mathData.z2.toFixed(2)}`} />
                            </div>
                            <div>
                              <BlockMath math={`P(${mathData.lowerZ.toFixed(2)} < Z < ${mathData.upperZ.toFixed(2)}) = ${mathData.prob.toFixed(4)}`} />
                            </div>
                        </>
                        )}
                    </div>
                </div>

                <p className="text-zinc-400 text-base font-light tracking-wide leading-relaxed break-words w-full">
                    {explanationString}
                </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}