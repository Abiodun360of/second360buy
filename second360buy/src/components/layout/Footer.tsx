import { Link } from "wouter";
import { Shield, Truck, Clock, HeartHandshake } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-secondary/30">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-2">Verified Sellers</h3>
            <p className="text-sm text-muted-foreground">Every product is vetted to ensure quality and authenticity before listing.</p>
          </div>

          <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-secondary/30">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-2">Fast Responses</h3>
            <p className="text-sm text-muted-foreground">We pride ourselves on responding to all inquiries within 2 hours.</p>
          </div>

          <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-secondary/30">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-2">Secure Shipping</h3>
            <p className="text-sm text-muted-foreground">Safe, tracked packaging ensures your new gear arrives perfectly.</p>
          </div>

          <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-secondary/30">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-2">Sustainable Choice</h3>
            <p className="text-sm text-muted-foreground">Buying second-hand extends product lifecycle and reduces e-waste.</p>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-xl tracking-tight text-foreground">
              Second360<span className="text-primary">Buy</span>
            </span>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} Second360Buy Marketplace. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms</Link>
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy</Link>
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
