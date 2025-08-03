import { FMP_API_KEY } from "./config.js";

const MOCK_MODE = true; // Set to false to use the real API

const mockResults = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "GOOG", name: "Alphabet Inc." },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "TSLA", name: "Tesla Inc." },
  { symbol: "META", name: "Meta Platforms Inc." },
  { symbol: "NVDA", name: "NVIDIA Corporation" },
  { symbol: "NFLX", name: "Netflix Inc." },
  { symbol: "ADBE", name: "Adobe Inc." },
  { symbol: "INTC", name: "Intel Corporation" },
];

export class Model {
  async safeFetch(url) {
    if (MOCK_MODE) {
      // Simulate network delay
      await new Promise((res) => setTimeout(res, 300));
      // תמיד מחזיר את אפל בפרופיל
      if (url.includes("company/profile")) {
        return {
          profile: {
            companyName: "Apple Inc.",
            symbol: "AAPL",
            industry: "Technology",
            description:
              "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.",
            website: "https://www.apple.com",
            image: "https://logo.clearbit.com/apple.com",
            price: 195.12,
            changesPercentage: 1.23,
          },
        };
      }
      // חיפוש מחזיר את כל הרשימה
      if (url.includes("search-ticker")) {
        return mockResults;
      }
      // היסטוריית מחירים לדוגמה (רק לאפל)
      if (url.includes("historical-price-full")) {
        const today = new Date();
        const data = [];
        for (let i = 0; i < 36; i++) {
          const d = new Date(today);
          d.setMonth(today.getMonth() - i);
          data.push({
            date: d.toISOString().slice(0, 10),
            close: 120 + Math.sin(i / 3) * 10 + i * 2,
          });
        }
        return { historical: data.reverse() };
      }
      return mockResults;
    }
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch from ${url}`);
    const data = await res.json();
    return data;
  }

  async fetchStockByName(query) {
    const url = `https://financialmodelingprep.com/api/v3/search-ticker?query=${encodeURIComponent(
      query
    )}&limit=10&exchange=NASDAQ&apikey=${FMP_API_KEY}`;
    return await this.safeFetch(url);
  }
  async fetchCompanyProfile(symbol) {
    const url = `https://financialmodelingprep.com/api/v3/company/profile/${symbol}?apikey=${FMP_API_KEY}`;
    const data = await this.safeFetch(url);
    return data.profile; // API returns { profile: { ... } }
  }
}
