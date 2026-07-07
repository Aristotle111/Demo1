"use client";
import DesktopDragDropCanvas from "./DesktopDragDropCanvas";
import MobileDragDropCanvas from "./MobileDragDropCanvas";
import { useWindowSize } from "@/lib/useWindowSize";

export interface DragDropTask {
  prompt: string;
  options: string[];
  correctOrder: string[];
}

export interface DragDropCanvasProps {
  taskData: DragDropTask;
  language: "EN" | "FR";
}

export default function DragDropCanvas({ taskData, language }: DragDropCanvasProps) {
  const isMobile = useWindowSize();

  if (!taskData) return null;

  return isMobile ? (
    <MobileDragDropCanvas taskData={taskData} language={language} />
  ) : (
    <DesktopDragDropCanvas taskData={taskData} language={language} />
  );
}