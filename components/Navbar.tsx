"use client";
import Link from "next/link";
import { MouseEvent, useEffect, useState } from "react";
import { FaCartArrowDown } from "react-icons/fa";
import { useAppContext } from "@/context";

const Navbar: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const { count, setCount } = useAppContext();


  useEffect(() => {
    const items = localStorage.getItem("items");
    const userEmail = localStorage.getItem("userEmail");
    const userName = localStorage.getItem("userName");
    const countValue = localStorage.getItem("ordersCount");

    setCount(countValue);
    
    if (userName && userEmail) {
      setIsLoggedIn(true);
    }
  }, []);

  function handleLogout(e: MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();

    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    localStorage.setItem("ordersCount", "0");
    window.location.href = "/login";
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <Link href="/" className="text-xl font-bold">
            Rs4it
          </Link>
        </div>
        <div>
          <ul className="flex items-center space-x-4">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>

            {isLoggedIn ? (
              <>
                <li>
                  <Link
                    href="/"
                    onClick={(e) => {
                      handleLogout(e);
                    }}
                  >
                    Logout
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/login" className="hover:underline">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:underline">
                    Register
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link href={"/cart"} className="relative">
                <FaCartArrowDown size={25} />
                <span className="absolute top-0 right-0 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold">
                  {count}
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
