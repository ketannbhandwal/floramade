import Link from "next/link";
import { Home, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center space-y-8 max-w-2xl">
        <div className="space-y-4">
          <h1 className="text-8xl md:text-9xl font-display text-accent">404</h1>
          <h2 className="text-2xl md:text-3xl font-light text-foreground">Page Not Found</h2>
          <p className="text-foreground/60 font-light max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
        </div>
        
        <Link 
          href="/"
          className="inline-flex items-center gap-3 h-14 px-8 rounded-full bg-foreground text-background hover:bg-secondary transition-colors duration-300 font-medium uppercase tracking-[0.1em] text-sm"
        >
          <Home size={18} />
          Return Home
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
