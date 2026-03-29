import { useState } from "react";
import { useGetProducts } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ActivityBar } from "@/components/ui/ActivityBar";
import { CategoryNav } from "@/components/ui/CategoryNav";
import { ProductCard } from "@/components/ProductCard";
import { ArrowRight, Star, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: availableProducts, isLoading: loadingAvailable } = useGetProducts(
    selectedCategory ? { status: 'Available', category: selectedCategory } : { status: 'Available' }
  );
  const { data: soldProducts, isLoading: loadingSold } = useGetProducts({ status: 'Sold' });

  const featured = availableProducts?.slice(0, 6) || [];
  const recentSold = soldProducts?.slice(0, 3) || [];

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    setTimeout(() => document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ActivityBar />
      <Navbar />
      <CategoryNav selected={selectedCategory} onSelect={handleCategorySelect} />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
              alt="Background pattern"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold tracking-wide">Premium Second-Hand Gear</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold text-foreground tracking-tight mb-6 max-w-4xl mx-auto leading-tight"
            >
              Quality gear you trust, <br className="hidden md:block" />
              at prices you'll <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">love.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            >
              Every item is thoroughly inspected and verified. Discover amazing deals on electronics, cameras, and more with our buyer protection guarantee.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button
                size="lg"
                className="rounded-full px-8 text-lg h-14 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                onClick={() => document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Shop Available Items
              </Button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span>Verified Sellers Only</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Products */}
        <section id="featured" className="py-20 bg-background relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl font-display font-bold text-foreground">
                  {selectedCategory ? `${selectedCategory}` : "Featured Arrivals"}
                </h2>
                <p className="text-muted-foreground mt-2">
                  {selectedCategory
                    ? `Browsing available ${selectedCategory} items.`
                    : "The latest hand-picked items ready for a new home."}
                </p>
              </div>
              {selectedCategory && (
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => setSelectedCategory(null)}
                >
                  Clear filter
                </Button>
              )}
            </div>

            {loadingAvailable ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="animate-pulse bg-secondary/50 rounded-2xl h-96 w-full" />
                ))}
              </div>
            ) : featured.length > 0 ? (
              <motion.div
                key={selectedCategory ?? "all"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {featured.map((product, idx) => (
                  <ProductCard key={product.id} product={product} index={idx} />
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-20 bg-secondary/20 rounded-3xl border border-border border-dashed">
                <p className="text-muted-foreground text-lg">
                  No {selectedCategory ? `"${selectedCategory}" items` : "available items"} at the moment.
                </p>
                {selectedCategory && (
                  <Button variant="link" className="mt-2" onClick={() => setSelectedCategory(null)}>
                    Browse all categories
                  </Button>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Trust Indicators / Reviews */}
        <section className="py-20 bg-secondary/30 border-y border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-display font-bold text-foreground">Trusted by thousands</h2>
              <p className="text-muted-foreground mt-2">See what our community has to say about their purchases.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Alex R.", item: "MacBook Pro 2021", text: "Condition was exactly as described ('Like New'). Shipped securely and seller responded within minutes." },
                { name: "Jamie L.", item: "Sony A7III", text: "Saved over $400 buying here instead of retail. The camera works flawlessly. Highly recommend!" },
                { name: "Morgan T.", item: "iPad Air", text: "The verified badge gave me confidence, and the product delivered. Great communication throughout." }
              ].map((review, i) => (
                <div key={i} className="bg-card p-8 rounded-2xl shadow-sm border border-border/60 hover:shadow-md transition-shadow">
                  <div className="flex gap-1 mb-4 text-amber-400">
                    {[1, 2, 3, 4, 5].map(star => <Star key={star} fill="currentColor" className="w-5 h-5" />)}
                  </div>
                  <p className="text-foreground font-medium mb-6 italic">"{review.text}"</p>
                  <div className="flex items-center justify-between border-t border-border pt-4 mt-auto">
                    <span className="font-semibold text-sm">{review.name}</span>
                    <span className="text-xs text-muted-foreground">Bought: {review.item}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recently Sold */}
        {!selectedCategory && recentSold.length > 0 && (
          <section className="py-20 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-10">
                <h2 className="text-3xl font-display font-bold text-foreground">Recently Sold</h2>
                <p className="text-muted-foreground mt-2">Missed out? See the great deals others have grabbed.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 opacity-70 grayscale-[20%] hover:grayscale-0 transition-all duration-500">
                {recentSold.map((product, idx) => (
                  <ProductCard key={product.id} product={product} index={idx} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
