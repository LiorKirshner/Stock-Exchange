import { Model } from "../model.js";
import { FMP_API_KEY } from "../config.js";
const model = new Model();

const urlParams = new URLSearchParams(window.location.search);
const symbol = urlParams.get("symbol");
const container = document.getElementById("companyContainer");

function showLoading(msg = "Loading...") {
  container.innerHTML = `
    <div class="d-flex align-items-center justify-content-center py-5">
      <div class="spinner-border text-primary me-3" role="status"></div>
      <span>${msg}</span>
    </div>
  `;
}

function renderCompany(profile, price, changesPercentage, changeColor) {
  // צבע רקע דינמי לשינוי
  const bgChange =
    changeColor === "text-success"
      ? "bg-success bg-opacity-10"
      : "bg-danger bg-opacity-10";
  // אייקון שינוי
  const icon =
    changeColor === "text-success"
      ? '<i class="bi bi-arrow-up-right-circle-fill text-success"></i>'
      : '<i class="bi bi-arrow-down-right-circle-fill text-danger"></i>';

  // קיצור תיאור החברה ל-3 משפטים
  const descArr = (profile.description || "").split(".");
  const shortDesc =
    descArr.slice(0, 3).join(".") + (descArr.length > 3 ? "." : "");

  return `
    <div class="card shadow-lg border-0 my-5" style="max-width:700px;margin:auto;">
      <div class="p-4">
        <div class="d-flex align-items-center mb-2">
          <img src="${profile.image || ""}" alt="${profile.companyName || ""}" 
            class="me-3" style="height:40px;width:40px;object-fit:contain;background:#fff;border-radius:8px;">
          <h2 class="fw-bold mb-0" style="color:#1a237e">${
            profile.companyName || symbol
          }</h2>
          <span class="badge bg-secondary fs-6 ms-3">${
            profile.symbol || ""
          }</span>
          <span class="badge bg-info text-dark ms-2">${
            profile.industry || ""
          }</span>
        </div>
        <div class="d-flex align-items-center mb-3 mt-2">
          <span class="fs-5 fw-semibold me-3">Stock Price:</span>
          <span class="fs-5 fw-bold text-primary">$${price}</span>
          <span
            class="ms-4 px-3 py-1 rounded-pill ${bgChange} ${changeColor} fw-bold d-flex align-items-center"
            style="font-size:1.1rem;"
          >
            ${icon}
            <span class="ms-2">${changesPercentage}%</span>
          </span>
        </div>
        <p class="mb-3">${shortDesc}</p>
        <a href="${
          profile.website || "#"
        }" target="_blank" class="btn btn-outline-primary btn-sm px-4 mb-3">
          <i class="bi bi-globe"></i> Visit Website
        </a>
        <div>
          <h5 class="fw-bold mb-3 mt-4 text-primary">
            <i class="bi bi-graph-up-arrow"></i> Stock Price History (Last 3 Years)
          </h5>
          <div id="chartContainer" class="bg-light rounded p-3 shadow-sm"></div>
        </div>
      </div>
    </div>
  `;
}

function renderChart(prices, dates) {
  const chartContainer = document.getElementById("chartContainer");
  chartContainer.innerHTML = `<canvas id="historyChart" height="120"></canvas>`;
  const ctx = document.getElementById("historyChart").getContext("2d");
  new window.Chart(ctx, {
    type: "line",
    data: {
      labels: dates,
      datasets: [
        {
          label: "Stock Price",
          data: prices,
          fill: true,
          borderColor: "#1976d2",
          backgroundColor: "rgba(25, 118, 210, 0.15)",
          pointRadius: 0,
          tension: 0.2,
        },
      ],
    },
    options: {
      plugins: {
        legend: { display: false },
        tooltip: { mode: "index", intersect: false },
      },
      scales: {
        x: { display: true, ticks: { color: "#888" } },
        y: { display: true, ticks: { color: "#888" } },
      },
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

async function loadCompanyData() {
  if (!symbol) {
    container.textContent = "No company symbol provided.";
    return;
  }

  showLoading("Loading company data...");
  try {
    const profile = await model.fetchCompanyProfile(symbol);

    // Format price and change
    const price = profile.price !== undefined ? profile.price : "N/A";
    let changesPercentage =
      profile.changesPercentage !== undefined
        ? profile.changesPercentage
        : "N/A";
    if (
      typeof changesPercentage === "number" ||
      (typeof changesPercentage === "string" &&
        !isNaN(Number(changesPercentage)))
    ) {
      changesPercentage = Number(changesPercentage).toFixed(3);
    }
    let changeColor = "";
    if (typeof changesPercentage === "number") {
      changeColor = changesPercentage >= 0 ? "text-success" : "text-danger";
    } else if (typeof changesPercentage === "string") {
      changeColor = changesPercentage.startsWith("-")
        ? "text-danger"
        : "text-success";
    }

    container.innerHTML = renderCompany(
      profile,
      price,
      changesPercentage,
      changeColor
    );

    // טען Chart.js דינאמית אם לא נטען
    if (!window.Chart) {
      showLoading("Loading chart library...");
      await import("https://cdn.jsdelivr.net/npm/chart.js");
      container.innerHTML = renderCompany(
        profile,
        price,
        changesPercentage,
        changeColor
      );
    }

    // הצג אינדיקטור טעינה לגרף
    document.getElementById("chartContainer").innerHTML = `
      <div class="d-flex align-items-center justify-content-center py-3">
        <div class="spinner-border text-primary me-2" role="status"></div>
        <span>Loading stock price history...</span>
      </div>
    `;

    // משוך נתוני היסטוריה
    const resp = await fetch(
      `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?serietype=line&apikey=${FMP_API_KEY}`
    );
    const history = await resp.json();
    if (history && history.historical && history.historical.length > 0) {
      // סינון ל-3 שנים אחרונות
      const threeYearsAgo = new Date();
      threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);
      const filtered = history.historical.filter(
        (item) => new Date(item.date) >= threeYearsAgo
      );
      const prices = filtered.map((item) => item.close).reverse();
      const dates = filtered.map((item) => item.date).reverse();
      renderChart(prices, dates);
    } else {
      document.getElementById("chartContainer").innerHTML =
        "<div class='text-muted'>No history data available.</div>";
    }
  } catch (err) {
    console.error(err);
    container.innerHTML =
      "<div class='text-danger'>Failed to load company profile or chart data.</div>";
  }
}

loadCompanyData();
