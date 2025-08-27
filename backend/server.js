import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ✅ Recipe route
app.get("/recipes", async (req, res) => {
  const ingredients = req.query.ingredients;
  if (!ingredients) {
    return res.status(400).json({ error: "Ingredients are required" });
  }

  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=10&apiKey=${process.env.API_KEY}`
    );

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Failed to fetch recipes" });
    }

    const data = await response.json();
    res.json({ recipes: data });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Port for local dev (Vercel ignores this)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
