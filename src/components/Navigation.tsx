import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChefHat, Home, Sparkles, BookOpen, User, LogOut, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";

const Navigation = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  return (
    <nav className="border-b border-border bg-card shadow-soft sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-hero p-2 rounded-lg group-hover:scale-105 transition-transform">
              <ChefHat className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-serif font-bold">RecipeVault</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link to="/generate" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <Sparkles className="h-4 w-4" />
              <span>AI Generator</span>
            </Link>
            <Link to="/browse" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <BookOpen className="h-4 w-4" />
              <span>Browse</span>
            </Link>
            {user && (
              <Link to="/add-recipe" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                <Plus className="h-4 w-4" />
                <span>Add Recipe</span>
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate("/dashboard")}
                  className="hidden md:flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Dashboard
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleLogout}
                  className="hidden md:flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => navigate("/auth")}
                className="bg-gradient-hero hover:opacity-90"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
