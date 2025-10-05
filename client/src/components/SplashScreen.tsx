import { useEffect, useState } from "react";
import { TAGLINES } from "@/lib/constants";
import { Heart } from "lucide-react";

export default function SplashScreen() {
  const [tagline, setTagline] = useState(TAGLINES[0]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const randomTagline = TAGLINES[Math.floor(Math.random() * TAGLINES.length)];
    setTagline(randomTagline);

    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-primary to-primary/90 animate-in fade-in duration-300">
      <div className="flex flex-col items-center gap-6 px-6 max-w-md mx-auto text-center">
        <div className="relative">
          <Heart className="w-20 h-20 text-white animate-pulse" fill="white" />
          <div className="absolute inset-0 bg-white/20 rounded-full blur-xl"></div>
        </div>
        
        <h1 className="text-4xl font-bold text-white tracking-tight">
          CKalingaLink
        </h1>
        
        <p className="text-lg text-white/90 font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          {tagline}
        </p>
      </div>
    </div>
  );
}
