import { motion } from "framer-motion";
import { 
  Cpu, 
  Smartphone, 
  Sofa, 
  Monitor, 
  Car, 
  Gamepad2, 
  Shirt, 
  Tv2,
  LayoutGrid
} from "lucide-react";

const CATEGORIES = [
  { label: "All", icon: LayoutGrid, value: null },
  { label: "Electronics", icon: Cpu, value: "Electronics" },
  { label: "Phones", icon: Smartphone, value: "Phones" },
  { label: "Furniture", icon: Sofa, value: "Furniture" },
  { label: "Computers", icon: Monitor, value: "Computers" },
  { label: "Cars", icon: Car, value: "Cars" },
  { label: "Gaming", icon: Gamepad2, value: "Gaming" },
  { label: "Clothing", icon: Shirt, value: "Clothing" },
  { label: "Home Appliances", icon: Tv2, value: "Home Appliances" },
];

interface CategoryNavProps {
  selected: string | null;
  onSelect: (category: string | null) => void;
}

export function CategoryNav({ selected, onSelect }: CategoryNavProps) {
  return (
    <div className="w-full border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-20 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-2 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = selected === cat.value;
            return (
              <motion.button
                key={cat.label}
                onClick={() => onSelect(cat.value)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className={`
                  relative flex flex-col items-center gap-1 px-4 py-2.5 rounded-xl transition-all duration-200 whitespace-nowrap min-w-fit group cursor-pointer
                  ${isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-primary-foreground" : "group-hover:text-primary transition-colors"}`} />
                <span className="text-xs font-semibold tracking-wide">{cat.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export { CATEGORIES };
