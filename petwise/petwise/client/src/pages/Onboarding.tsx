import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useCreatePet } from "@/hooks/use-game";
import { insertPetSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dog, Cat, Rabbit, Sparkles, Volume2, VolumeX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Extend the schema for the form
const formSchema = insertPetSchema.extend({
  type: z.enum(["dog", "cat", "rabbit"], {
    required_error: "Please select a pet type.",
  }),
});

export default function Onboarding() {
  const { toast } = useToast();
  const createPet = useCreatePet();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const MUSIC_URL = "https://raw.githubusercontent.com/gracejzhu/petwise/main/intro_music.mp3";
    const audio = new Audio(MUSIC_URL);
    audio.loop = true;
    audio.muted = isMuted;
    const playAudio = async () => {
      try {
        await audio.play();
      } catch (err) {
        console.log("Audio play failed:", err);
      }
    };
    playAudio();
    return () => audio.pause();
  }, [isMuted]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "dog",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createPet.mutate(values, {
      onSuccess: (data) => {
        toast({
          title: "Welcome!",
          description: `Say hello to ${data.name}!`,
        });
      },
      onError: (err) => {
        toast({
          variant: "destructive",
          title: "Uh oh!",
          description: err.message,
        });
      },
    });
  }

  const petTypes = [
    { id: "dog", icon: <img src="https://raw.githubusercontent.com/gracejzhu/petwise/refs/heads/main/dog_idle.png" className="w-10 h-12" />, label: "Dog" },

    { id: "cat", icon: <img src="https://raw.githubusercontent.com/gracejzhu/petwise/refs/heads/main/cat_idle.png" className="w-11 h-12" />, label: "Cat" },
    { id: "rabbit", icon: <img src="https://raw.githubusercontent.com/gracejzhu/petwise/refs/heads/main/rabbit_idle.png" className="w-9 h-12" />, label: "Rabbit" }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Image yayay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ 
          backgroundImage: `url(https://raw.githubusercontent.com/gracejzhu/petwise/main/petwise_onboardingbg.png)`,
          backgroundColor: '#bfdbfe' // fallback light blue if it dont work somehow lmao
        }}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-none shadow-2xl overflow-hidden relative">
          <div className="absolute top-5 right-1 z-10">
            <Button
              variant="ghost"
              onClick={() => setIsMuted(!isMuted)}
              className="w-18 h-18 rounded-full hover:bg-primary/10"
            >
              {isMuted ? <img src="https://raw.githubusercontent.com/gracejzhu/petwise/refs/heads/main/muted_icon.png" className="w-5 h-5" /> : <img src="https://raw.githubusercontent.com/gracejzhu/petwise/refs/heads/main/unmuted_icon.png" className="w-5 h-5" />}
            </Button>
          </div>
          <div className="h-2 w-full" />
          <CardHeader className="text-center pb-2">
            <div className="mx-auto bg-primary/1 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <img src="https://raw.githubusercontent.com/gracejzhu/petwise/refs/heads/main/happiness_icon.png" className="w-10 h-9" />
            </div>
            <CardTitle className="text-3xl font-display font-bold text-primary">Adopt a Pet</CardTitle>
            <CardDescription className="text-lg">Start your journey of friendship!</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-base font-semibold text-center block text-muted-foreground">Choose your companion</FormLabel>
                      <div className="grid grid-cols-3 gap-4">
                        {petTypes.map((type) => (
                          <div
                            key={type.id}
                            className={`
                              cursor-pointer rounded-2xl p-4 border-2 transition-all duration-200 flex flex-col items-center gap-2 hover:shadow-lg
                              ${field.value === type.id 
                                ? "border-primary bg-primary/5 shadow-md scale-105" 
                                : "border-border bg-white hover:border-primary/50"}
                            `}
                            onClick={() => {
                              field.onChange(type.id);
                              setSelectedType(type.id);
                            }}
                          >
                            <div className={field.value === type.id ? "text-primary" : "text-muted-foreground"}>
                              {type.icon}
                            </div>
                            <span className="font-bold text-sm">{type.label}</span>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold text-muted-foreground">Give them a name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. Fido, Luna, Bert..." 
                          className="h-12 text-lg rounded-xl border-2 focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-primary/20" 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full h-14 text-xl border-teal-300 font-bold rounded-xl text-teal-700 bg-gradient-to-r from-teal-200 to-teal-200 hover:shadow-xs hover:-translate-y-0.5 transition-all" // keeping gradient code here because we can change it if necessary but i like teal-200 rn
                  disabled={createPet.isPending}
                >
                  {createPet.isPending ? (
                    <span className="flex items-center gap-2">
                      <img src="https://raw.githubusercontent.com/gracejzhu/petwise/refs/heads/main/restart_icon.png" className="w-10 h-9 animate-spin" /> Preparing home...
                    </span>
                  ) : "Adopt Now!"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
