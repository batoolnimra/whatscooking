const searchBtn = document.getElementById("searchBtn");
const ingredientInput = document.getElementById("ingredientInput");
const recipesContainer = document.getElementById("recipesContainer");

searchBtn.addEventListener("click", async () => {
  const ingredients = ingredientInput.value.trim();
  if (!ingredients) {
    alert("🍡 Please enter some ingredients!");
    return;
  }

  try {
    const res = await fetch(
      `https://whatscooking-patros-projects-bdfb20aa.vercel.app/recipes?ingredients=${encodeURIComponent(ingredients)}`,
      {
        method: "GET",
        credentials: "include"   // 🔑 include cookies
      }
    );

    const data = await res.json();

    recipesContainer.innerHTML = "";

    if (!data || data.length === 0) {
      recipesContainer.innerHTML = "<p class='text-gray-500 text-center w-full'>😢 No recipes found</p>";
      return;
    }

    data.forEach(recipe => {
      const card = document.createElement("div");
      card.className = "anime-card bg-pink-50 rounded-2xl shadow-md p-4";

      const recipeLink = recipe.link 
        ? recipe.link 
        : `https://spoonacular.com/recipes/${recipe.title.replace(/ /g, "-")}-${recipe.id}`;

      card.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.title}" class="rounded-xl mb-3 w-full h-40 object-cover border-2 border-pink-200">
        <h2 class="font-bold text-lg mb-2 text-pink-700">🍱 ${recipe.title}</h2>
        <a href="${recipeLink}" target="_blank" 
           class="text-pink-600 font-medium hover:underline">✨ View Recipe ✨</a>
      `;

      recipesContainer.appendChild(card);
    });

  } catch (err) {
    console.error("Error fetching recipes:", err.message || err);
    recipesContainer.innerHTML = "<p class='text-red-500'>💔 Error fetching recipes</p>";
  }
});

// Bubbles generator for kawaii vibe 🫧
const bubbleContainer = document.getElementById("bubble-container");

function createBubble() {
  const bubble = document.createElement("div");
  bubble.classList.add("bubble");
  const size = Math.random() * 40 + 10 + "px";
  bubble.style.width = size;
  bubble.style.height = size;
  bubble.style.left = Math.random() * window.innerWidth + "px";
  bubble.style.background = Math.random() > 0.5 
    ? "rgba(255, 182, 193, 0.4)"  // pink
    : "rgba(173, 216, 230, 0.4)"; // light blue

  bubbleContainer.appendChild(bubble);

  setTimeout(() => {
    bubble.remove();
  }, 20000);
}

setInterval(createBubble, 1000);
