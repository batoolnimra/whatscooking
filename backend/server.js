const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();

// ✅ CORS setup (allow local + deployed frontend)
app.use(cors({
  origin: ["http://127.0.0.1:5500", "https://your-frontend.vercel.app"], 
  credentials: true
}));

// Parse JSON
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
    const apiKey = process.env.API_KEY; // ✅ API key from Vercel env variables

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

// ⚠️ Do NOT call app.listen() for Vercel — it handles server start automatically
module.exports = app;
