import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatBarProps {
  label: string;
  value: number; // 0-100
  icon: React.ReactNode;
  colorClass?: string;
}

export function StatBar({ label, value, icon, colorClass = "bg-primary" }: StatBarProps) {
  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between text-lg font-display lowercase theme-text font-bold">
        <span className="flex items-center gap-3">
          {icon && <span className="w-6 h-6 flex items-center justify-center">{icon}</span>}
          {label}
        </span>
        <span className="text-xl">{value}%</span>
      </div>
      <div className="h-8 w-full bg-white border-4 theme-border p-1">
        <motion.div
          className={cn("h-full", colorClass)}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
          style={{ boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.4)' }}
        />
      </div>
    </div>
  );
}
