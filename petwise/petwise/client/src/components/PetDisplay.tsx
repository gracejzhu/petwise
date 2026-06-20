import { motion } from "framer-motion";
import { Pet } from "@shared/schema";

interface PetDisplayProps {
  pet: Pet;
  isEating?: boolean;
  isPlaying?: boolean;
}

export function PetDisplay({ pet, isEating, isPlaying }: PetDisplayProps) {
  // Image/display logic -gz all github content leads to petwise repo
  const getPetImage = () => {
    
    const props = { 
      className: "w-30 h-30 md:w-48 md:h-48 object-contain pixelated drop-shadow-xl",
      style: { imageRendering: 'pixelated' } as React.CSSProperties
    };

    const getImageUrl = () => {
      // Logic for different states (sleeping, sad, eating, playing, happy/idle)
      if (isSleeping) {
        switch (pet.type) {
          case "cat": return "https://raw.githubusercontent.com/gracejzhu/petwise/refs/heads/main/cat_sleeping.png";
          case "rabbit": return "https://raw.githubusercontent.com/gracejzhu/petwise/refs/heads/main/rabbit_sleeping.png";
          default: return "https://raw.githubusercontent.com/gracejzhu/petwise/refs/heads/main/dog_sleeping.png";
        }
        
      }

      if (isEating) {
        switch (pet.type) {
          case "cat": return "https://raw.githubusercontent.com/gracejzhu/petwise/refs/heads/main/cat_eating.png";
          case "rabbit": return "https://raw.githubusercontent.com/gracejzhu/petwise/refs/heads/main/rabbit_eating.png";
          default: return "https://raw.githubusercontent.com/gracejzhu/petwise/refs/heads/main/dog_eating.png";
        }
      }

      if (isPlaying) {
        switch (pet.type) {
          case "cat": return "https://raw.githubusercontent.com/gracejzhu/petwise/refs/heads/main/cat_playing.png";
          case "rabbit": return "https://raw.githubusercontent.com/gracejzhu/petwise/refs/heads/main/rabbit_playing.png";
          default: return "https://raw.githubusercontent.com/gracejzhu/petwise/refs/heads/main/dog_playing.png";
        }
      }

      if (isSad) {
        switch (pet.type) {
          case "cat": return "https://raw.githubusercontent.com/gracejzhu/petwise/refs/heads/main/cat_sick.png"; /*TO BE EDITED!!!! -gz*/
          case "rabbit": return "https://raw.githubusercontent.com/gracejzhu/petwise/refs/heads/main/rabbit_sick.png";
          default: return "https://raw.githubusercontent.com/gracejzhu/petwise/refs/heads/main/dog_sick.png";
        }
      }

      // Default/Happy/Idle state
      switch (pet.type) {
        case "cat": return "https://raw.githubusercontent.com/gracejzhu/petwise/refs/heads/main/cat_idle.png";
        case "rabbit": return "https://raw.githubusercontent.com/gracejzhu/petwise/refs/heads/main/rabbit_idle.png";
        default: return "https://raw.githubusercontent.com/gracejzhu/petwise/refs/heads/main/dog_idle.png";
      }
    };

    return <img src={getImageUrl()} alt={`${pet.type} pet`} {...props} />;
  };

  // Determine emotion/state
  const isSad = pet.happiness < 30 || pet.health < 30 || pet.hunger < 30;
  const isSleeping = pet.isSleeping;

  // Animation variants (may switch later)
  const bounceTransition = {
    y: {
      duration: 0.8,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  };

  const sleepTransition = {
    scale: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  };

  return (
    <div 
      className="relative flex flex-col items-center justify-center p-12 border-8 theme-border theme-shadow overflow-hidden rounded-none bg-cover bg-center"
      style={{ 
        backgroundImage: `url('https://raw.githubusercontent.com/gracejzhu/petwise/main/grassy_meadow.png')`
        
      }}
    >
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(hsl(var(--primary))_1px,transparent_1px)] bg-[length:24px_24px] z-0"> </div>
      
      <motion.div
        animate={isSleeping ? { scale: [1, 1.05, 1] } : { y: ["0%", "-5%", "0%"] }}
        transition={isSleeping ? sleepTransition : bounceTransition}
        className="relative z-10"
      >
        <div className="relative p-6">
          {getPetImage()}
        </div>
        {/* Sleeping Zzz... emote */}
        {isSleeping && (
          <motion.div 
            className="absolute -top-2 -right-4 font-display text-primary text-2xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: [0, 1, 0], y: 0, x: 20 }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            zzz...
          </motion.div>
        )}

        {/* Sad Tear/Sick/Sweat */}
        {!isSleeping && isSad && (
          <motion.div
            className="absolute top-10 right-4 bg-blue-300 w-4 h-4 border-2 theme-border"
            animate={{ y: [0, 15], opacity: [1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </motion.div>

      <div className="mt-8 text-center relative z-10">
        <h2 className="text-2xl font-display uppercase tracking-tighter" style={{ 
          textShadow: '3px 3px 0 #000, -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 0 3px 0 #000, 0 -3px 0 #000, 3px 0 0 #000, -3px 0 0 #000', 
          color: 'white',
          WebkitTextStroke: '1px black'
        }}>
          {pet.name}
        </h2>
        <p className="font-body text-xl mt-2 lowercase flex items-center justify-center gap-2" style={{ 
          textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 0 2px 0 #000, 0 -2px 0 #000, 2px 0 0 #000, -2px 0 0 #000', 
          color: 'white',
          WebkitTextStroke: '0.5px black'
        }}>
          {pet.type}
          {isSleeping && <span className="border-2 theme-border px-2 py-0.5 text-sm bg-primary" style={{ textShadow: 'none', WebkitTextStroke: '0' }}>sleeping</span>}
        </p>
      </div>
    </div>
  );
  
}
