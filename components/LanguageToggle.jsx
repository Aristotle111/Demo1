"use client";

import { useState } from "react";

const LanguageToggle = ({ onChange }) => {
  const [lang, setLang] = useState("EN"); // Default to English

  const toggleLanguage = () => {
    const nextLang = lang === "EN" ? "FR" : "EN";
    setLang(nextLang);
    if (typeof onChange === "function") {
      onChange(nextLang);
    }
  };

  return (
    <button
      onClick={toggleLanguage}
      className="group relative flex items-center justify-center w-20 h-10 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 backdrop-blur-md text-white font-medium text-sm transition-all duration-200 active:scale-95 select-none"
      aria-label={`Switch language. Current language is ${lang === "EN" ? "English" : "French"}`}
    >
      {lang === "EN" ? (
        <span className="relative tracking-wide">
          ENG
          <span className="absolute -top-1.5 -right-3.5 text-[9px] font-bold text-zinc-500 group-hover:text-zinc-400 scale-75 transition-colors">
            GB
          </span>
        </span>
      ) : (
        <span className="relative tracking-wide">
          FRA
          <span className="absolute -top-1.5 -right-3.5 text-[9px] font-bold text-zinc-500 group-hover:text-zinc-400 scale-75 transition-colors">
            FR
          </span>
        </span>
      )}
    </button>
  );
};

export default LanguageToggle;