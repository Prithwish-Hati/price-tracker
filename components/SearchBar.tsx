"use client";

import { scrapeAndStoreProduct } from "@/lib/actions";
import { redirect } from "next/navigation";
import { FormEvent, useState } from "react";

const SearchBar = () => {
  const [searchPrompt, setSearchPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isValidProductURL = (url: string) => {
    try {
      const parsedURL = new URL(url); // takes a URL string and parses it into a URL object
      const hostname = parsedURL.hostname; // extracts the base domain name

      if (
        hostname.includes("amazon.com") ||
        hostname.includes("amazon.") || //for diffrent countries
        hostname.includes("amazon") // for subdomains like example.amazon.com
      ) {
        return true;
      }
    } catch (error) {
      return false; // prevents the function from proceeding further and signifies that the input URL is not valid or cannot be parsed properly
    }

    return false; // provided URL is not an Amazon product URL based on the defined conditions
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Checks if searchPrompt is a valid URL
    const isValidLink = isValidProductURL(searchPrompt);
    if (!isValidLink) return alert("Please provide a valid Amazon link");

    try {
      setIsLoading(true);

      const product = await scrapeAndStoreProduct(searchPrompt);
     
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false); // ensures that isLoading is reset to false after attempting to scrape whether or not an error was encountered during the process
    }
  };

  return (
    <form className="flex flex-wrap gap-4 mt-12" onSubmit={handleSubmit}>
      <input
        type="text"
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
        placeholder="Enter product link"
        className="searchbar-input"
      />

      <button
        type="submit"
        disabled={searchPrompt === ""}
        className="searchbar-btn"
      >
        {isLoading ? "Searching..." : "Search"}
      </button>
    </form>
  );
};

export default SearchBar;
