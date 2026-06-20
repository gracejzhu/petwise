import { usePet } from "@/hooks/use-game";
import { Loader2 } from "lucide-react";
import Onboarding from "./Onboarding";
import Dashboard from "./Dashboard";

export default function Home() {
  const { data: pet, isLoading, error } = usePet();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium animate-pulse">Waking up pet...</p>
        </div>
      </div>
    );
  }

  // Error fetching means maybe network issue, but usually 404 is handled in hook to return null
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-destructive/10">
        <div className="text-center space-y-4 max-w-md p-6 bg-white rounded-xl shadow-xl">
          <h2 className="text-2xl font-bold text-destructive">Connection Error</h2>
          <p className="text-muted-foreground">We couldn't reach the pet server. Is the backend running?</p>
        </div>
      </div>
    );
  }

  // If no pet exists (API returned null/404), show onboarding
  if (!pet) {
    return <Onboarding />;
  }

  // Otherwise, show the dashboard
  return <Dashboard />;
}
