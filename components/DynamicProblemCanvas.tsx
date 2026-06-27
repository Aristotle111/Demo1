"use client";
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";

// Approximation function for standard normal cumulative distribution (CDF)
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

export default function DynamicProblemCanvas({ taskData, language }: DynamicProblemCanvasProps) {
  const [operator, setOperator] = useState<Operator>("greater");
  const [val1, setVal1] = useState<number>(taskData.defaultNumber);
  const [val2, setVal2] = useState<number>(taskData.defaultNumber + taskData.increment);
  const [showSolution, setShowSolution] = useState<boolean>(false);

  // Reset values if the task data changes (e.g., changing difficulties)
  useEffect(() => {
    setVal1(taskData.defaultNumber);
    setVal2(taskData.defaultNumber + taskData.increment);
    setShowSolution(false);
  }, [taskData]);

  // Real-time calculations
  const mathData = useMemo(() => {
    const z1 = (val1 - taskData.mu) / taskData.sigma;
    const cdf1 = normalCDF(z1);
    
    if (operator === "between") {
      const z2 = (val2 - taskData.mu) / taskData.sigma;
      const cdf2 = normalCDF(z2);
      // Ensure we subtract the smaller CDF from the larger one
      const prob = Math.abs(cdf2 - cdf1);
      const lowerZ = Math.min(z1, z2);
      const upperZ = Math.max(z1, z2);
      return { z1, z2, prob, lowerZ, upperZ };
    }

    const prob = operator === "greater" ? 1 - cdf1 : cdf1;
    return { z1, z2: 0, prob, lowerZ: z1, upperZ: z1 };
  }, [val1, val2, taskData.mu, taskData.sigma, operator]);

  // Construct dynamic explanation string
  const explanationString = taskData.explanationTemplates[operator]
    .replace("{{z}}", mathData.z1.toFixed(2))
    .replace("{{z1}}", mathData.lowerZ.toFixed(2))
    .replace("{{z2}}", mathData.upperZ.toFixed(2))
    .replace("{{prob}}", mathData.prob.toFixed(4));

  return (
    <div className="w-full max-w-5xl mx-auto bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-8 md:p-12 shadow-2xl backdrop-blur-md flex flex-col gap-6 text-left">
      
      {/* Problem Text & Controls Inline */}
      <div className="text-zinc-300 text-xl md:text-2xl leading-loose font-light tracking-wide">
        <span>{taskData.textStart}</span>
        
        <select
          value={operator}
          onChange={(e) => setOperator(e.target.value as Operator)}
          className="mx-3 inline-block bg-zinc-950/80 border border-zinc-700 text-white text-lg rounded-lg px-3 py-1.5 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all cursor-pointer appearance-none"
        >
          <option value="less">{uiText.less[language]}</option>
          <option value="greater">{uiText.greater[language]}</option>
          <option value="between">{uiText.between[language]}</option>
        </select>

        <input
          type="number"
          step={taskData.increment}
          value={val1}
          onChange={(e) => setVal1(parseFloat(e.target.value))}
          className="mx-2 inline-block w-24 bg-zinc-950/80 border border-zinc-700 text-white text-lg rounded-lg px-3 py-1.5 outline-none text-center focus:border-blue-400 transition-all"
        />

        {operator === "between" && (
          <>
            <span className="mx-2">{uiText.and[language]}</span>
            <input
              type="number"
              step={taskData.increment}
              value={val2}
              onChange={(e) => setVal2(parseFloat(e.target.value))}
              className="mx-2 inline-block w-24 bg-zinc-950/80 border border-zinc-700 text-white text-lg rounded-lg px-3 py-1.5 outline-none text-center focus:border-blue-400 transition-all"
            />
          </>
        )}
        
        <span>{taskData.textEnd}</span>
      </div>

      {/* Dynamic Solution Accordion */}
      <div className="mt-6">
        <button
          onClick={() => setShowSolution(!showSolution)}
          className="w-full bg-zinc-800/50 hover:bg-zinc-800 text-zinc-200 font-medium py-4 px-6 rounded-xl flex justify-between items-center transition-all border border-zinc-700/60 shadow-sm"
        >
          <span className="text-lg tracking-wide">{showSolution ? uiText.hideSolution[language] : uiText.solutionBtn[language]}</span>
          <span className={cn("text-2xl transition-transform duration-300", showSolution ? "rotate-45" : "")}>+</span>
        </button>

        {showSolution && (
          <div className="mt-4 p-8 bg-black/40 border border-zinc-800/80 rounded-xl animate-fade-in flex flex-col gap-5">
            
            {/* Dynamic LaTeX / Math rendering */}
            <div className="text-zinc-200 font-mono text-base md:text-lg overflow-x-auto whitespace-nowrap bg-zinc-950/50 p-6 rounded-lg border border-zinc-800 shadow-inner">
              {operator !== "between" ? (
                <>
                  <p className="mb-4">
                    {`z = \\frac{x - \\mu}{\\sigma} = \\frac{${val1} - ${taskData.mu}}{${taskData.sigma}} = ${mathData.z1.toFixed(2)}`}
                  </p>
                  <p>
                    {`P(Z ${operator === 'greater' ? '>' : '<'} ${mathData.z1.toFixed(2)}) = ${mathData.prob.toFixed(4)}`}
                  </p>
                </>
              ) : (
                <>
                  <p className="mb-3">
                    {`z_1 = \\frac{${val1} - ${taskData.mu}}{${taskData.sigma}} = ${mathData.z1.toFixed(2)}`}
                  </p>
                  <p className="mb-5">
                    {`z_2 = \\frac{${val2} - ${taskData.mu}}{${taskData.sigma}} = ${mathData.z2.toFixed(2)}`}
                  </p>
                  <p>
                    {`P(${mathData.lowerZ.toFixed(2)} < Z < ${mathData.upperZ.toFixed(2)}) = ${mathData.prob.toFixed(4)}`}
                  </p>
                </>
              )}
            </div>

            {/* Explanation Text */}
            <p className="text-zinc-400 text-lg font-light tracking-wide leading-relaxed">
              {explanationString}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}