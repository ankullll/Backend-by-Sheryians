
const { tool } = require("@langchain/core/tools");
const axios = require("axios");
const { z } = require("zod");

const searchProduct = tool(
  async ({ query, token }) => {
    if (!token) throw new Error("Authentication token missing");

    console.log("Search product:", query);
    console.log("Token received:", Boolean(token));

    const response = await axios.get(
      "http://localhost:3001/api/products",
      {
        params: { q: query },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return JSON.stringify(response.data);
  },
  {
    name: "searchProduct",
    description: "Search for products based on a query",
    schema: z.object({
      query: z.string().describe("Search query for products"),
      token: z.string().optional(),
    }),
  }
);

const addProductToCart = tool(
  async ({ productId, qty = 1, token }) => {
    if (!token) throw new Error("Authentication token missing");

    const response = await axios.post(
      "http://localhost:3002/api/cart/items",
      { productId, qty },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return `Added product ${productId} (qty: ${qty}) to cart`;
  },
  {
    name: "addProductToCart",
    description: "Add a product to the shopping cart",
    schema: z.object({
      productId: z.string().describe("ID of the product to add"),
      qty: z.number().default(1),
      token: z.string().optional(),
    }),
  }
);

module.exports = { searchProduct, addProductToCart };
