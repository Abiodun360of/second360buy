import { useRoute } from "wouter";
import { useGetProduct, useGetProducts } from "@workspace/api-client-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck, Mail, Zap, Clock, Info, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/ProductCard";

export default function ProductDetailPage() {
  const [, params] = useRoute("/products/:id");
  const id = params?.id ? parseInt(params.id, 10) : 0;
  
  const { data: product, isLoading, isError } = useGetProduct(id, {
    query: { enabled: !!id }
  });

  const { data: allProducts } = useGetProducts({ status: 'Available' });
  const related = allProducts?.filter(p => p.id !== id).slice(0, 3) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="text-muted-foreground mb-8">This item might have been removed or the URL is incorrect.</p>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isAvailable = product.status === "Available";
  
  const conditionColor = {
    "Like New": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "Good": "bg-blue-100 text-blue-800 border-blue-200",
    "Used": "bg-orange-100 text-orange-800 border-orange-200",
    "Fair": "bg-stone-100 text-stone-800 border-stone-200"
  }[product.condition] || "bg-gray-100 text-gray-800";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to listings
          </Link>

          <div className="bg-card rounded-3xl p-6 lg:p-10 border border-border/60 shadow-sm mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Image Gallery */}
              <div className="space-y-4">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-secondary/50 border border-border/50">
                  {product.images && product.images.length > 0 ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No Image Available
                    </div>
                  )}
                </div>
                
                {product.images && product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {product.images.slice(1).map((img, i) => (
                      <div key={i} className="aspect-square rounded-xl overflow-hidden bg-secondary/50 border border-border/50 cursor-pointer hover:border-primary transition-colors">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="outline" className={`font-medium ${conditionColor}`}>
                    {product.condition}
                  </Badge>
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    {product.category}
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6 leading-tight">
                  {product.title}
                </h1>
                
                <div className="text-4xl font-bold text-primary mb-8">
                  ${product.price.toLocaleString()}
                </div>

                <div className="p-4 rounded-2xl bg-secondary/40 border border-border mb-8 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    <span className="font-medium">Verified Seller</span>
                    <span className="text-muted-foreground">— 100% authentic item</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <span className="font-medium">Fast Response</span>
                    <span className="text-muted-foreground">— Usually replies within 2 hours</span>
                  </div>
                </div>

                <div className="mb-10 flex-grow">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    AI Generated Description
                  </h3>
                  <div className="prose prose-sm md:prose-base text-muted-foreground">
                    <p className="leading-relaxed whitespace-pre-wrap">{product.description}</p>
                  </div>
                  
                  {product.keyFeatures && (
                    <div className="mt-6">
                      <h4 className="font-semibold text-foreground mb-2">Key Features:</h4>
                      <p className="text-muted-foreground">{product.keyFeatures}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-4 mt-auto">
                  {!isAvailable && (
                    <div className="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl flex items-center justify-center gap-2 font-medium">
                      <Info className="w-5 h-5" />
                      This item has been sold and is no longer available.
                    </div>
                  )}
                  
                  <a 
                    href={isAvailable ? `mailto:second360buy@gmail.com?subject=Purchase Inquiry – ${encodeURIComponent(product.title)}&body=${encodeURIComponent(`Hi,\n\nI'm interested in purchasing the "${product.title}" listed on Second360Buy.\n\nItem Details:\n- Condition: ${product.condition}\n- Price: $${product.price}\n- Category: ${product.category}\n\nMy message:\n[Write your message here — ask questions, suggest a price, or confirm your interest]\n\nThank you!`)}` : "#"}
                    className={isAvailable ? "" : "pointer-events-none opacity-50"}
                  >
                    <Button 
                      size="lg" 
                      className="w-full h-14 text-lg rounded-xl shadow-xl shadow-primary/20 hover:shadow-2xl hover:-translate-y-1 transition-all"
                      disabled={!isAvailable}
                    >
                      <Mail className="w-5 h-5 mr-2" />
                      Contact to Buy Now
                    </Button>
                  </a>
                  <p className="text-center text-xs text-muted-foreground mt-2">
                    Clicking will open your email app — add your message and send!
                  </p>
                </div>

              </div>
            </div>
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <div className="mt-20">
              <h2 className="text-2xl font-display font-bold text-foreground mb-8">People Also Viewed</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {related.map((prod, idx) => (
                  <ProductCard key={prod.id} product={prod} index={idx} />
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
