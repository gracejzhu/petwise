import { usePet, useActivities, useLogs, usePerformAction, useResetGame, useUpdatePet } from "@/hooks/use-game";
import { PetDisplay } from "@/components/PetDisplay";
import { StatBar } from "@/components/StatBar";
import { ActivityCard } from "@/components/ActivityCard";
import { Achievements } from "@/components/Achievements";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Heart, Zap, Drumstick, BriefcaseMedical, History, Coins, RotateCcw, Palette, Timer, Volume2, VolumeX, Skull, Wind } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MemoryGame } from "@/components/minigames/MemoryGame";
import { FlappyGame } from "@/components/minigames/FlappyGame";
import { PingPong } from "@/components/minigames/PingPong";
import { PhotoBooth } from "@/components/PhotoBooth";
import { useState, useEffect, useRef } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Dashboard() {
  const { data: pet, isLoading: isPetLoading } = usePet();
  const { data: activities, updateActivity } = useActivities();
  const { data: logs } = useLogs();
  const performAction = usePerformAction();
  const updatePet = useUpdatePet();
  const resetGame = useResetGame();
  const { toast } = useToast();

  const [activeGame, setActiveGame] = useState<"memory" | "flappy" | "pingpong" | "photobooth" | null>(null);
  const [lastGameIndex, setLastGameIndex] = useState(2); // Start so first is Flappy (index 1)
  const [pendingChore, setPendingChore] = useState<{ id: number; name: string; cost: number } | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isEating, setIsEating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [choreCooldown, setChoreCooldown] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!pet) return;
    
    // Determine if pet is dead or ran away
    const isDead = pet.health <= 0 || pet.hunger <= 0;
    const ranAway = pet.happiness <= 0 && !isDead;
    const isDeadOrRanAway = isDead || ranAway;
    
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    const MUSIC_URLS = {
      death: "https://raw.githubusercontent.com/gracejzhu/petwise/main/death_music.mp3",
      idle: "https://raw.githubusercontent.com/gracejzhu/petwise/main/Bubbles.wav",
      sleep: "https://raw.githubusercontent.com/gracejzhu/petwise/main/Unwind.wav"
    };
    
    // Select appropriate track based on pet state
    let track: string;
    if (isDeadOrRanAway) {
      track = MUSIC_URLS.death;
    } else {
      track = pet.isSleeping ? MUSIC_URLS.sleep : MUSIC_URLS.idle;
    }
    
    audioRef.current = new Audio(track);
    audioRef.current.loop = true;
    audioRef.current.muted = isMuted;
    
    if (!isMuted) {
      audioRef.current.play().catch(() => {});
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [pet?.isSleeping, pet?.health, pet?.hunger, pet?.happiness, isMuted]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        updatePet.mutate({ isPaused: true });
      } else {
        updatePet.mutate({ isPaused: false });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  if (isPetLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!pet) return null;

  const bgColors = [
    { name: "default", value: "bg-gray-100/100" }, /*Theme colors!*/
    { name: "high contrast mode", value: "bg-slate-950/100" },
    { name: "mint green", value: "bg-emerald-100/100" },
    { name: "sky blue", value: "bg-sky-100/100" },
    { name: "peach", value: "bg-orange-100/100" },
    { name: "lavender", value: "bg-purple-100/100" },
    { name: "rose", value: "bg-rose-100/100" },
  ];

  const handleBgChange = (color: string) => {
    updatePet.mutate({ backgroundColor: color });
  };

  const handleAction = (activityId: number, name: string, cost: number) => {
    if (pet.coins < cost) {
      toast({
        variant: "destructive",
        title: "Not enough coins!",
        description: "Your pet needs you to save up more coins.",
      });
      return;
    }

    const activity = activities?.find(a => a.id === activityId);
    if (activity?.category === 'work') {
      if (choreCooldown > 0) return; // Prevent clicking if frontend cooldown active
      
      setPendingChore({ id: activityId, name, cost });
      const gameSequence: ("flappy" | "pingpong" | "memory")[] = ["flappy", "pingpong", "memory"];
      const nextIndex = (lastGameIndex + 1) % 3;
      setLastGameIndex(nextIndex);
      setActiveGame(gameSequence[nextIndex]);
      return;
    }

    if (activity?.category === 'food') {
      setIsEating(true);
      const audio = new Audio("https://raw.githubusercontent.com/gracejzhu/petwise/main/eating_sound.mp3");
      audio.play().catch(() => {});
      setTimeout(() => setIsEating(false), 2000);
    } else if (activity?.category === 'play') {
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 2000);
    }

    performAction.mutate({ activityId }, {
      onSuccess: (updatedPet) => {
        // Find activity details for better toast
        const activity = activities?.find(a => a.id === activityId);
        
        toast({
          title: `Used ${name}!`,
          description: (
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground">{activity?.description}</span>
              <span className="font-bold text-amber-500">-{cost} Coins</span>
            </div>
          ),
        });
      },
      onError: (err) => {
        toast({
          variant: "destructive",
          title: "Action Failed",
          description: err.message,
        });
      }
    });
  };

  const onMinigameComplete = (bonusCoins: number) => {
    if (!pendingChore) return;
    
    // Immediately disable the active game to prevent double submission
    const currentBonus = bonusCoins;
    const currentChore = pendingChore;
    
    setActiveGame(null);
    setPendingChore(null);
    
    performAction.mutate({ activityId: currentChore.id }, {
      onSuccess: (updatedPet) => {
        // Clear cooldown immediately on frontend to match server state if needed
        // but server sets lastChoreAt, so we rely on that syncing back.
        
        toast({
          title: "Chore Completed!",
          description: `You earned ${currentBonus} bonus coins from the minigame!`,
        });
      },
      onError: (err) => {
        // Silently handle "wait" errors from server if frontend didn't catch it
        if (!err.message.includes("wait")) {
          toast({
            variant: "destructive",
            title: "Action Failed",
            description: err.message,
          });
        }
      }
    });
  };

  const handleReset = () => {
    resetGame.mutate(undefined, {
      onSuccess: () => {
        toast({ title: "Game Reset", description: "Starting fresh!" });
      }
    });
  };

  useEffect(() => {
    if (!pet?.lastChoreAt) return;
    
    const updateCooldown = () => {
      const lastChore = new Date(pet.lastChoreAt!);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - lastChore.getTime()) / 1000);
      const remaining = Math.max(0, 5 - diffInSeconds);
      setChoreCooldown(remaining);
    };

    updateCooldown();
    const interval = setInterval(updateCooldown, 100); 
    return () => clearInterval(interval);
  }, [pet?.lastChoreAt]);

  const categories = {
    food: { icon: <img src="https://raw.githubusercontent.com/gracejzhu/petwise/refs/heads/main/food_icon.png" className="w-5 h-4" />, label: "Food" },
    play: { icon: <img src="https://raw.githubusercontent.com/gracejzhu/petwise/refs/heads/main/play_icon.png" className="w-4 h-4" />, label: "Play" },
    health: { icon: <img src="https://raw.githubusercontent.com/gracejzhu/petwise/refs/heads/main/health_icon.png" className="w-4 h-4" />, label: "Health" },
    sleep: { icon: <img src="https://raw.githubusercontent.com/gracejzhu/petwise/refs/heads/main/sleep_icon.png" className="w-4 h-4" />, label: "Sleep" },
    work:  { icon: <img src="https://raw.githubusercontent.com/gracejzhu/petwise/refs/heads/main/coin_icon.png" className="w-4 h-4" />, label: "Chores" },
  };

  const isDead = pet.health <= 0 || pet.hunger <= 0;
  const ranAway = pet.happiness <= 0 && !isDead;

  const bgToHover = {
    "bg-emerald-100/100": "hover:bg-emerald-200",
    "bg-sky-100/100": "hover:bg-sky-200",
    "bg-orange-100/100": "hover:bg-orange-200",
    "bg-purple-100/100": "hover:bg-purple-200",
    "bg-rose-100/100": "hover:bg-rose-200",
    "bg-gray-100/100": "hover:bg-gray-200",
    "bg-slate-950/100": "hover:bg-slate-900",
  };

  const bgToTheme = {
    "bg-emerald-100/100": { border: "#064e3b", text: "#064e3b", bg: "#d1fae5" },
    "bg-sky-100/100": { border: "#0c4a6e", text: "#0c4a6e", bg: "#e0f2fe" },
    "bg-orange-100/100": { border: "#7c2d12", text: "#7c2d12", bg: "#ffedd5" },
    "bg-purple-100/100": { border: "#581c87", text: "#581c87", bg: "#f3e8ff" },
    "bg-rose-100/100": { border: "#881337", text: "#881337", bg: "#ffe4e6" },
    "bg-gray-100/100": { border: "#111827", text: "#111827", bg: "#f3f4f6" },
    "bg-slate-950/100": { border: "#f8fafc", text: "#f8fafc", bg: "#020617" },
  };

  const currentTheme = bgToTheme[pet.backgroundColor as keyof typeof bgToTheme] || bgToTheme["bg-gray-100/100"];

  const themeStyle = {
    "--theme-border-color": currentTheme.border,
    "--theme-text-color": currentTheme.text,
    "--theme-bg-color": currentTheme.bg,
  } as React.CSSProperties;

  const hoverClass = bgToHover[pet.backgroundColor as keyof typeof bgToHover] || "hover:bg-accent";
  const boxBgClass = pet.backgroundColor.split('/')[0];

  if (isDead || ranAway) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 font-body relative overflow-hidden">
        {/* Background Image Placeholder */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0" 
          style={{ 
            backgroundImage: `url(https://raw.githubusercontent.com/gracejzhu/petwise/main/${isDead ? 'petwise_deathbg.png' : 'petwise_deathbg.png'})`,
            backgroundColor: isDead ? '#1a1a1a' : '#2d3748'
          }}
        />
        
        {/* Rain Particles */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-sky-200/40 w-[2px] h-[15px]"
              initial={{ 
                top: -20, 
                left: `${Math.random() * 100}%` 
              }}
              animate={{ 
                top: '110%' 
              }}
              transition={{ 
                duration: 0.5 + Math.random() * 0.5, 
                repeat: Infinity, 
                ease: "linear",
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={cn("max-w-md w-full rounded-none p-8 text-center space-y-6 border-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)] theme-border theme-shadow relative z-20", boxBgClass)}
        >
          <div className="flex justify-center mb-4">
            {isDead ? (
              <img 
                src="https://raw.githubusercontent.com/gracejzhu/petwise/main/gravestone.png" 
                alt="grave" 
                className="w-24 h-24 pixelated"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  const fallback = document.createElement('div');
                  fallback.className = 'w-24 h-24 flex items-center justify-center';
                  fallback.innerHTML = '<svg class="w-24 h-24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C12 2 8 6 8 12c0 2.21 1.79 4 4 4s4-1.79 4-4c0-6-4-10-4-10z"/></svg>';
                  (e.target as HTMLImageElement).parentElement?.appendChild(fallback);
                }}
                style={{ color: 'currentColor' }} 
              />
            ) : (
              <Wind className="w-24 h-24 theme-text" />
            )}
          </div>
          <h1 className="font-display font-bold text-4xl text-gray-900 tracking-tighter uppercase theme-text bg-white">
            {isDead ? "Game Over" : "Oh No!"}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed font-body theme-text bg-white">
            {pet.health <= 0 ? `${pet.name} succumbed to illness...` : 
             pet.hunger <= 0 ? `${pet.name} was too hungry to continue...` :
             `${pet.name} felt neglected and ran away to find a new home.`}
          </p>
          <Button 
            size="lg" 
            className="w-full h-16 text-xl font-display font-bold rounded-none border-4 theme-border theme-shadow transition-all uppercase bg-blue-700 theme-text hover:opacity-90 active:translate-y-1"
            onClick={() => resetGame.mutate()}
            disabled={resetGame.isPending}
          >
            {resetGame.isPending ? <Loader2 className="animate-spin" /> : "Start Over"}
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen p-4 md:p-8 font-body transition-colors duration-500", pet.backgroundColor)} style={themeStyle}>
      <div className="max-w-7xl mx-auto space-y-8">
        
        <Dialog open={activeGame !== null} onOpenChange={() => !activeGame && setActiveGame(null)}>
          <DialogContent className="sm:max-w-[425px] p-0 border-0 bg-transparent shadow-none">
            {activeGame === "memory" && (
              <MemoryGame onComplete={onMinigameComplete} onCancel={() => setActiveGame(null)} themeColors={currentTheme} />
            )}
            {activeGame === "flappy" && (
              <FlappyGame onComplete={onMinigameComplete} onCancel={() => setActiveGame(null)} themeColors={currentTheme} petType={pet.type} />
            )}
            {activeGame === "pingpong" && (
              <PingPong onComplete={onMinigameComplete} onCancel={() => setActiveGame(null)} themeColors={currentTheme} />
            )}
            {activeGame === "photobooth" && (
              <PhotoBooth pet={pet} onCancel={() => setActiveGame(null)} themeColors={currentTheme} />
            )}
          </DialogContent>
        </Dialog>

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={cn("p-6 border-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)] theme-border theme-shadow", boxBgClass)}>
              <img src="https://raw.githubusercontent.com/gracejzhu/petwise/refs/heads/main/coin_icon.png" className="w-12 h-12" />
            </div>
            <div className={cn("p-4 px-8 border-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)] theme-border theme-shadow", boxBgClass)}>
              <p className="text-lg font-display uppercase tracking-widest theme-text opacity-70">Balance</p>
              <h2 className="text-5xl font-display font-bold theme-text">{pet.coins}</h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              className={cn("w-20 h-20 border-4 transition-all no-default-hover-elevate theme-border theme-shadow !bg-[var(--theme-bg-color)]", hoverClass)}
              onClick={() => setActiveGame("photobooth")}
              data-testid="button-photo-booth"
              title="Photo Booth"
            >
              <img src="https://raw.githubusercontent.com/gracejzhu/petwise/refs/heads/main/energy_icon.png" className="w-10 h-8" onError={(e) => (e.currentTarget.src = "https://img.icons8.com/pixel-cyan/64/camera.png")} />
            </Button>

            <Button 
              variant="outline" 
              className={cn("w-20 h-20 border-4 transition-all no-default-hover-elevate theme-border theme-shadow !bg-[var(--theme-bg-color)]", hoverClass)}
              onClick={() => setIsMuted(!isMuted)}
              data-testid="button-volume-toggle"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <img src="https://raw.githubusercontent.com/gracejzhu/petwise/refs/heads/main/muted_icon.png" className="w-10 h-6" /> : <img src="https://raw.githubusercontent.com/gracejzhu/petwise/refs/heads/main/unmuted_icon.png" className="w-10 h-6" />}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className={cn("w-20 h-20 border-4 transition-all no-default-hover-elevate theme-border theme-shadow !bg-[var(--theme-bg-color)]", hoverClass)}
                  data-testid="button-theme-picker"
                  title="Choose Theme"
                >
                  {<img src="https://raw.githubusercontent.com/gracejzhu/petwise/refs/heads/main/theme_icon.png" className="w-10 h-6" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className={cn("border-4 p-2 rounded-none theme-border", boxBgClass)}>
                <div className="grid grid-cols-3 gap-3">
                  {bgColors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => handleBgChange(color.value)}
                      className={cn(
                        "w-12 h-12 border-2 theme-border hover:scale-110 transition-transform",
                        color.value,
                        pet.backgroundColor === color.value && "ring-4 ring-primary ring-offset-2"
                      )}
                      title={color.name}
                    />
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className={cn("w-20 h-20 border-4 transition-all no-default-hover-elevate theme-border theme-shadow !bg-[var(--theme-bg-color)]", hoverClass)}
                  data-testid="button-restart"
                  title="Restart Game"
                >
                  <img src="https://raw.githubusercontent.com/gracejzhu/petwise/refs/heads/main/restart_icon.png" className="w-10 h-6" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent 
                className="border-8 rounded-none max-w-sm theme-border"
                style={{ backgroundColor: currentTheme?.bg }}
              >
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-display uppercase tracking-tighter theme-text">Reset Game?</AlertDialogTitle>
                  <AlertDialogDescription className="font-body text-lg theme-text opacity-80">
                    This will permanently delete your pet and all progress. Are you sure you want to start over?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col sm:flex-row gap-2 mt-4">
                  <AlertDialogCancel asChild>
                    <Button variant="outline" className="rounded-none border-4 w-full font-display theme-border theme-text bg-[var(--theme-bg-color)]">Cancel</Button>
                  </AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button 
                      className="rounded-none border-4 w-full font-display theme-border theme-shadow transition-all bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => resetGame.mutate()}
                    >
                      Reset Game
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-8 relative">
          {/* Pet Section */}
          <section className="lg:col-span-5 space-y-6">
            <PetDisplay pet={pet} isEating={isEating} isPlaying={isPlaying} />
            
            <Achievements logs={logs || []} pet={pet} />

            <div className={cn("border-4 shadow-theme p-6 space-y-3 theme-border theme-shadow", boxBgClass)}>
              <h3 className="font-display font-bold text-xl uppercase tracking-tighter theme-text">Vitals</h3>
              <div className="grid gap-2">
                <StatBar 
                  label="Saturation"
                  value={pet.hunger} 
                  icon={<img src="https://raw.githubusercontent.com/gracejzhu/petwise/refs/heads/main/food_icon.png" className="w-5 h-4" />}
                colorClass={pet.hunger > 70 ? "bg-emerald-500" : pet.hunger > 30 ? "bg-amber-400" : "bg-red-700"}
                />
                <StatBar 
                  label="Happiness" 
                  value={pet.happiness} 
                  icon={<img src="https://raw.githubusercontent.com/gracejzhu/petwise/refs/heads/main/happiness_icon.png" className="w-5 h-4" />}
                  colorClass={pet.happiness > 70 ? "bg-emerald-500" : pet.happiness > 30 ? "bg-amber-400" : "bg-red-700"}
                />
                <StatBar 
                  label="Energy" 
                  value={pet.energy} 
                  icon={<img src="https://raw.githubusercontent.com/gracejzhu/petwise/refs/heads/main/energy_icon.png" className="w-4 h-5" />}
                  colorClass={pet.energy > 70 ? "bg-emerald-500" : pet.energy > 30 ? "bg-amber-400" : "bg-red-700"}
                />
                <StatBar 
                  label="Health" 
                  value={pet.health} 
                  icon={<img src="https://raw.githubusercontent.com/gracejzhu/petwise/refs/heads/main/health_icon.png" className="w-4 h-4" />}
                  colorClass={pet.health > 70 ? "bg-emerald-500" : pet.health > 30 ? "bg-amber-400" : "bg-red-700"}
                />
              </div>
            </div>
          </section>

          {/* Actions & History */}
          <section className="lg:col-span-7 space-y-8">
            
            {/* Action Grid */}
            <div className={cn("border-4 p-6 theme-border theme-shadow", boxBgClass)}>
              <h3 className="font-display font-bold text-4xl uppercase tracking-tighter mb-4 theme-text">Activities</h3>
              
              {/* Group by category */}
              <div className="space-y-6">
                {Object.entries(categories).map(([catKey, catMeta]) => {
                  const catActivities = activities?.filter(a => a.category === catKey);
                  if (!catActivities?.length) return null;

                  return (
                    <div key={catKey} className="space-y-3">
                      <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2 theme-text opacity-70">
                        {catMeta.icon} {catMeta.label}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {catActivities.map(activity => {
                          const isChore = activity.category === 'work';
                          const onCooldown = isChore && choreCooldown > 0;
                          
                          return (
                            <div key={activity.id} className="relative group h-full">
                              <ActivityCard
                                activity={activity}
                                onClick={() => handleAction(activity.id, activity.name, activity.cost)}
                                disabled={pet.coins < activity.cost || performAction.isPending || onCooldown}
                                isLoading={performAction.isPending && performAction.variables?.activityId === activity.id}
                                className={cn("h-full no-default-hover-elevate", hoverClass)}
                                boxBgClass={boxBgClass}
                                petBackgroundColor={pet.backgroundColor}
                              />
                              {onCooldown && (
                                <div className="absolute inset-0 bg-background/60 flex items-center justify-center pointer-events-none border-4 rounded-none z-20 theme-border">
                                  <div className="flex flex-col items-center gap-1">
                                    <Timer className="w-5 h-5 text-primary animate-pulse" />
                                    <span className="font-display text-s font-bold theme-text">{choreCooldown}s</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Logs */}
            <div className={cn("border-4 p-6 shadow-theme theme-border theme-shadow", boxBgClass)}>
              <h3 className="font-display font-bold text-xl mb-4 flex items-center gap-2 uppercase tracking-tighter theme-text">
                <History className="w-5 h-5 text-primary" /> Recent Care
              </h3>
              <ScrollArea className="h-[200px] w-full pr-4 font-body">
                <div className="space-y-4">
                  {logs?.length === 0 ? (
                    <div className="text-center py-8 font-body text-xl theme-text opacity-60">
                      No activities yet. Go play with {pet.name}!
                    </div>
                  ) : (
                    logs?.map((log) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={log.id} 
                        className="flex items-center justify-between text-xl py-2 border-b-0 last:border-0 lowercase"
                      >
                        <div className="flex flex-col">
                          <span className="font-display font-bold theme-text">{log.activityName}</span>
                          <span className="text-sm theme-text opacity-60">
                            {log.timestamp ? formatDistanceToNow(new Date(log.timestamp)) : "some time"} ago
                          </span>
                        </div>
                        <div className={cn(
                          "font-display font-bold px-2 py-1 border-2 theme-border",
                          log.cost > 0 ? "bg-red-50 text-red-600 border-red-200" : "bg-emerald-50 text-emerald-600 border-emerald-200"
                        )}>
                          {log.cost > 0 ? `-${log.cost}` : `+${Math.abs(log.cost)}`}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
