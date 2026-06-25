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

type Language = "EN" | "FR";
type Difficulty = "beginner" | "intermediate" | "advanced";

const navItems = {
  EN: [
    { label: "Control the Complexity", path: "/about", bgColor: "#0e0e0e", textColor: "#ffc4c4", description: "Slide between basic, intermediate, and advanced versions of the same problem to build confidence at your own pace." },
    { label: "Drag, Drop, Learn", path: "/about", bgColor: "#0e0e0e", textColor: "#b7eeff", description: "Reconstruct problem solutions through interactive drag-and-drop tasks that test both logic and language." },
    { label: "Highlight What Matters", path: "/about", bgColor: "#0e0e0e", textColor: "#d0bbff", description: "Aligned phrases glow together when hovered, helping you connect meaning across languages and levels." },
    { label: "Understand, Don't Memorize", path: "/about", bgColor: "#0e0e0e", textColor: "#bbffbf", description: "Visual tools, animations, phrasing breakdowns help you see how the math really works." }
  ],
  FR: [
    { label: "Contrôlez la Complexité", path: "/about", bgColor: "#0e0e0e", textColor: "#ffc4c4", description: "Basculez entre les versions de base, intermédiaire et avancée du même problème pour gagner en confiance à votre rythme." },
    { label: "Glissez, Déposez, Apprenez", path: "/about", bgColor: "#0e0e0e", textColor: "#b7eeff", description: "Reconstruisez les solutions aux problèmes via des tâches interactives qui testent la logique et la langue." },
    { label: "Surlignez l'Essentiel", path: "/about", bgColor: "#0e0e0e", textColor: "#d0bbff", description: "Les phrases alignées s'illuminent au survol, vous aidant à connecter le sens à travers les langues." },
    { label: "Comprendre Sans Mémoriser", path: "/about", bgColor: "#0e0e0e", textColor: "#bbffbf", description: "Des outils visuels, des animations et des analyses de phrases vous aident à voir comment fonctionnent les mathématiques." }
  ]
};

const difficultyLabels = {
  EN: { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" },
  FR: { beginner: "Débutant", intermediate: "Intermédiaire", advanced: "Avancé" }
};

const difficultyKeys: Difficulty[] = ["beginner", "intermediate", "advanced"];

interface ContentItem {
  title: Record<Language, string>;
  beginner: Record<Language, string>;
  intermediate: Record<Language, string>;
  advanced: Record<Language, string>;
}

const App = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<Language>("EN");
  const [difficulty, setDifficulty] = useState<Difficulty>("beginner");
  const [problems, setProblems] = useState<ContentItem[]>([
    {
      title: { EN: "Binomial Probability Problem", FR: "Problème de Probabilité Binomiale" },
      beginner: { EN: "In a behavioral ecology study, a sample of eight foxes are subjected to a conditioning protocol hypothesized to yield a 60% success rate in eliciting a target behavior.  Assuming independence between trials, determine the probability that at least half of the eight foxes exhibit the conditioned response.", FR: "Dans une étude d'écologie comportementale, un échantillon de huit renards est soumis à un protocole de conditionnement censé produire un comportement cible dans 60 % des cas. En supposant l'indépendance des essais, quelle est la probabilité qu'au moins la moitié des huit renards présentent la réponse conditionnée?" },
      intermediate: { EN: "In a clinical trial evaluating a new allergy medication, a focus group of twelve patients is monitored for adverse side effects. Historical data suggests the probability of a patient experiencing mild drowsiness under this formulation is exactly 25%. Assuming each patient's physiological reaction is independent, calculate the probability that fewer than four individuals in this sample group report experiencing drowsiness.", FR: "Dans un essai clinique évaluant un nouveau médicament contre les allergies, un groupe de douze patients est suivi afin de détecter d'éventuels effets indésirables. Les données historiques suggèrent que la probabilité qu'un patient ressente une légère somnolence avec cette formulation est exactement de 25 %. En supposant que la réaction physiologique de chaque patient est indépendante, calculez la probabilité que moins de quatre individus de ce groupe rapportent une somnolence." },
      advanced: { EN: "An automated manufacturing line produces microchips with a known, stable defect rate of 5%. A quality control inspector randomly selects a batch of twenty microchips from the morning production run for rigorous stress testing. Under the assumption that the structural integrity of each chip is independent of the others, find the probability that the batch contains more than two defective units.", FR: "Une ligne de production automatisée fabrique des microprocesseurs dont le taux de défauts est connu et stable à 5 %. Un contrôleur qualité prélève aléatoirement un lot de vingt microprocesseurs issus de la production du matin pour des tests de résistance rigoureux. En supposant que l'intégrité structurelle de chaque puce est indépendante des autres, quelle est la probabilité que le lot contienne plus de deux unités défectueuses ?" }
    },
  ]);

  //function for problem generator
  const generateNewProblem = () => {

    //CALL GENERATED PROBLEMS HERE <-------------------------------------------------------------

    //placeholder
    const newlyGeneratedProblem: ContentItem = {
      title: { EN: "Binomial Probability Problem", FR: "Problème de Probabilité Binomiale" },
      beginner: { EN: "In a behavioral ecology study, a sample of eight foxes are subjected to a conditioning protocol hypothesized to yield a 60% success rate in eliciting a target behavior.  Assuming independence between trials, determine the probability that at least half of the eight foxes exhibit the conditioned response.", FR: "Dans une étude d'écologie comportementale, un échantillon de huit renards est soumis à un protocole de conditionnement censé produire un comportement cible dans 60 % des cas. En supposant l'indépendance des essais, quelle est la probabilité qu'au moins la moitié des huit renards présentent la réponse conditionnée?" },
      intermediate: { EN: "In a clinical trial evaluating a new allergy medication, a focus group of twelve patients is monitored for adverse side effects. Historical data suggests the probability of a patient experiencing mild drowsiness under this formulation is exactly 25%. Assuming each patient's physiological reaction is independent, calculate the probability that fewer than four individuals in this sample group report experiencing drowsiness.", FR: "Dans un essai clinique évaluant un nouveau médicament contre les allergies, un groupe de douze patients est suivi afin de détecter d'éventuels effets indésirables. Les données historiques suggèrent que la probabilité qu'un patient ressente une légère somnolence avec cette formulation est exactement de 25 %. En supposant que la réaction physiologique de chaque patient est indépendante, calculez la probabilité que moins de quatre individus de ce groupe rapportent une somnolence." },
      advanced: { EN: "An automated manufacturing line produces microchips with a known, stable defect rate of 5%. A quality control inspector randomly selects a batch of twenty microchips from the morning production run for rigorous stress testing. Under the assumption that the structural integrity of each chip is independent of the others, find the probability that the batch contains more than two defective units.", FR: "Une ligne de production automatisée fabrique des microprocesseurs dont le taux de défauts est connu et stable à 5 %. Un contrôleur qualité prélève aléatoirement un lot de vingt microprocesseurs issus de la production du matin pour des tests de résistance rigoureux. En supposant que l'intégrité structurelle de chaque puce est indépendante des autres, quelle est la probabilité que le lot contienne plus de deux unités défectueuses ?" }
    };

    //Update the state
    setProblems((prevProblems) => [...prevProblems, newlyGeneratedProblem]);
  };

  const handleLanguageChange = (selectedLang : Language) => {
    setCurrentLanguage(selectedLang);
  };

  const currentProblem = activeIndex !== null ? problems[activeIndex] : null;
  const dynamicProblemText = currentProblem ? currentProblem[difficulty][currentLanguage] : "";
  const currentGooeyItems = difficultyKeys.map(key => difficultyLabels[currentLanguage][key]);
  
  return (
    <div className="relative min-h-screen flex flex-col w-full overflow-hidden bg-black">
      <GridPattern width={60} height={60} x={-1} y={-1} className={cn("stroke-white/5")} />
      
      <div className="relative z-50 flex items-start justify-between w-full p-4 pointer-events-none">
        <div className="pointer-events-auto">
          <CardNav
            logo={logo}
            logoAlt="Stat à Stat"
            items={navItems[currentLanguage]}
            homeLabel={currentLanguage === "EN" ? "Home" : "Accueil"}
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
              {currentProblem?.title[currentLanguage]}
            </h1>

            {(() => {
              switch (activeIndex) {
                case 0:
                  return (
                    <div className="w-full bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-8 md:p-14 shadow-2xl backdrop-blur-md transition-all duration-300">
                      <div className="animate-fade-in text-left">
                        <p className={cn("text-zinc-300 text-xl md:text-2xl leading-loose tracking-wide font-light tracking-[0.1em]", inter.className)}>
                          {dynamicProblemText}
                        </p>
                      </div>
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
              items={currentGooeyItems}
              onChange={(selectedLabel: string) => {
                const selectedIndex = currentGooeyItems.indexOf(selectedLabel);
                if (selectedIndex !== -1) {
                  setDifficulty(difficultyKeys[selectedIndex]);
                } 
              }}
            />
          </div>
        )}
    </div>
  );
};

export default App;