import { FMP_API_KEY } from "./config.js";

export class Model {
  async safeFetch(url) {
    // A reusable helper for all API requests
    // Handles fetch, response validation, and JSON parsing in one place
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch from ${url}`);
    const data = await res.json();
    return data;
  }

  async fetchStockByName(query) {
    const url = `https://financialmodelingprep.com/api/v3/search?query=${encodeURIComponent(
      query
    )}&limit=10&exchange=NASDAQ&apikey=${FMP_API_KEY}`;
    return await this.safeFetch(url);
  }
}
