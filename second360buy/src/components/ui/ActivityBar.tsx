import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BellRing } from "lucide-react";

const activities = [
  "Sarah from Seattle just viewed an iPad Pro",
  "Michael from Austin purchased a Sony Alpha Camera",
  "Emma from Chicago asked a question about a MacBook",
  "David from Miami just viewed a Vintage Watch",
  "Someone in New York saved an item to favorites"
];

export function ActivityBar() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activities.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-primary text-primary-foreground py-2 px-4 overflow-hidden relative">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
        <BellRing className="w-4 h-4 animate-pulse opacity-70" />
        <div className="h-5 relative w-full max-w-md flex items-center justify-center">
          <AnimatePresence mode="popLayout">
            <motion.p
              key={currentIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="text-sm font-medium absolute w-full text-center truncate"
            >
              {activities[currentIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
