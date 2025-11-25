import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Recipe from "./pages/Recipe";
import AddRecipe from "./pages/AddRecipe";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        
        {/* Main Content */}
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recipe/:id" element={<Recipe />} />
            <Route path="/add" element={<AddRecipe />} />
          </Routes>
        </div>

        {/* Footer */}
        <footer className="w-full py-6 flex items-center justify-center border-t mt-10">
          <p className="text-sm text-muted-foreground">
            Crafted with ❤️ by <span className="font-medium text-foreground">Adnan</span>
          </p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default
