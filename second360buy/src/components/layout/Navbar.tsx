import { Link, useLocation } from "wouter";
import { Search, ShoppingBag, ShieldCheck, LogIn, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetAdminMe } from "@workspace/api-client-react";

export function Navbar() {
  const [location] = useLocation();
  const { data: adminData } = useGetAdminMe({
    query: { retry: false, refetchOnWindowFocus: false }
  });

  const isAdmin = adminData?.authenticated;

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-blue-400 p-2 shadow-inner group-hover:scale-105 transition-transform duration-300">
              <ShoppingBag className="w-full h-full text-white" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-foreground group-hover:text-primary transition-colors">
              Second360<span className="text-primary">Buy</span>
            </span>
          </Link>

          {/* Search Bar - Visual Only */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 border border-border/60 rounded-full leading-5 bg-background/50 placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-background transition-all sm:text-sm shadow-inner"
              placeholder="Search for laptops, cameras, watches..."
            />
          </div>

          {/* Right Nav */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-medium tracking-wide uppercase">Verified Platform</span>
            </div>

            {isAdmin ? (
              <Link href="/admin">
                <Button variant={location === '/admin' ? "default" : "outline"} className="rounded-full gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Button>
              </Link>
            ) : (
              <Link href="/admin/login">
                <Button variant="ghost" size="sm" className="rounded-full gap-2 text-muted-foreground hover:text-foreground">
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Admin</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
