import { Link } from "react-router-dom";
import { Clock, Users, ChefHat } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RecipeCardProps {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  cookTime?: number;
  servings?: number;
  difficulty?: "easy" | "medium" | "hard";
  tags?: string[];
}

const RecipeCard = ({
  id,
  title,
  description,
  imageUrl,
  cookTime,
  servings,
  difficulty,
  tags = [],
}: RecipeCardProps) => {
  const difficultyColors = {
    easy: "bg-secondary text-secondary-foreground",
    medium: "bg-accent text-accent-foreground",
    hard: "bg-primary text-primary-foreground",
  };

  return (
    <Link to={`/recipe/${id}`}>
      <Card className="overflow-hidden hover:shadow-medium transition-all duration-300 hover:-translate-y-1 group">
        <div className="aspect-video overflow-hidden bg-gradient-card">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <ChefHat className="h-16 w-16 text-muted-foreground opacity-30" />
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="text-xl font-serif font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {description}
            </p>
          )}
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {cookTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{cookTime} min</span>
              </div>
            )}
            {servings && (
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{servings} servings</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex flex-wrap gap-2">
          {difficulty && (
            <Badge className={difficultyColors[difficulty]}>
              {difficulty}
            </Badge>
          )}
          {tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="outline">
              {tag}
            </Badge>
          ))}
        </CardFooter>
      </Card>
    </Link>
  );
};

export default RecipeCard;
