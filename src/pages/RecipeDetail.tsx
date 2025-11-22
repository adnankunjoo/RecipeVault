import { useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, ChefHat, Heart, ArrowLeft } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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

  const { data: recipe, isLoading } = useQuery({
    queryKey: ["recipe", id],
    queryFn: async () => {
      const { data: recipeData, error: recipeError } = await supabase
        .from("recipes")
        .select(`
          *,
          ingredients (*),
          recipe_steps (*),
          recipe_tags (tag)
        `)
        .eq("id", id)
        .single();

      if (recipeError) throw recipeError;

      // Get profile data
      const { data: profileData } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", recipeData.user_id)
        .maybeSingle();

      // Check if saved
      let isSaved = false;
      if (user) {
        const { data: savedData } = await supabase
          .from("saved_recipes")
          .select("id")
          .eq("recipe_id", id)
          .eq("user_id", user.id)
          .maybeSingle();

        isSaved = !!savedData;
      }

      return {
        ...recipeData,
        profile: profileData,
        isSaved,
      };
    },
    enabled: !!id,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        toast.error("Please sign in to save recipes");
        return;
      }

      if (recipe?.isSaved) {
        const { error } = await supabase
          .from("saved_recipes")
          .delete()
          .eq("recipe_id", id)
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("saved_recipes")
          .insert({
            recipe_id: id,
            user_id: user.id,
          });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipe", id] });
      toast.success(recipe?.isSaved ? "Recipe removed from saved" : "Recipe saved!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update saved status");
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-96 bg-muted rounded-lg" />
              <div className="h-8 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-serif font-bold mb-4">Recipe not found</h1>
          <Button onClick={() => navigate("/browse")}>
            Browse Recipes
          </Button>
        </div>
      </div>
    );
  }

  const tags = recipe.recipe_tags?.map((t: any) => t.tag) || [];
  const ingredients = recipe.ingredients || [];
  const steps = recipe.recipe_steps?.sort((a: any, b: any) => a.step_number - b.step_number) || [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {recipe.image_url && (
            <div className="aspect-video rounded-lg overflow-hidden mb-6 shadow-medium">
              <img
                src={recipe.image_url}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2">
                {recipe.title}
              </h1>
              {recipe.description && (
                <p className="text-lg text-muted-foreground mb-4">
                  {recipe.description}
                </p>
              )}
              {recipe.profile?.display_name && (
                <p className="text-sm text-muted-foreground">
                  By {recipe.profile.display_name}
                </p>
              )}
            </div>
            {user && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => saveMutation.mutate()}
                disabled={saveMutation.isPending}
              >
                <Heart
                  className={`h-5 w-5 ${
                    recipe.isSaved ? "fill-primary text-primary" : ""
                  }`}
                />
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            {recipe.cook_time && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-5 w-5" />
                <span>{recipe.cook_time} min</span>
              </div>
            )}
            {recipe.servings && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-5 w-5" />
                <span>{recipe.servings} servings</span>
              </div>
            )}
            {recipe.difficulty && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <ChefHat className="h-5 w-5" />
                <span className="capitalize">{recipe.difficulty}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {tags.map((tag: string, index: number) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="md:col-span-1 h-fit shadow-soft">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-serif font-semibold mb-4">Ingredients</h2>
                <ul className="space-y-2">
                  {ingredients.map((ing: any) => (
                    <li key={ing.id} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>
                        {ing.quantity} {ing.unit} {ing.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 shadow-soft">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-serif font-semibold mb-4">Instructions</h2>
                <ol className="space-y-4">
                  {steps.map((step: any) => (
                    <li key={step.id} className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                        {step.step_number}
                      </span>
                      <p className="pt-1">{step.instruction}</p>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
