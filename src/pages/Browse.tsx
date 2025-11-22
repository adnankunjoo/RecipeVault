import { useState } from "react";
import Navigation from "@/components/Navigation";
import RecipeCard from "@/components/RecipeCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Browse = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: recipes, isLoading } = useQuery({
    queryKey: ["browse-recipes", searchQuery],
    queryFn: async () => {
      let query = supabase
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
        .order("created_at", { ascending: false });

      if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`);
      }

      const { data, error } = await query;

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
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Browse Recipes
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Discover delicious recipes from our community
            </p>
            
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search recipes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                Filters
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="bg-card rounded-lg h-80 animate-pulse" />
              ))}
            </div>
          ) : recipes && recipes.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe: any) => (
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
              <p className="text-muted-foreground">
                {searchQuery
                  ? "No recipes found matching your search"
                  : "No recipes available yet"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Browse;
