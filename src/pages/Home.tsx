import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen, Plus, ChefHat } from "lucide-react";
import Navigation from "@/components/Navigation";
import RecipeCard from "@/components/RecipeCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const { data: recentRecipes, isLoading } = useQuery({
    queryKey: ["recent-recipes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recipes")
        .select(`
          id,
          title,
          description,
          image_url,
          cook_time,
          servings,
          difficulty,
          recipe_tags (tag)
        `)
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) throw error;
      return data.map(recipe => ({
        ...recipe,
        tags: recipe.recipe_tags?.map((t: any) => t.tag) || []
      }));
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">AI-Powered Recipe Generation</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
              Turn Your Ingredients Into Delicious Meals
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Smart RecipeVault uses AI to generate personalized recipes based on what you have. 
              Save favorites, manage ingredients, and discover endless culinary possibilities.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate("/generate")}
                className="bg-gradient-hero hover:opacity-90 text-lg px-8 shadow-medium"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Generate Recipe
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate("/browse")}
                className="text-lg px-8"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Browse Recipes
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6">
              <div className="bg-gradient-hero p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-2">AI-Powered</h3>
              <p className="text-muted-foreground">
                Enter your ingredients and let AI create perfect recipes tailored to what you have
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-gradient-hero p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-2">Recipe Library</h3>
              <p className="text-muted-foreground">
                Browse and save recipes from our growing community of food lovers
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-gradient-hero p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Plus className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-2">Your Recipes</h3>
              <p className="text-muted-foreground">
                Add and manage your own recipes with photos, ingredients, and instructions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Recipes Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-serif font-bold">Recently Added</h2>
            <Button variant="outline" onClick={() => navigate("/browse")}>
              View All
            </Button>
          </div>
          
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card rounded-lg h-80 animate-pulse" />
              ))}
            </div>
          ) : recentRecipes && recentRecipes.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentRecipes.map((recipe: any) => (
                <RecipeCard
                  key={recipe.id}
                  id={recipe.id}
                  title={recipe.title}
                  description={recipe.description}
                  imageUrl={recipe.image_url}
                  cookTime={recipe.cook_time}
                  servings={recipe.servings}
                  difficulty={recipe.difficulty}
                  tags={recipe.tags}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ChefHat className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-30" />
              <p className="text-muted-foreground mb-4">No recipes yet. Be the first to add one!</p>
              {user && (
                <Button onClick={() => navigate("/add-recipe")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Recipe
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-16 bg-gradient-hero">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
              Ready to Start Cooking?
            </h2>
            <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
              Join RecipeVault today and unlock AI-powered recipe generation, 
              save your favorites, and discover new culinary adventures.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate("/auth")}
              className="text-lg px-8"
            >
              Get Started Free
            </Button>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
