"use client";
import DesktopDynamicProblemCanvas from "./DesktopDynamicProblemCanvas";
import MobileDynamicProblemCanvas from "./MobileDynamicProblemCanvas";
import { useWindowSize } from "@/lib/useWindowSize";

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

export interface DynamicProblemCanvasProps {
  taskData: DynamicProblemTask;
  language: "EN" | "FR";
}

export default function DynamicProblemCanvas({ taskData, language }: DynamicProblemCanvasProps) {
  const isMobile = useWindowSize();

  if (!taskData) return null;

  return isMobile ? (
    <MobileDynamicProblemCanvas taskData={taskData} language={language} />
  ) : (
    <DesktopDynamicProblemCanvas taskData={taskData} language={language} />
  );
}