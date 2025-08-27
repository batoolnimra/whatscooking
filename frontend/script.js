const searchBtn = document.getElementById("searchBtn");
const ingredientInput = document.getElementById("ingredientInput");
const recipesContainer = document.getElementById("recipesContainer");

// ✅ Auto-detect backend URL
const backendUrl =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://whatscooking-three.vercel.app";

searchBtn.addEventListener("click", async () => {
  const ingredients = ingredientInput.value.trim();
  if (!ingredients) {
    alert("🍡 Please enter some ingredients!");
    return;
  }

  try {
    const res = await fetch(
      `${backendUrl}/recipes?ingredients=${encodeURIComponent(ingredients)}`
    );
    const data = await res.json();

    recipesContainer.innerHTML = "";

    if (!data.recipes || data.recipes.length === 0) {
      recipesContainer.innerHTML =
        "<p class='text-gray-500 text-center w-full'>😢 No recipes found</p>";
      return;
    }

    data.recipes.forEach((recipe) => {
      const card = document.createElement("div");
      card.className = "bg-white rounded-xl shadow-md p-4";

      const recipeLink = `https://spoonacular.com/recipes/${recipe.title.replace(
        / /g,
        "-"
      )}-${recipe.id}`;

      card.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.title}" class="rounded-xl mb-3 w-full h-40 object-cover border-2 border-pink-200">
        <h2 class="font-bold text-lg mb-2 text-pink-700">🍱 ${recipe.title}</h2>
        <a href="${recipeLink}" target="_blank" 
           class="text-pink-600 font-medium hover:underline">✨ View Recipe ✨</a>
      `;

      recipesContainer.appendChild(card);
    });
  } catch (err) {
    console.error("Error fetching recipes:", err);
    recipesContainer.innerHTML =
      "<p class='text-red-500'>💔 Error fetching recipes</p>";
  }
});
