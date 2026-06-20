import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: (logs: any[], pet: any) => boolean;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "rich",
    name: "Money Maker",
    description: "Reach 500 coins",
    icon: "https://raw.githubusercontent.com/gracejzhu/petwise/main/coin_icon.png",
    requirement: (_, pet) => pet.coins >= 500
  },
  {
    id: "active",
    name: "Busy Bee",
    description: "Complete 10 activities",
    icon: "https://raw.githubusercontent.com/gracejzhu/petwise/main/cat_playing.png",
    requirement: (logs) => logs.length >= 10
  },
  {
    id: "healthy",
    name: "Fit as a Fiddle",
    description: "Reach 100% health",
    icon: "https://raw.githubusercontent.com/gracejzhu/petwise/main/health_icon.png",
    requirement: (_, pet) => pet.health >= 100
  },
  {
    id: "happy",
    name: "Joyful Soul",
    description: "Reach 100% happiness",
    icon: "https://raw.githubusercontent.com/gracejzhu/petwise/main/happiness_icon.png",
    requirement: (_, pet) => pet.happiness >= 100
  }
];

export function Achievements({ logs, pet }: { logs: any[], pet: any }) {
  return (
    <div className="border-4 p-4 theme-border theme-shadow bg-white/50 space-y-3">
      <h3 className="font-display font-bold text-lg uppercase tracking-tighter theme-text">Milestones</h3>
      <div className="flex flex-wrap gap-4 justify-center">
        <TooltipProvider>
          {ACHIEVEMENTS.map((ach) => {
            const isUnlocked = ach.requirement(logs, pet);
            return (
              <Tooltip key={ach.id}>
                <TooltipTrigger asChild>
                  <motion.div
                    initial={false}
                    animate={{ scale: isUnlocked ? 1 : 0.9, opacity: isUnlocked ? 1 : 0.3 }}
                    className="relative group"
                  >
                    <img 
                      src={ach.icon} 
                      alt={ach.name} 
                      className="w-12 h-12 pixelated object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://img.icons8.com/pixel-surprised/64/trophy.png";
                      }}
                    />
                    {isUnlocked && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"
                      />
                    )}
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent className="border-4 rounded-none font-display uppercase text-xs">
                  <p className="font-bold">{ach.name}</p>
                  <p className="opacity-70">{ach.description}</p>
                  {!isUnlocked && <p className="text-red-500 mt-1">Locked</p>}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>
    </div>
  );
}
