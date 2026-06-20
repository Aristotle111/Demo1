"use client";
import { useState } from "react";
import BorderGlow from "@/components/BorderGlow";
import FlowingMenu from '@/components/FlowingMenu'
import CardNav from '@/components/CardNav';
import logo from '@/components/Transparent_X.png';
import LanguageToggle from '@/components/LanguageToggle';
import GridPattern from '@/components/ui/grid-pattern';
import GooeyNav from '@/components/GooeyNav';
import { cn } from "@/lib/utils";
import { Space_Grotesk, Inter } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });

const items = [
    {
      label: "Control the Complexity",
      path: "/about",
      bgColor: "#0e0e0e",
      textColor: "#ffc4c4",
      description: "Slide between basic, intermediate, and advanced versions of the same problem to build confidence at your own pace."
    },
    {
      label: "Drag, Drop, Learn",
      path: "/about",
      bgColor: "#0e0e0e",
      textColor: "#b7eeff",
      description: "Reconstruct problem solutions through interactive drag-and-drop tasks that test both logic and language."
    },
    {
      label: "Highlight What Matters",
      path: "/about",
      bgColor: "#0e0e0e",
      textColor: "#d0bbff",
      description: "Aligned phrases glow together when hovered, helping you connect meaning across languages and levels."
    },
    {
      label: "Understand, Don't Memorize",
      path: "/about",
      bgColor: "#0e0e0e",
      textColor: "#bbffbf",
      description: "Visual tools, animations, phrasing breakdowns help you see how the math really works."
    }
];

const contentData = [
    {
      title: "Binomial Probability Problem",
      beginner: "In a behavioral ecology study, a sample of eight foxes are subjected to a conditioning protocol hypothesized to yield a 60% success rate in eliciting a target behavior.  Assuming independence between trials, determine the probability that at least half of the eight foxes exhibit the conditioned response.",
      intermediate: "In a clinical trial evaluating a new allergy medication, a focus group of twelve patients is monitored for adverse side effects. Historical data suggests the probability of a patient experiencing mild drowsiness under this formulation is exactly 25%. Assuming each patient's physiological reaction is independent, calculate the probability that fewer than four individuals in this sample group report experiencing drowsiness.",
      advanced: "An automated manufacturing line produces microchips with a known, stable defect rate of 5%. A quality control inspector randomly selects a batch of twenty microchips from the morning production run for rigorous stress testing. Under the assumption that the structural integrity of each chip is independent of the others, find the probability that the batch contains more than two defective units."
    },
    {
      title: "Rodent Thermoregulation",
      beginner: "1Textbooks are passive; learning should be active. With our interactive solving engine, you reconstruct problem solutions through drag-and-drop tasks. This forces you to engage with the sequential logic of a statistical proof or calculation, testing your understanding of both the logic and the technical language.",
      intermediate: "2Textbooks are passive; learning should be active. With our interactive solving engine, you reconstruct problem solutions through drag-and-drop tasks. This forces you to engage with the sequential logic of a statistical proof or calculation, testing your understanding of both the logic and the technical language.",
      advanced: "3Textbooks are passive; learning should be active. With our interactive solving engine, you reconstruct problem solutions through drag-and-drop tasks. This forces you to engage with the sequential logic of a statistical proof or calculation, testing your understanding of both the logic and the technical language.",
    },
    {
      title: "Lollipop Flavoured Insecticide",
      beginner: "1Connect the dots across languages and levels. Aligned phrases glow together when hovered, creating a visual bridge between a word in English and its mathematical notation. This immediate visual feedback helps you stop translating and start seeing the underlying structure of the data.",
      intermediate: "2Connect the dots across languages and levels. Aligned phrases glow together when hovered, creating a visual bridge between a word in English and its mathematical notation. This immediate visual feedback helps you stop translating and start seeing the underlying structure of the data.",
      advanced: "3Connect the dots across languages and levels. Aligned phrases glow together when hovered, creating a visual bridge between a word in English and its mathematical notation. This immediate visual feedback helps you stop translating and start seeing the underlying structure of the data.",
    },
    {
      title: "Hair Length and Mating Success in Lizards",
      beginner: "1Formula memorization is the enemy of true statistical literacy. Our tools use custom animations and phrasing breakdowns to help you see how the math actually works under the hood. We break down the 'why' before the 'how,' ensuring you understand the story the data is telling.",
      intermediate: "2Formula memorization is the enemy of true statistical literacy. Our tools use custom animations and phrasing breakdowns to help you see how the math actually works under the hood. We break down the 'why' before the 'how,' ensuring you understand the story the data is telling.",
      advanced: "3Formula memorization is the enemy of true statistical literacy. Our tools use custom animations and phrasing breakdowns to help you see how the math actually works under the hood. We break down the 'why' before the 'how,' ensuring you understand the story the data is telling.",
    }
];

const App = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState("EN");
  const [difficulty, setDifficulty] = useState("Beginner");

  const handleLanguageChange = (selectedLang : string) => {
    setCurrentLanguage(selectedLang);
  };
  
  return (
    <div className="relative min-h-screen flex flex-col w-full overflow-hidden bg-black">
      <GridPattern width={60} height={60} x={-1} y={-1} className={cn("stroke-white/5")} />
      
      <div className="relative z-50 flex items-start justify-between w-full p-4 pointer-events-none">
        <div className="pointer-events-auto">
          <CardNav
            logo={logo}
            logoAlt="Stat à Stat"
            items={items}
            baseColor="#272727"
            menuColor="#000000"
            buttonBgColor="#3f3f3f"
            buttonTextColor="#000000"
            ease="power3.out"
            onItemClick={(index : any) => setActiveIndex(index)}
            defaultOpen={true}
          />
        </div>

        <div className="pointer-events-auto mt-1">
          <LanguageToggle onChange={handleLanguageChange} />
        </div>
      </div>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-7xl w-full mx-auto px-6 text-center animate-fade-in pb-32">
        {activeIndex !== null && (
          <>
            <h1 className={cn("text-2xl md:text-5xl font-extrabold text-white tracking-tight mb-6 bg-clip-text bg-gradient-to-b from-white to-zinc-400", inter.className)}>
              {contentData[activeIndex]?.title}
            </h1>

            {(() => {
              switch (activeIndex) {
                case 0:
                  return (
                    <div className="w-full bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-8 md:p-14 shadow-2xl backdrop-blur-md transition-all duration-300">
                      
                      {difficulty === "Beginner" && (
                        <div className="animate-fade-in text-left">
                          <p className={cn("text-zinc-300 text-xl md:text-2xl leading-loose tracking-wide font-light tracking-[0.1em]", inter.className)}>
                            {contentData[activeIndex]?.beginner}
                          </p>
                        </div>
                      )}

                      {difficulty === "Intermediate" && (
                        <div className="animate-fade-in text-left">
                          <p className={cn("text-zinc-300 text-xl md:text-2xl leading-loose tracking-wide font-light tracking-[0.1em]", inter.className)}>
                            {contentData[activeIndex]?.intermediate}
                          </p>
                        </div>
                      )}

                      {difficulty === "Advanced" && (
                        <div className="animate-fade-in text-left">
                          <p className={cn("text-zinc-300 text-xl md:text-2xl leading-loose tracking-wide font-light tracking-[0.1em]", inter.className)}>
                            {contentData[activeIndex]?.advanced}
                          </p>
                        </div>
                      )}

                    </div>
                  );

                case 1:
                  return <div className="text-zinc-500 py-10">[Layout 2: Drag, Drop, Learn Canvas]</div>;
                case 2:
                  return <div className="text-zinc-500 py-10">[Layout 3: Phrase Alignment Highlighter]</div>;
                case 3:
                  return <div className="text-zinc-500 py-10">[Layout 4: Custom Animation Breakdown]</div>;
                default:
                  return null;
              }
            })()}
          </>
        )}
      </main>
        {activeIndex !== null && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto bg-black/20 backdrop-blur-sm rounded-2xl px-4 py-2 border border-zinc-800/40 shadow-2xl animate-fade-in">
            <GooeyNav 
              items={["Beginner", "Intermediate", "Advanced"]}
              onChange={(selected : any) => setDifficulty(selected)}
            />
          </div>
        )}
    </div>
  );
};

export default App;