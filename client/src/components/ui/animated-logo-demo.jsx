import React, { useState } from "react";
import { AnimatedLogo } from "@/components/ui/animated-logo";
import { Button } from "@/components/ui/button";

export function AnimatedLogoDemo() {
  const [key, setKey] = useState(0);

  const handleRestart = () => {
    setKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 space-y-12">
      <div key={key} className="flex flex-col items-center justify-center space-y-8 my-auto">
        {/* Render 1: React Component */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold">React Component</span>
          <AnimatedLogo size={260} />
        </div>

        {/* Render 2: Pure SVG File Image */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold">SVG File Image</span>
          <img src="/logoanimi_animated.svg" alt="Animated Logo" className="w-72 h-auto" />
        </div>
      </div>

      <div className="mb-8">
        <Button
          onClick={handleRestart}
          variant="outline"
          className="border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-200 px-6 py-2.5 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
        >
          Restart Animation
        </Button>
      </div>
    </div>
  );
}

export default AnimatedLogoDemo;
