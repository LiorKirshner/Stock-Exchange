import { FMP_API_KEY } from "./config.js";

const MOCK_MODE = false; // Set to false to use the real API

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
      if (url.includes("company/profile")) {
        return {
          profile: {
            companyName: "Mocked Company",
            description: "This is a mocked company description.",
            website: "https://example.com",
            image: "https://via.placeholder.com/100",
          },
        };
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
