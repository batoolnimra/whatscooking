require("dotenv").config(); // must be at top
const express = require("express");
const axios = require("axios");
const cors = require("cors");
app.use(cors());
const app = express();
app.use(cors());

const PORT = 3000;

// Loud startup log
console.log("🚀 HELLO from server.js — starting up!");

// Home Route
app.get("/", (req, res) => {
  res.send("🍴 Welcome to Recipe Finder API!");
});

// Recipes Route
app.get("/recipes", async (req, res) => {
  try {
    const ingredients = req.query.ingredients;
    console.log("🟢 /recipes route hit!");
    console.log("Incoming ingredients:", ingredients);

    const url = "https://api.spoonacular.com/recipes/findByIngredients";
    const params = {
      ingredients: ingredients,
      number: 5,
      apiKey: process.env.API_KEY,
    };

    console.log("➡️ Sending request to Spoonacular with params:", params);

    const response = await axios.get(url, { params });

    console.log("✅ Raw API Data Example:", response.data[0]); // first recipe only

    const recipes = response.data.map(r => ({
      id: r.id,
      title: r.title,
      image: r.image,
      link: `https://spoonacular.com/recipes/${r.title.replace(/ /g, "-")}-${r.id}`
    }));

    console.log("✨ Processed Recipe Example:", recipes[0]);
    res.json(recipes);
  } catch (error) {
    console.error("❌ Error from Spoonacular:", error.response?.data || error.message);
    res.status(500).json({ error: "Something went wrong fetching recipes!" });
  }
});

app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
