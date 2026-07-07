"use client";
import DesktopBilingualHighlighter from "./DesktopBilingualHighlighter";
import MobileBilingualHighlighter from "./MobileBilingualHighlighter";
import { useWindowSize } from "@/lib/useWindowSize";

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

export interface BilingualHighlighterProps {
  taskData: BilingualTask;
  currentLanguage: "EN" | "FR";
}

export default function BilingualHighlighter({ taskData, currentLanguage }: BilingualHighlighterProps) {
  const isMobile = useWindowSize();

  if (!taskData) return null;

  return isMobile ? (
    <MobileBilingualHighlighter taskData={taskData} currentLanguage={currentLanguage} />
  ) : (
    <DesktopBilingualHighlighter taskData={taskData} currentLanguage={currentLanguage} />
  );
}