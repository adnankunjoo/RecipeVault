import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Loader2, ChefHat, Clock, Users } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

interface GeneratedRecipe {
  title: string;
  description: string;
  ingredients: Array<{ name: string; quantity: string; unit: string }>;
  steps: string[];
  cookTime: number;
  servings: number;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  nutritionInfo?: {
    calories?: number;
    protein?: string;
    carbs?: string;
    fats?: string;
  };
}

const Generate = () => {
  const [ingredients, setIngredients] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<GeneratedRecipe | null>(null);

  const handleGenerate = async () => {
    if (!ingredients.trim()) {
      toast.error("Please enter some ingredients");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-recipe", {
        body: { ingredients: ingredients.trim() },
      });

      if (error) throw error;
      
      setRecipe(data.recipe);
      toast.success("Recipe generated successfully!");
    } catch (error: any) {
      console.error("Generation error:", error);
      toast.error(error.message || "Failed to generate recipe");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecipe = async () => {
    if (!recipe) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to save recipes");
        return;
      }

      // Insert recipe
      const { data: recipeData, error: recipeError } = await supabase
        .from("recipes")
        .insert({
          user_id: user.id,
          title: recipe.title,
          description: recipe.description,
          cook_time: recipe.cookTime,
          servings: recipe.servings,
          difficulty: recipe.difficulty,
          is_ai_generated: true,
          nutrition_info: recipe.nutritionInfo,
        })
        .select()
        .single();

      if (recipeError) throw recipeError;

      // Insert ingredients
      const ingredientsData = recipe.ingredients.map((ing, index) => ({
        recipe_id: recipeData.id,
        name: ing.name,
        quantity: ing.quantity,
        unit: ing.unit,
        order_index: index,
      }));

      const { error: ingredientsError } = await supabase
        .from("ingredients")
        .insert(ingredientsData);

      if (ingredientsError) throw ingredientsError;

      // Insert steps
      const stepsData = recipe.steps.map((step, index) => ({
        recipe_id: recipeData.id,
        step_number: index + 1,
        instruction: step,
      }));

      const { error: stepsError } = await supabase
        .from("recipe_steps")
        .insert(stepsData);

      if (stepsError) throw stepsError;

      // Insert tags
      const tagsData = recipe.tags.map((tag) => ({
        recipe_id: recipeData.id,
        tag: tag,
      }));

      const { error: tagsError } = await supabase
        .from("recipe_tags")
        .insert(tagsData);

      if (tagsError) throw tagsError;

      toast.success("Recipe saved to your collection!");
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error(error.message || "Failed to save recipe");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">AI Recipe Generator</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              What's In Your Kitchen?
            </h1>
            <p className="text-lg text-muted-foreground">
              Enter your available ingredients and let AI create a perfect recipe for you
            </p>
          </div>

          <Card className="shadow-medium mb-8">
            <CardHeader>
              <CardTitle>Your Ingredients</CardTitle>
              <CardDescription>
                List the ingredients you have available (e.g., "chicken, rice, tomatoes, garlic")
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter your ingredients here..."
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <Button 
                onClick={handleGenerate} 
                disabled={loading}
                className="w-full bg-gradient-hero hover:opacity-90"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating Recipe...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate Recipe
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {recipe && (
            <Card className="shadow-medium">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-3xl font-serif mb-2">{recipe.title}</CardTitle>
                    <CardDescription className="text-base">{recipe.description}</CardDescription>
                  </div>
                  <Button onClick={handleSaveRecipe} variant="outline">
                    Save Recipe
                  </Button>
                </div>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{recipe.cookTime} min</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{recipe.servings} servings</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <ChefHat className="h-4 w-4" />
                    <span className="capitalize">{recipe.difficulty}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {recipe.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-serif font-semibold mb-3">Ingredients</h3>
                  <ul className="space-y-2">
                    {recipe.ingredients.map((ing, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>
                          {ing.quantity} {ing.unit} {ing.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-serif font-semibold mb-3">Instructions</h3>
                  <ol className="space-y-4">
                    {recipe.steps.map((step, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                          {index + 1}
                        </span>
                        <p className="pt-1">{step}</p>
                      </li>
                    ))}
                  </ol>
                </div>

                {recipe.nutritionInfo && (
                  <div>
                    <h3 className="text-xl font-serif font-semibold mb-3">Nutrition (per serving)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {recipe.nutritionInfo.calories && (
                        <div className="bg-muted p-3 rounded-lg">
                          <p className="text-sm text-muted-foreground">Calories</p>
                          <p className="text-lg font-semibold">{recipe.nutritionInfo.calories}</p>
                        </div>
                      )}
                      {recipe.nutritionInfo.protein && (
                        <div className="bg-muted p-3 rounded-lg">
                          <p className="text-sm text-muted-foreground">Protein</p>
                          <p className="text-lg font-semibold">{recipe.nutritionInfo.protein}</p>
                        </div>
                      )}
                      {recipe.nutritionInfo.carbs && (
                        <div className="bg-muted p-3 rounded-lg">
                          <p className="text-sm text-muted-foreground">Carbs</p>
                          <p className="text-lg font-semibold">{recipe.nutritionInfo.carbs}</p>
                        </div>
                      )}
                      {recipe.nutritionInfo.fats && (
                        <div className="bg-muted p-3 rounded-lg">
                          <p className="text-sm text-muted-foreground">Fats</p>
                          <p className="text-lg font-semibold">{recipe.nutritionInfo.fats}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Generate;
