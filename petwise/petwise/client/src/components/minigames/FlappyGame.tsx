import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bird, Skull } from "lucide-react";

interface FlappyGameProps {
  onComplete: (score: number) => void;
  onCancel: () => void;
  themeColors?: { border: string; text: string; bg: string };
  petType?: string;
}

export function FlappyGame({ onComplete, onCancel, themeColors, petType = "dog" }: FlappyGameProps) {
  const [birdY, setBirdY] = useState(150);
  const [velocity, setVelocity] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [pipes, setPipes] = useState<{ x: number; height: number }[]>([]);
  const [countdown, setCountdown] = useState(3);
  const gameRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);

  const GRAVITY = 0.5; // Slower gravity
  const JUMP = -6; // Slower jump
  const PIPE_SPEED = 2; // Slower pipes
  const PIPE_WIDTH = 45;
  const GAP = 140; // Slightly larger gap for slower gameplay

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleJump = () => {
    if (gameOver || countdown > 0) return;
    
    // Play coin sound like a super cool retro game
    const audio = new Audio("https://raw.githubusercontent.com/gracejzhu/petwise/main/coin_sound.mp3");
    audio.play().catch(() => {});
    
    setVelocity(JUMP);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        handleJump();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver || countdown > 0) return;

    const update = () => {
      setBirdY(y => {
        const nextY = y + velocity;
        if (nextY > 275 || nextY < 0) {
          setGameOver(true);
          return nextY > 275 ? 275 : 0;
        }
        return nextY;
      });
      setVelocity(v => v + GRAVITY);

      setPipes(currentPipes => {
        let newPipes = currentPipes
          .map(p => ({ ...p, x: p.x - PIPE_SPEED }))
          .filter(p => p.x + PIPE_WIDTH > 0);

        if (newPipes.length === 0 || newPipes[newPipes.length - 1].x < 140) {
          newPipes.push({ x: 300, height: Math.random() * 140 + 30 });
        }

        const birdRect = { top: birdY + 5, bottom: birdY + 25, left: 55, right: 75 };
        for (const pipe of newPipes) {
          if (birdRect.right > pipe.x && birdRect.left < pipe.x + PIPE_WIDTH) {
            if (birdRect.top < pipe.height || birdRect.bottom > pipe.height + GAP) {
              setGameOver(true);
            }
          }
          if (pipe.x + PIPE_SPEED >= 50 && pipe.x < 50) {
            setScore(s => s + 1);
          }
        }

        return newPipes;
      });

      requestRef.current = requestAnimationFrame(update);
    };

    requestRef.current = requestAnimationFrame(update);
    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [gameOver, birdY, velocity, countdown]);

  return (
    <Card 
      className="p-6 border-8 border-black rounded-none shadow-[8px_8px_0_0_rgba(0,0,0,1)]"
      style={{ backgroundColor: themeColors?.bg || 'white', borderColor: themeColors?.border || 'black' }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-display font-bold text-2xl uppercase tracking-tighter" style={{ color: themeColors?.text }}>Flappy Pet</h2>
        <span className="font-display font-bold" style={{ color: themeColors?.text }}>Score: {score}</span>
      </div>
      <div 
        ref={gameRef}
        className="relative w-[300px] h-[300px] border-4 border-black overflow-hidden mx-auto mb-4 bg-black/5"
        style={{ borderColor: themeColors?.border }}
        onClick={handleJump}
      >
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
        <div 
          className="absolute left-[50px] transition-transform"
          style={{ top: birdY, transform: `rotate(${velocity * 3}deg)` }}
        >
          {gameOver ? (
            <img 
              src={`https://raw.githubusercontent.com/gracejzhu/petwise/refs/heads/main/${petType}_headsad.png`} 
              alt="dead pet" 
              className="w-10 h-10 pixelated" 
            />
          ) : (
            <img 
              src={`https://raw.githubusercontent.com/gracejzhu/petwise/refs/heads/main/${petType}_headhappy.png`} 
              alt="flappy pet" 
              className="w-10 h-10 pixelated" 
            />
          )}
        </div>
        {pipes.map((pipe, i) => (
          <div key={i}>
            <div 
              className="absolute border-l-4 border-r-4 border-black" 
              style={{ 
                left: pipe.x, top: 0, width: PIPE_WIDTH, height: pipe.height,
                backgroundColor: themeColors?.text, borderColor: themeColors?.border
              }} 
            />
            <div 
              className="absolute border-l-4 border-r-4 border-black" 
              style={{ 
                left: pipe.x, top: pipe.height + GAP, width: PIPE_WIDTH, height: 300 - pipe.height - GAP,
                backgroundColor: themeColors?.text, borderColor: themeColors?.border
              }} 
            />
          </div>
        ))}
      </div>
      {gameOver ? (
        <Button 
          className="w-full border-4 border-black rounded-none font-display uppercase font-bold" 
          onClick={() => onComplete(score * 5)}
          style={{ borderColor: themeColors?.border }}
        >
          Claim {score * 5} Coins
        </Button>
      ) : (
        <Button 
          variant="outline" 
          className="w-full border-4 border-black rounded-none font-display uppercase font-bold" 
          onClick={onCancel}
          style={{ borderColor: themeColors?.border, color: themeColors?.text }}
        >
          Quit
        </Button>
      )}
    </Card>
  );
}
