const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors()); // ✅ Allow frontend (Netlify/Localhost) to call backend
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.send("Welcome to Recipe Finder API 🍱");
});

// Recipes route
app.get("/recipes", async (req, res) => {
  const { ingredients } = req.query;

  if (!ingredients) {
    return res.status(400).json({ error: "❌ Ingredients are required" });
  }

  try {
    const apiKey = process.env.API_KEY; // ✅ Use the env variable from Vercel

    // Call Spoonacular API
    const response = await fetch(
      `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=5&apiKey=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Spoonacular API error: ${response.status}`);
    }

    const data = await response.json();

    // Send recipes back to frontend
    res.json(data);
  } catch (err) {
    console.error("❌ Error fetching recipes:", err);
    res.status(500).json({ error: "💔 Failed to fetch recipes" });
  }
});

// Start server locally
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Recipe API running on port ${PORT}`);
});
