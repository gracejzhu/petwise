import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Activity } from "@shared/schema";
import { Loader2 } from "lucide-react";

interface ActivityCardProps {
  activity: Activity;
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  boxBgClass?: string;
  petBackgroundColor?: string;
}

export function ActivityCard({ 
  activity, 
  onClick, 
  disabled, 
  isLoading, 
  className, 
  boxBgClass = "bg-white",
  petBackgroundColor = ""
}: ActivityCardProps) {
  // Map activity names to custom images
  const getIcon = () => {
    return <img src="https://raw.githubusercontent.com/gracejzhu/petwise/refs/heads/main/coin_icon.png" className="w-5 h-5" />;
  };

  return (
    <Button
      variant="outline"
      className={cn(
        "w-full flex flex-col mt-auto items-start p-4 border-t-4 btn-bounce relative overflow-hidden theme-border theme-shadow border-theme",
        boxBgClass,
        disabled && "opacity-100 cursor-not-allowed border-muted-foreground theme-shadow theme-border border-theme", /*NOTE FOR MORE COLORS (instructions): If a border isn't adjusting to the theme put "theme-border border-theme" */
        className
      )}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      <div className="flex w-full items-center justify-between">
        <span className="font-bold text-xl uppercase tracking-tight theme-text" style={{ textShadow: petBackgroundColor.includes('slate-950') ? '1px 1px 0 #000' : 'none' }}>{activity.name}</span>
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
      </div>
      
      <p className="text-base text-left line-clamp-2 leading-relaxed font-body theme-text opacity-90">
        {activity.description}
      </p>

      {activity.cost > 0 && (
          <div className="w-full mt-auto border-t-1 border-dashed"> {/*Disregard this line its buggy when I get rid of it and I'm not risking it but I removed theme-border so this doesnt appear since its ugly*/}
            <div className="flex items-center text-lg font-bold theme-text" style={{ color: petBackgroundColor.includes('slate-950') ? 'white' : 'inherit' }}>
            {getIcon()}
            {activity.cost}
          </div>
        </div>
      )}
    </Button>
  );
}
