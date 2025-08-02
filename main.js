import { Model } from "./model.js";
import { Renderer } from "./render.js";

const model = new Model();
const renderer = new Renderer();

document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("searchBtn");
  const input = document.getElementById("searchInput");

  searchBtn.addEventListener("click", async () => {
    const stockName = input.value.trim();
    if (!stockName) return;

    try {
      const results = await model.fetchStockByName(stockName);
      renderer.renderSearchResults(results);
    } catch (err) {
      console.error("Error loading results:", err.message);
      document.getElementById("searchResult").textContent = "שגיאה בטעינת התוצאות.";
    }
  });
});
