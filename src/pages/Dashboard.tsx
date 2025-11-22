import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import RecipeCard from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });
  }, [navigate]);

  const { data: myRecipes } = useQuery({
    queryKey: ["my-recipes", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("recipes")
        .select("*, recipe_tags (tag)")
        .eq("user_id", user.id);
      return data?.map(r => ({ ...r, tags: r.recipe_tags?.map((t: any) => t.tag) })) || [];
    },
    enabled: !!user,
  });

  const { data: savedRecipes } = useQuery({
    queryKey: ["saved-recipes", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("saved_recipes")
        .select("recipes (*, recipe_tags (tag))")
        .eq("user_id", user.id);
      return data?.map((s: any) => ({ ...s.recipes, tags: s.recipes.recipe_tags?.map((t: any) => t.tag) })) || [];
    },
    enabled: !!user,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-serif font-bold mb-8">My Dashboard</h1>
        
        <Card className="mb-8 shadow-soft">
          <CardHeader>
            <CardTitle>My Recipes</CardTitle>
          </CardHeader>
          <CardContent>
            {myRecipes && myRecipes.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myRecipes.map((recipe: any) => (
                  <RecipeCard key={recipe.id} {...recipe} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No recipes yet</p>
                <Button onClick={() => navigate("/add-recipe")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Recipe
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Saved Recipes</CardTitle>
          </CardHeader>
          <CardContent>
            {savedRecipes && savedRecipes.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedRecipes.map((recipe: any) => (
                  <RecipeCard key={recipe.id} {...recipe} />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No saved recipes</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
