"use client";
import { useEffect, useState } from "react";
import { useAppContext } from "@/context";
import Image from "next/image";

interface Product {
  id: number;
  title: string;
  description: string;
  image: string;
  comments: number;
  rate: number;
  created_at: string;
  updated_at: string;
  rating?: number;
  price?: number;
  category?: string;
}

interface UserOrder {
  id: number;
  user_id: number;
  product_id: number;
  status: string;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
  };
  product: Product;
}

const CartPage = () => {
  const [userOrders, setUserOrders] = useState<UserOrder[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { count, setCount,setItemCount } = useAppContext();

  useEffect(() => {
    fetchUserOrders();
  },[]);

  const fetchUserOrders = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsLoading(false);
      return;
    }

    fetch("https://event-reg.app/flutter_test/api/orders", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch orders");
        }
      })
      .then((data) => {
        if (Array.isArray(data.data)) {
          setUserOrders(data.data);
          const userOrders = data.data.length;
          setCount(userOrders);
          localStorage.setItem("ordersCount", userOrders.toString());
        } else {
          throw new Error("Invalid data format");
        }
      })
      .catch((error) => {
        setError(`Error fetching orders: ${error.message}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const deleteOrder = (orderId: number) => {
    const token = localStorage.getItem("token");

    fetch(`https://event-reg.app/flutter_test/api/orders/${orderId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          const ordersCount = localStorage.getItem("ordersCount");
          if (ordersCount) {
            const updatedCount = parseInt(ordersCount) - 1;
            localStorage.setItem("ordersCount", updatedCount.toString());
            const newCountValue = localStorage.getItem("ordersCount");
            setCount(newCountValue);
          }
          setUserOrders((prevOrders) =>
            prevOrders.filter((order) => order.id !== orderId)
          );
        } else {
          throw new Error("Failed to delete order");
        }
      })
      .catch((error) => {
        setError(`Error deleting order: ${error.message}`);
      });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : userOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white shadow-md p-4 rounded-lg relative flex flex-col"
            >
              <Image
                src={order.product.image}
                alt={order.product.title}
                className="h-48 w-full object-cover mb-4 rounded-lg"
                width={324}
                height={192}
                priority
              />
              <h3 className="text-lg font-semibold mb-2">
                {order.product.title}
              </h3>
              <p className="text-gray-600 mb-2">{order.product.description}</p>
              <div className="flex items-center justify-between mt-auto">
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded-md mt-2"
                  onClick={() => deleteOrder(order.id)}
                >
                  Delete Order
                </button>
                <div className="bg-gray-400 py-1 px-2 rounded-md">
                  {order.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default CartPage;
