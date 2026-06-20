import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Github, 
  Code, 
  Terminal, 
  Cpu, 
  Globe, 
  Database, 
  Layout, 
  Settings,
  LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MemoryGameProps {
  onComplete: (score: number) => void;
  onCancel: () => void;
  themeColors?: { border: string; text: string; bg: string };
}

const MEMORY_IMAGES = [
  "https://raw.githubusercontent.com/gracejzhu/petwise/main/dog_idle.png",
  "https://raw.githubusercontent.com/gracejzhu/petwise/main/cat_idle.png",
  "https://raw.githubusercontent.com/gracejzhu/petwise/main/rabbit_idle.png",
  "https://raw.githubusercontent.com/gracejzhu/petwise/main/dog_eating.png",
  "https://raw.githubusercontent.com/gracejzhu/petwise/main/cat_eating.png",
  "https://raw.githubusercontent.com/gracejzhu/petwise/main/rabbit_eating.png",
  "https://raw.githubusercontent.com/gracejzhu/petwise/main/dog_playing.png",
  "https://raw.githubusercontent.com/gracejzhu/petwise/main/cat_playing.png",
];

export function MemoryGame({ onComplete, onCancel, themeColors }: MemoryGameProps) {
  const [cards, setCards] = useState<{ id: number; image: string; flipped: boolean; matched: boolean }[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    const gameImages = [...MEMORY_IMAGES, ...MEMORY_IMAGES];
    const shuffled = gameImages
      .sort(() => Math.random() - 0.5)
      .map((image, index) => ({ id: index, image, flipped: false, matched: false }));
    setCards(shuffled);
  }, []);

  const handleCardClick = (index: number) => {
    if (countdown > 0 || flippedIndices.length === 2 || cards[index].flipped || cards[index].matched) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      if (cards[first].image === cards[second].image) {
        setTimeout(() => {
          const matchedCards = [...newCards];
          matchedCards[first].matched = true;
          matchedCards[second].matched = true;
          setCards(matchedCards);
          setFlippedIndices([]);
          
          if (matchedCards.every(c => c.matched)) {
            onComplete(Math.max(10, 50 - moves));
          }
        }, 500);
      } else {
        setTimeout(() => {
          const resetCards = [...newCards];
          resetCards[first].flipped = false;
          resetCards[second].flipped = false;
          setCards(resetCards);
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  return (
    <Card 
      className="p-6 border-8 border-black rounded-none shadow-[8px_8px_0_0_rgba(0,0,0,1)]"
      style={{ backgroundColor: themeColors?.bg || 'white', borderColor: themeColors?.border || 'black' }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-display font-bold text-2xl uppercase tracking-tighter" style={{ color: themeColors?.text }}>Memory Match</h2>
        <span className="font-display font-bold" style={{ color: themeColors?.text }}>Moves: {moves}</span>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-6 relative">
        {countdown > 0 && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm pointer-events-none">
            <motion.span 
              key={countdown}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 1 }}
              className="text-6xl font-display font-bold"
              style={{ color: themeColors?.text }}
            >
              {countdown}
            </motion.span>
          </div>
        )}
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "aspect-square border-4 border-black flex items-center justify-center cursor-pointer transition-colors",
              card.flipped || card.matched ? "bg-primary text-primary-foreground" : "bg-white/50"
            )}
            style={{ 
              borderColor: themeColors?.border || 'black',
              backgroundColor: (card.flipped || card.matched) ? themeColors?.text : undefined
            }}
            onClick={() => handleCardClick(index)}
          >
            {(card.flipped || card.matched) && (
              <img 
                src={card.image} 
                alt="memory card" 
                className="w-12 h-12 pixelated object-contain" 
              />
            )}
          </motion.div>
        ))}
      </div>
      <Button 
        variant="outline" 
        className="w-full border-4 border-black rounded-none font-display uppercase font-bold" 
        onClick={onCancel}
        style={{ borderColor: themeColors?.border, color: themeColors?.text }}
      >
        Quit Game
      </Button>
    </Card>
  );
}
