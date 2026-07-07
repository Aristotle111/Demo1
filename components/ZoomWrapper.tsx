"use client";

import { useEffect } from "react";

export default function ZoomWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        if (window.innerWidth >= 1024) {
          const scale = window.innerWidth / 2560;
          document.body.style.zoom = Math.min(scale, 1).toString();
        } else {
          document.body.style.zoom = "1";
        }
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <>{children}</>;
}