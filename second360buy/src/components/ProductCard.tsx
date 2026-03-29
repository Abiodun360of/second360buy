import { Link } from "wouter";
import { motion } from "framer-motion";
import { Product } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Image as ImageIcon, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const isAvailable = product.status === "Available";
  
  const conditionColor = {
    "Like New": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "Good": "bg-blue-100 text-blue-800 border-blue-200",
    "Used": "bg-orange-100 text-orange-800 border-orange-200",
    "Fair": "bg-stone-100 text-stone-800 border-stone-200"
  }[product.condition] || "bg-gray-100 text-gray-800";

  const mainImage = product.images?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group flex flex-col bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300"
    >
      <Link href={`/products/${product.id}`} className="relative aspect-square overflow-hidden bg-secondary/50 block">
        {mainImage ? (
          <img 
            src={mainImage} 
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <ImageIcon className="w-12 h-12 opacity-20" />
          </div>
        )}
        
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge className={`rounded-full shadow-sm font-medium ${conditionColor}`} variant="outline">
            {product.condition}
          </Badge>
        </div>
        
        <div className="absolute top-3 right-3">
          <Badge 
            variant={isAvailable ? "default" : "destructive"}
            className="rounded-full shadow-sm font-medium"
          >
            {product.status}
          </Badge>
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {product.category}
          </span>
        </div>
        
        <Link href={`/products/${product.id}`} className="block mb-1">
          <h3 className="font-display font-semibold text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
        </Link>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mt-2 mb-4 flex-grow">
          {product.keyFeatures || "Quality second-hand item available now."}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto">
          <span className="text-2xl font-bold text-foreground">
            ${product.price.toLocaleString()}
          </span>
          <div className="flex items-center gap-2">
            {isAvailable && (
              <a
                href={`mailto:second360buy@gmail.com?subject=Purchase Inquiry – ${encodeURIComponent(product.title)}&body=${encodeURIComponent(`Hi,\n\nI'm interested in purchasing the "${product.title}" listed on Second360Buy.\n\nItem Details:\n- Condition: ${product.condition}\n- Price: $${product.price}\n- Category: ${product.category}\n\nMy message:\n[Write your message here — ask questions, suggest a price, or confirm your interest]\n\nThank you!`)}`}
                onClick={(e) => e.stopPropagation()}
              >
                <Button size="sm" variant="outline" className="rounded-full h-9 px-3 gap-1.5 text-xs font-semibold hover:bg-primary hover:text-white hover:border-primary transition-all">
                  <Mail className="w-3.5 h-3.5" />
                  Buy
                </Button>
              </a>
            )}
            <Link href={`/products/${product.id}`} tabIndex={-1}>
              <Button size="icon" className="rounded-full w-10 h-10 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
