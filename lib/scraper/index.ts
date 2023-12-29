"use server";

import axios from "axios";
import * as cheerio from "cheerio";
import { extractCurrency, extractPrice } from "../utils";

export const scrapeAmazonProduct = async (url: string) => {
  if (!url) return;

  // Bright Data Proxy Configuration
  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 22225; // From Base CURL in .env
  const session_id = (1000000 * Math.random()) | 0; // Returns an integer

  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password,
    },
    host: "brd.superproxy.io", // From Base CURL in .env
    port,
    rejectUnauthorized: false,
  };

  try {
    // Fetch the product page
    const response = await axios.get(url, options);
    const $ = cheerio.load(response.data);

    const title = $("#productTitle").text().trim();
    const currentPrice = extractPrice(
      $(".a-price.priceToPay span.a-offscreen"), // for .in website
      $("#priceblock_ourprice span.a-color-price"),

      $(".priceToPay span.a-price-whole"),
      $(".a.size.base.a-color-price"),
      $(".a-button-selected .a-color-base")
    );

    const originalPrice = extractPrice(
      $(".a-text-strike span.a-color-secondary"),
      $(".a-price.a-text-price span.a-offscreen"),

      $("#priceblock_ourprice"),
      $("#listPrice"),
      $("#priceblock_dealprice"),
      $(".a-size-base.a-color-price")
    );

    const isOutOfStock =
      $(
        ".a-declarative span.a-size-medium.a-color-success" ||
          "#availablity span"
      )
        .text()
        .trim()
        .toLowerCase() === "currently unavailable.";

    const images =
      $("#imgBlkFront").attr("data-a-dynamic-image") ||
      $("#landingImage").attr("data-a-dynamic-image") ||
      "{}";

    // Parse the image object
    const imageUrls = Object.keys(JSON.parse(images));

    const currency = extractCurrency($(".a-price-symbol"));

    const discountRate = $(".savingsPercentage").text().replace(/[-%]/g, ""); //removes the % sign

    // Construct data object with scraped information
    const data = {
      url,
      currency: currency || "$",
      image: imageUrls[0],
      title,
      currentPrice: Number(currentPrice) || Number(originalPrice),
      originalPrice: Number(originalPrice) || Number(currentPrice),
      priceHistory: [],
      discountRate: Number(discountRate),
      category: "category", // 🟡 TODO: Scrape Category to use it
      reviewsCount: 100, // 🟡 TODO: Scrape reviewCount first
      stars: 4.5, // 🟡 TODO: Scrape stars first
      isOutOfStock: isOutOfStock,
      lowestPrice: Number(currentPrice) || Number(originalPrice),
      highestPrice: Number(originalPrice) || Number(currentPrice),
      averagePrice: Number(currentPrice) || Number(originalPrice),
    };

    return data;
  } catch (error: any) {
    throw new Error(`Failed to scrape product: ${error.message}`);
  }
};
