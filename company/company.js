import { Model } from "../model.js";
import { Renderer } from "../render.js";
const model = new Model();

const urlParams = new URLSearchParams(window.location.search);
const symbol = urlParams.get("symbol");

const container = document.getElementById("companyContainer");

if (!symbol) {
  container.textContent = "No company symbol provided.";
} else {
  model
    .fetchCompanyProfile(symbol)
    .then((profile) => {
      container.innerHTML = `
        <img src="${profile.image}" alt="${profile.companyName}" width="100" />
        <h2>${profile.companyName}</h2>
        <p>${profile.description}</p>
        <a href="${profile.website}" target="_blank">Visit Website</a>
      `;
    })
    .catch((err) => {
      console.error(err);
      container.textContent = "Failed to load company profile.";
    });
}
