import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Share2, Camera, X } from "lucide-react";
import { PetDisplay } from "./PetDisplay";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";

interface PhotoBoothProps {
  pet: any;
  onCancel: () => void;
  themeColors?: { border: string; text: string; bg: string };
}

export function PhotoBooth({ pet, onCancel, themeColors }: PhotoBoothProps) {
  const { toast } = useToast();
  const photoRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const takePhoto = async () => {
    if (!photoRef.current) return;
    setIsCapturing(true);
    
    try {
      // Small delay for animations to settle
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(photoRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: themeColors?.bg || "#ffffff",
      });
      
      const dataUrl = canvas.toDataURL("image/png");
      setCapturedImage(dataUrl);
      
      toast({
        title: "Cheese!",
        description: "Your photo has been captured.",
      });
    } catch (err) {
      console.error("Photo capture failed:", err);
      toast({
        variant: "destructive",
        title: "Oh no!",
        description: "Failed to take the photo.",
      });
    } finally {
      setIsCapturing(false);
    }
  };

  const downloadPhoto = () => {
    if (!capturedImage) return;
    const link = document.createElement("a");
    link.download = `${pet.name}-photo.png`;
    link.href = capturedImage;
    link.click();
  };

  const sharePhoto = async () => {
    if (!capturedImage) return;
    
    try {
      if (navigator.share) {
        const response = await fetch(capturedImage);
        const blob = await response.blob();
        const file = new File([blob], "pet-photo.png", { type: "image/png" });
        
        await navigator.share({
          title: `My Pet ${pet.name}`,
          text: `Check out my cute pet ${pet.name}!`,
          files: [file],
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "Sharing directly is not supported on this browser, so we copied the game link for you.",
        });
      }
    } catch (err) {
      console.error("Sharing failed:", err);
    }
  };

  return (
    <Card 
      className="p-6 border-8 border-black rounded-none shadow-[8px_8px_0_0_rgba(0,0,0,1)] max-w-lg w-full"
      style={{ backgroundColor: themeColors?.bg || 'white', borderColor: themeColors?.border || 'black' }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-display font-bold uppercase tracking-tighter" style={{ color: themeColors?.text }}>
          Photo Booth
        </h2>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="w-8 h-8" />
        </Button>
      </div>

      {!capturedImage ? (
        <div className="space-y-6">
          <div 
            ref={photoRef}
            className="relative border-4 border-black p-4 aspect-square overflow-hidden bg-cover bg-center"
            style={{ 
              backgroundImage: 'url(https://raw.githubusercontent.com/gracejzhu/petwise/main/grassy_meadow.png)',
              borderColor: themeColors?.border 
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <PetDisplay pet={pet} isEating={false} isPlaying={false} />
            </div>
            <div className="absolute bottom-2 right-2 opacity-50 text-[10px] font-display uppercase tracking-widest text-white drop-shadow-md">
              PETWISE PHOTO
            </div>
          </div>

          <Button 
            className="w-full h-16 text-xl font-display font-bold rounded-none border-4 theme-border theme-shadow uppercase bg-white-900 theme-text"
            onClick={takePhoto}
            disabled={isCapturing}
          >
            {isCapturing ? "Capturing..." : <span className="flex items-center gap-2"><Camera className="w-6 h-6" /> Take Photo</span>}
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
            <img src={capturedImage} alt="Captured Pet" className="w-full h-auto pixelated bg-white-900" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline"
              className="h-14 font-display font-bold rounded-none border-4 theme-border theme-shadow uppercase bg-white-900"
              onClick={downloadPhoto}
            >
              <Download className="w-5 h-5 mr-2" /> Save
            </Button>
            <Button 
              variant="outline"
              className="h-14 font-display font-bold rounded-none border-4 theme-border theme-shadow uppercase bg-white-900"
              onClick={sharePhoto}
            >
              <Share2 className="w-5 h-5 mr-2" /> Share
            </Button>
          </div>

          <Button 
            className="w-full h-12 font-display font-bold rounded-none border-4 theme-border uppercase bg-white-900 theme-text"
            onClick={() => setCapturedImage(null)}
          >
            Retake
          </Button>
        </div>
      )}
    </Card>
  );
}
