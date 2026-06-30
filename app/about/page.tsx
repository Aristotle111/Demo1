"use client";
import { useState } from "react";
import BorderGlow from "@/components/BorderGlow";
import FlowingMenu from '@/components/FlowingMenu'
import CardNav from '@/components/CardNav';
import LanguageToggle from '@/components/LanguageToggle';
import GridPattern from '@/components/ui/grid-pattern';
import GooeyNav from '@/components/GooeyNav';
import { cn } from "@/lib/utils";
import { Space_Grotesk, Inter } from 'next/font/google';
import DragDropCanvas, { DragDropTask } from '@/components/DragDropCanvas';
import DynamicProblemCanvas, { DynamicProblemTask } from '@/components/DynamicProblemCanvas';
import BilingualHighlighter, { BilingualTask } from '@/components/BilingualHighlighter';

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

const App = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<Language>("EN");
  const [difficulty, setDifficulty] = useState<Difficulty>("beginner");

  interface ContentItem {
    title: Record<Language, string>;
    beginner: Record<Language, string>;
    intermediate: Record<Language, string>;
    advanced: Record<Language, string>;
    dragDropData?: Record<Difficulty, Record<Language, DragDropTask>>;
    dynamicProblemData?: Record<Difficulty, Record<Language, DynamicProblemTask>>;
    bilingualReadingData?: Record<Difficulty, BilingualTask>;
  }

  const [problems, setProblems] = useState<ContentItem[]>([
    {
      title: { EN: "Binomial Probability Problem", FR: "Problème de Probabilité Binomiale" },
      beginner: { EN: "In a behavioral ecology study, a sample of eight foxes are subjected to a conditioning protocol hypothesized to yield a 60% success rate in eliciting a target behavior.  Assuming independence between trials, determine the probability that at least half of the eight foxes exhibit the conditioned response.", FR: "Dans une étude d'écologie comportementale, un échantillon de huit renards est soumis à un protocole de conditionnement censé produire un comportement cible dans 60 % des cas. En supposant l'indépendance des essais, quelle est la probabilité qu'au moins la moitié des huit renards présentent la réponse conditionnée?" },
      intermediate: { EN: "In a clinical trial evaluating a new allergy medication, a focus group of twelve patients is monitored for adverse side effects. Historical data suggests the probability of a patient experiencing mild drowsiness under this formulation is exactly 25%. Assuming each patient's physiological reaction is independent, calculate the probability that fewer than four individuals in this sample group report experiencing drowsiness.", FR: "Dans un essai clinique évaluant un nouveau médicament contre les allergies, un groupe de douze patients est suivi afin de détecter d'éventuels effets indésirables. Les données historiques suggèrent que la probabilité qu'un patient ressente une légère somnolence avec cette formulation est exactement de 25 %. En supposant que la réaction physiologique de chaque patient est indépendante, calculez la probabilité que moins de quatre individus de ce groupe rapportent une somnolence." },
      advanced: { EN: "An automated manufacturing line produces microchips with a known, stable defect rate of 5%. A quality control inspector randomly selects a batch of twenty microchips from the morning production run for rigorous stress testing. Under the assumption that the structural integrity of each chip is independent of the others, find the probability that the batch contains more than two defective units.", FR: "Une ligne de production automatisée fabrique des microprocesseurs dont le taux de défauts est connu et stable à 5 %. Un contrôleur qualité prélève aléatoirement un lot de vingt microprocesseurs issus de la production du matin pour des tests de résistance rigoureux. En supposant que l'intégrité structurelle de chaque puce est indépendante des autres, quelle est la probabilité que le lot contienne plus de deux unités défectueuses ?" },
      bilingualReadingData: {
        beginner: {
          sentences: {
            EN: [
              "We are testing the average weight of a species of frog.",
              "The population standard deviation is known and stable.",
              "We calculate the test statistic using the sample mean.",
              "Finally, we compare it to our critical values to make a decision."
            ],
            FR: [
              "Nous testons le poids moyen d'une espèce de grenouille.",
              "L'écart-type de la population est connu et stable.",
              "Nous calculons la statistique de test en utilisant la moyenne de l'échantillon.",
              "Enfin, nous la comparons à nos valeurs critiques pour prendre une décision."
            ]
          },
          solution: { 
            EN: "Compare Z-statistic to alpha threshold (1.96 for 95% CI).", 
            FR: "Comparez le score Z au seuil alpha (1,96 pour IC 95%)." 
          }
        },
        intermediate: {
          sentences: {
            EN: [
              "Sampling distributions reveal deviations from population norms.",
              "With large datasets, the central limit theorem justifies Z-testing.",
              "The test statistic normalizes sample error against standard deviation.",
              "Reject the null when observed variance exceeds critical bounds."
            ],
            FR: [
              "Les distributions d'échantillonnage montrent des différences dans les normes de la population.",
              "Avec des gros ensembles de données, le théorème de la limite centrale justifie le test Z.",
              "La statistique de test normalise l'erreur d'échantillonnage par rapport à l'écart-type.",
              "Rejeter le nulle lorsque la variance observée dépasse les limites critiques."
            ]
          },
          solution: { 
            EN: "Calculate Z = (x̄ - μ) / (σ/√n); evaluate against α-level distribution tails.", 
            FR: "Calculez Z = (x̄ - μ) / (σ/√n) ; évaluez par rapport aux queues de la distribution α." 
          }
        },
        advanced: {
          sentences: {
            EN: [
              "Sampling assesses deviations from the population mean.",
              "Assuming normal distribution, a Z-test is applicable.",
              "The test statistic scales sample error by standard error.",
              "Rejection occurs when the test statistic exceeds alpha boundaries."
            ],
            FR: [
              "L'échantillonnage évalue les déviations de la moyenne de la population.",
              "En supposant une distribution normale, on peut recourir à un test Z.",
              "La statistique de test met en rapport l'erreur d'échantillonnage avec l'erreur-type.",
              "Le rejet se produit lorsque la statistique de test dépasse les limites alpha."
            ]
          },
          solution: {
            EN: "Compute z = (x̄ - μ) / (σ / √n). The critical region is defined by the area in the tails of the standard normal distribution.",
            FR: "Calculez z = (x̄ - μ) / (σ / √n). La région critique est définie par l'aire dans les queues de la distribution normale centrée réduite."
          }
        }
      },
      dragDropData: {
        beginner: {
          EN: {
            prompt: "We are testing if the average weight of a certain species of frog is different from 12g. The population standard deviation is known. The sample comes from a normal distribution. The test statistic is z = -2.25. The significance level is 5%, and the critical values are -1.96 and 1.96.",
            options: ["Because", "we fail to reject the null hypothesis.", "z = -2.25", "is less than -1.96", "we reject the null hypothesis.", "There is enough evidence to", "The mean is equal to 12g.", "There is not enough evidence.", "say the mean is different from 12g."],
            correctOrder: ["Because", "z = -2.25", "is less than -1.96", "we reject the null hypothesis.", "There is enough evidence to", "say the mean is different from 12g."]
          },
          FR: {
            prompt: "Nous testons si le poids moyen d’une certaine espèce de grenouille est différent de 12 g. L’écart-type de la population est connu. L’échantillon provient d’une distribution normale. La statistique de test est z = -2,25. Le niveau de signification est de 5 %, et les valeurs critiques sont -1,96 et 1,96.",
            options: ["on rejette l’hypothèse nulle.", "Il n’y a pas assez de preuves.", "z = -2,25", "La moyenne est égale à 12 g.", "dire que la moyenne est différente de 12 g.", "on ne rejette pas l’hypothèse nulle.", "Parce que", "Il y a assez de preuves pour", "est plus petit que -1,96"],
            correctOrder: ["Parce que", "z = -2,25", "est plus petit que -1,96", "on rejette l’hypothèse nulle.", "Il y a assez de preuves pour", "dire que la moyenne est différente de 12 g."]
          }
        },
        intermediate: {
          EN: {
            prompt: "A random sample of frogs yields a sample mean. The population standard deviation is known, and the sample size is large. We want to determine whether the average weight differs from 12g. The test statistic is z = -2.25. At a significance level of 5%, the critical region is below -1.96 or above 1.96.",
            options: ["Since", "suggests no deviation from 12g.", "conclude that the population mean is not 12g.", "z = -2.25", "falls in the rejection region", "we reject H₀.", "z = 0", "There is sufficient evidence to", "We used a t-test."],
            correctOrder: ["Since", "z = -2.25", "falls in the rejection region", "we reject H₀.", "There is enough evidence to", "conclude that the population mean is not 12g."]
          },
          FR: {
            prompt: "Un échantillon aléatoire de grenouilles donne une moyenne observée. L’écart-type de la population est connu et la taille de l’échantillon est grande. Nous cherchons à déterminer si le poids moyen diffère de 12 g. La statistique de test est z = -2,25. Pour un seuil de 5 %, la région critique se trouve en dessous de -1,96 ou au-dessus de 1,96.",
            options: ["on rejette l’hypothèse nulle.", "Il n’y a pas assez de preuves.", "z = -2,25", "La moyenne est égale à 12 g.", "dire que la moyenne est différente de 12 g.", "on ne rejette pas l’hypothèse nulle.", "Parce que", "Il y a assez de preuves pour", "est plus petit que -1,96"],
            correctOrder: ["Puisque", "z = -2,25", "tombe dans la région critique", "on rejette H₀.", "Il y a suffisamment de preuves pour", "conclure que la moyenne de la population n’est pas 12 g."]
          }
        },
        advanced: {
          EN: {
            prompt: "A sample drawn from a population with known variance is used to assess whether the true mean weight of a frog species equals 12g. The sampling distribution of the mean is assumed normal. With a test statistic of z = -2.25 and a significance level of α = 0.05, the critical boundaries are ±1.96.",
            options: ["Given that", "z = -2.25", "lies beyond the critical boundary of -1.96", "we reject the null hypothesis (H₀).", "This supports the inference that", "μ ≠ 12g at the 5% significance level.", "z lies inside the non-critical region.", "This implies no significant deviation from μ = 12g.", "The null hypothesis cannot be rejected."],
            correctOrder: ["Given that", "z = -2.25", "lies beyond the critical boundary of -1.96", "we reject the null hypothesis (H₀).", "This supports the inference that", "μ ≠ 12g at the 5% significance level."]
          },
          FR: {
            prompt: "Un échantillon prélevé dans une population à variance connue est utilisé pour évaluer si la moyenne réelle du poids d’une espèce de grenouille est égale à 12 g. La distribution de l’échantillonnage est supposée normale. Avec une statistique de test z = -2,25 et un niveau de signification α = 0,05, les bornes critiques sont ±1,96.",
            options: ["Étant donné que", "z = -2,25", "dépasse la borne critique de -1,96", "on rejette l’hypothèse nulle (H₀).", "Cela soutient l’inférence que", " μ ≠ 12 g au niveau de signification de 5 %.", "Cela suggère l’absence de déviation significative de μ = 12 g.", "On ne peut pas rejeter l’hypothèse nulle.", "z est dans la région non critique."],
            correctOrder: ["Étant donné que", "z = -2,25", "dépasse la borne critique de -1,96", "on rejette l’hypothèse nulle (H₀).", "Cela soutient l’inférence que", "μ ≠ 12 g au niveau de signification de 5 %."]
          }
        }
      },
      dynamicProblemData: {
        beginner: {
          EN: {
            title: "Rodent Thermoregulation",
            textStart: "A team of researchers is studying wild rodents. The average temperature is 38.5°C. What is the probability that a randomly selected rodent has a temperature",
            textEnd: "°C?",
            defaultNumber: 39.2,
            increment: 1.0,
            mu: 38.5,
            sigma: 0.7,
            explanationTemplates: {
              less: "The probability of getting a value with a z-score of {{z}} or less is about {{prob}}.",
              greater: "The probability of getting a value with a z-score of {{z}} or more is about {{prob}}.",
              between: "The probability of getting a value between z-scores of {{z1}} and {{z2}} is about {{prob}}."
            }
          },
          FR: {
            title: "Thermorégulation Chez les Rongeurs",
            textStart: "Une équipe de chercheurs étudie des rongeurs sauvages. La température moyenne est de 38,5°C. Quelle est la probabilité qu'un rongeur sélectionné au hasard ait une température",
            textEnd: "°C ?",
            defaultNumber: 39.2,
            increment: 1.0,
            mu: 38.5,
            sigma: 0.7,
            explanationTemplates: {
              less: "La probabilité d'obtenir une valeur avec un score z de {{z}} ou moins est d'environ {{prob}}.",
              greater: "La probabilité d'obtenir une valeur avec un score z de {{z}} ou plus est d'environ {{prob}}.",
              between: "La probabilité d'obtenir une valeur comprise entre les scores z de {{z1}} et {{z2}} est d'environ {{prob}}."
            }
          }
        },
        intermediate: {
          EN: {
            title: "Rodent Thermoregulation",
            textStart: "The body temperature of wild rodents follows a normal distribution with a mean of 38.5°C and a standard deviation of 0.7°C. What is the probability that a randomly selected rodent has a temperature",
            textEnd: "°C?",
            defaultNumber: 39.2,
            increment: 1.0,
            mu: 38.5,
            sigma: 0.7,
            explanationTemplates: {
              less: "A z-score of {{z}} corresponds to a cumulative probability of approximately {{prob}}.",
              greater: "A z-score of {{z}} corresponds to an upper tail probability of approximately {{prob}}.",
              between: "The area under the curve between z = {{z1}} and z = {{z2}} is approximately {{prob}}."
            }
          },
          FR: {
            title: "Thermorégulation Chez les Rongeurs",
            textStart: "La température corporelle des rongeurs sauvages suit une distribution normale avec une moyenne de 38,5°C et un écart-type de 0,7°C. Quelle est la probabilité qu'un rongeur sélectionné au hasard ait une température",
            textEnd: "°C ?",
            defaultNumber: 39.2,
            increment: 1.0,
            mu: 38.5,
            sigma: 0.7,
            explanationTemplates: {
              less: "Un score z de {{z}} correspond à une probabilité cumulée d'environ {{prob}}.",
              greater: "Un score z de {{z}} correspond à une probabilité dans la queue supérieure d'environ {{prob}}.",
              between: "L'aire sous la courbe entre z = {{z1}} et z = {{z2}} est d'environ {{prob}}."
            }
          }
        },
        advanced: {
          EN: {
            title: "Rodent Thermoregulation",
            textStart: "Within a population of wild rodents, core body temperature is modeled by a normal distribution with parameters μ = 38.5°C and σ = 0.7°C. Determine the probability that a randomly selected individual exhibits a temperature",
            textEnd: "°C?",
            defaultNumber: 39.2,
            increment: 1.0,
            mu: 38.5,
            sigma: 0.7,
            explanationTemplates: {
              less: "The lower tail probability for z = {{z}} evaluates to approximately {{prob}}.",
              greater: "The upper tail probability for z = {{z}} is approximately {{prob}}.",
              between: "The probability mass bounded by z ∈ [{{z1}}, {{z2}}] integrates to approximately {{prob}}."
            }
          },
          FR: {
            title: "Thermorégulation Chez les Rongeurs",
            textStart: "Au sein d'une population de rongeurs sauvages, la température corporelle centrale est modélisée par une distribution normale avec les paramètres μ = 38,5°C et σ = 0,7°C. Déterminez la probabilité qu'un individu sélectionné au hasard présente une température",
            textEnd: "°C ?",
            defaultNumber: 39.2,
            increment: 1.0,
            mu: 38.5,
            sigma: 0.7,
            explanationTemplates: {
              less: "La probabilité de la queue inférieure pour z = {{z}} est évaluée à environ {{prob}}.",
              greater: "La probabilité de la queue supérieure pour z = {{z}} est d'environ {{prob}}.",
              between: "La masse de probabilité délimitée par z ∈ [{{z1}}, {{z2}}] s'intègre à environ {{prob}}."
            }
          }
        }
      }
    },
  ]);

  //function for problem generator
  const generateNewProblem = () => {

    //CALL GENERATED PROBLEMS HERE <-------------------------------------------------------------

    //placeholder
    const newlyGeneratedProblem: ContentItem = {
      title: {EN: '', FR: ''},
      beginner: {EN: '', FR: ''},
      intermediate: {EN: '', FR: ''},
      advanced: {EN: '', FR: ''},
    };

    //Update the state
    setProblems((prevProblems) => [...prevProblems, newlyGeneratedProblem]);
  };

  const handleLanguageChange = (selectedLang : Language) => {
    setCurrentLanguage(selectedLang);
  };

  const displayTitle = () => {
    if (activeIndex === 3 && dynamicTask) {
      return dynamicTask.title; // Use the specific interactive title
    }
    // Fallback to the main problem title for the reading section
    return currentProblem?.title[currentLanguage]; 
  };

  const currentProblem = problems.length > 0 ? problems[0] : null;
  const dynamicProblemText = currentProblem ? currentProblem[difficulty][currentLanguage] : "";
  const currentGooeyItems = difficultyKeys.map(key => difficultyLabels[currentLanguage][key]);
  const dragDropTask = currentProblem?.dragDropData ? currentProblem.dragDropData[difficulty][currentLanguage] : null;
  const dynamicTask = currentProblem?.dynamicProblemData ? currentProblem.dynamicProblemData[difficulty][currentLanguage] : null;
  const bilingualTask = currentProblem?.bilingualReadingData ? currentProblem.bilingualReadingData[difficulty] : null;
  
  return (
    <div className="relative min-h-screen flex flex-col w-full overflow-hidden bg-black">
      <GridPattern width={60} height={60} x={-1} y={-1} className={cn("stroke-white/5")} />
      
      <div className="relative z-50 flex items-start justify-between w-full p-4 pointer-events-none">
        <div className="pointer-events-auto">
          <CardNav
            logo={null}
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
            {activeIndex !== 1 && activeIndex !== 2 && (
              <h1 className={cn("text-2xl md:text-5xl font-extrabold text-white tracking-tight mb-6 bg-clip-text bg-gradient-to-b from-white to-zinc-400", inter.className)}>
                {displayTitle()}
              </h1>
            )}

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
                  return dragDropTask ? <DragDropCanvas taskData={dragDropTask} language={currentLanguage} /> : <div className="text-zinc-500 py-10">Data not available</div>;
                case 2:
                  return bilingualTask ? (
                    <BilingualHighlighter taskData={bilingualTask} currentLanguage={currentLanguage} />
                  ) : (
                    <div className="text-zinc-500 py-10">Data not available</div>
                  );
                case 3:
                  return dynamicTask ? <DynamicProblemCanvas taskData={dynamicTask} language={currentLanguage} /> : <div className="text-zinc-500 py-10">Data not available</div>;
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