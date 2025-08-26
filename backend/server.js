// server.js
import express from "express";
import fetch from "node-fetch"; // for Spoonacular API requests
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ✅ CORS: Allow frontend (local + Vercel) to call backend
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// ✅ Root route
app.get("/", (req, res) => {
  res.json({ message: "🍳 Recipe Finder API is running!" });
});

// ✅ Recipes route
app.get("/recipes", async (req, res) => {
  const ingredients = req.query.ingredients;

  if (!ingredients) {
    return res.status(400).json({ error: "⚠️ Ingredients are required" });
  }

  try {
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "⚠️ API_KEY is missing on server" });
    }

    const response = await fetch(
      `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(
        ingredients
      )}&number=10&apiKey=${apiKey}`
    );

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: errText });
    }

    const recipes = await response.json();
    return res.json({ recipes });
  } catch (error) {
    console.error("❌ Error fetching recipes:", error);
    return res.status(500).json({ error: "Server error fetching recipes" });
  }
});

// ✅ Vercel expects export as handler
export default app;
