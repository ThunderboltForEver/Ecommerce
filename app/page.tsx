"use client";
import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCardWithOrder";

interface Product {
  id: number;
  title: string;
  description: string;
  image: string;
  comments: number;
  rate: number;
  created_at: string;
  updated_at: string;
  rating: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [titleFilter, setTitleFilter] = useState<string>("");

  const token = "2|Krr2meJWbTKIR4iCWTX3JysazBcUY4AoCJOHdH9J";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://event-reg.app/flutter_test/api/products",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setProducts(data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTitleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTitleFilter(e.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(titleFilter.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-4xl mb-4 text-center">Welcome to our Store!</h1>

      <div className="px-4">
        <label htmlFor="titleFilter" className="mr-2">
          Title:
        </label>
        <select
          id="titleFilter"
          onChange={handleTitleFilterChange}
          value={titleFilter}
          className="border rounded p-1"
        >
          <option value="">All Products</option>
          {Array.from(new Set(products.map((product) => product.title))).map(
            (title) => (
              <option key={title} value={title}>
                {title}
              </option>
            )
          )}
        </select>
      </div>

      {loading ? (
        <p className="px-4">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
