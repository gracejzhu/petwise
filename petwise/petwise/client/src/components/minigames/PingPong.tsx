import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PingPongProps {
  onComplete: (score: number) => void;
  onCancel: () => void;
  themeColors?: { border: string; text: string; bg: string };
}

export function PingPong({ onComplete, onCancel, themeColors }: PingPongProps) {
  const [ball, setBall] = useState({ x: 150, y: 150, dx: 2, dy: 2 }); // Even slower initial speed
  const [paddle, setPaddle] = useState(125);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const requestRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const PADDLE_WIDTH = 80; // Larger paddle for slower gameplay
  const BALL_SIZE = 12;
  const GAME_WIDTH = 300;
  const GAME_HEIGHT = 300;

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || countdown > 0) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      setPaddle(Math.max(0, Math.min(GAME_WIDTH - PADDLE_WIDTH, x - PADDLE_WIDTH / 2)));
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [countdown]);

  useEffect(() => {
    if (gameOver || countdown > 0) return;

    const update = () => {
      setBall(prev => {
        let { x, y, dx, dy } = prev;
        x += dx;
        y += dy;

        // Wall collisions
        if (x <= 0 || x >= GAME_WIDTH - BALL_SIZE) dx = -dx;
        if (y <= 0) dy = -dy;

        // Paddle collision
        if (y >= GAME_HEIGHT - BALL_SIZE - 20) { // Check collision slightly above the paddle visually
          if (x + BALL_SIZE >= paddle && x <= paddle + PADDLE_WIDTH && dy > 0) {
            // Play bounce sound
            const audio = new Audio("https://raw.githubusercontent.com/gracejzhu/petwise/main/ball-bouncing_sound.mp3");
            audio.play().catch(() => {});

            dy = -Math.abs(dy); // Reverse vertical direction
            // Add some horizontal influence based on where it hit the paddle
            const hitPoint = (x + BALL_SIZE / 2 - (paddle + PADDLE_WIDTH / 2)) / (PADDLE_WIDTH / 2);
            dx = dx + hitPoint * 2; 
            
            // Speed cap
            const speed = Math.sqrt(dx*dx + dy*dy);
            if (speed < 8) {
              dx *= 1.1;
              dy *= 1.1;
            }

            setScore(s => s + 1);
            y = GAME_HEIGHT - BALL_SIZE - 21; // Reposition above paddle
          } else if (y >= GAME_HEIGHT) {
            setGameOver(true);
          }
        }

        return { x, y, dx, dy };
      });
      requestRef.current = requestAnimationFrame(update);
    };

    requestRef.current = requestAnimationFrame(update);
    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [gameOver, paddle, countdown]);

  return (
    <Card 
      className="p-6 border-8 border-black rounded-none shadow-[8px_8px_0_0_rgba(0,0,0,1)]"
      style={{ backgroundColor: themeColors?.bg || 'white', borderColor: themeColors?.border || 'black' }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-display font-bold text-2xl uppercase tracking-tighter" style={{ color: themeColors?.text }}>Ping Pong</h2>
        <span className="font-display font-bold" style={{ color: themeColors?.text }}>Score: {score}</span>
      </div>
      <div 
        ref={containerRef}
        className="relative border-4 border-black overflow-hidden mx-auto mb-4 bg-black/5"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT, borderColor: themeColors?.border }}
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
          className="absolute overflow-hidden"
          style={{ 
            left: ball.x, 
            top: ball.y, 
            width: BALL_SIZE, 
            height: BALL_SIZE,
          }}
        >
          <img 
            src="https://raw.githubusercontent.com/gracejzhu/petwise/main/pingpong_ball.png" 
            alt="ping pong ball" 
            className="w-full h-full object-contain pixelated"
            onError={(e) => {
              // Fallback to solid color if image fails
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).parentElement!.style.backgroundColor = themeColors?.text || 'black';
              (e.target as HTMLImageElement).parentElement!.style.borderRadius = '50%';
            }}
          />
        </div>
        <div 
          className="absolute bottom-2 bg-primary h-3 border-2 border-black"
          style={{ 
            left: paddle, 
            width: PADDLE_WIDTH,
            backgroundColor: themeColors?.text,
            borderColor: themeColors?.border
          }}
        />
      </div>
      {gameOver ? (
        <Button 
          className="w-full border-4 border-black rounded-none font-display uppercase font-bold" 
          onClick={() => onComplete(score * 10)}
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
