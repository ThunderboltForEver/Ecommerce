import Link from "next/link";
import { MdAddShoppingCart, MdCheck } from "react-icons/md";
import { useState, useEffect } from "react";
import ReactStars from "react-stars";
import { useAppContext } from "@/context";

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

interface ProductCardWithOrderProps {
  product: Product;
}

const ProductCardWithOrder: React.FC<ProductCardWithOrderProps> = ({
  product,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);
  const { count, setCount } = useAppContext();
  const [localStorageOrdersCount, setLocalStorageOrdersCount] =
    useState<number>(0);

  useEffect(() => {
    if (showSuccessAlert) {
      const timeoutId = setTimeout(() => {
        setShowSuccessAlert(false);
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [showSuccessAlert]);

  const handleSubmit = async () => {
    if (!isLoading) {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await fetch(
            "https://event-reg.app/flutter_test/api/orders",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ product_id: product.id }),
            }
          );

          if (response.ok) {
            const ordersCount = localStorage.getItem("ordersCount") || "0";
            const newOrdersCount = parseInt(ordersCount, 10) + 1;
            localStorage.setItem("ordersCount", newOrdersCount.toString());
            const newOrdersCountValue = localStorage.getItem("ordersCount");
            setCount(newOrdersCountValue);
            setShowSuccessAlert(true);
          } else {
            console.error("Failed to submit order");
          }
        }
      } catch (error) {
        console.error("Error submitting order:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const ratingChanged = async (rate: number) => {
    if (!isLoading) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch(
            "https://event-reg.app/flutter_test/api/rate",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ product_id: product.id, rate: rate }),
            }
          );
          if (!response.ok) {
            console.error("Error submitting rating:", response.statusText);
          }
        } catch (error) {
          console.error("Error submitting rating:", error);
        }
      }
    }
  };

  return (
    <div className="bg-white shadow-md p-4 rounded-lg relative flex flex-col justify-between">
      <Link href={`/product/${product.id}`}>
        <img
          src={product.image}
          alt={product.title}
          className="h-48 w-full object-cover mb-4 rounded-lg"
        />
        <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
        <p className="text-gray-600 mb-2">{product.description}</p>
      </Link>
      <div>
        <p className="text-blue-600 font-bold">Comments: {product.comments}</p>

        <ReactStars
          count={5}
          size={24}
          color2={"#ffd700"}
          value={product.rate}
          onChange={ratingChanged}
          className="text-blue-600 font-bold"
        />
      </div>
      {showSuccessAlert && (
        <div
          className="absolute -top-10 p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
          role="alert"
        >
          <span className="font-medium">Product Added successfully</span>
        </div>
      )}
      <button
        onClick={handleSubmit}
        className={`absolute bottom-6 right-4 text-lg flex flex-col items-center select-none ${
          isLoading ? "opacity-50" : ""
        }`}
        disabled={isLoading}
      >
        <MdAddShoppingCart />
      </button>
    </div>
  );
};

export default ProductCardWithOrder;
