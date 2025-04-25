"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard"; // Import the auth guard
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import ThemeToggle from "@/components/ThemeToggle";

const Navbar = ({ title }) => {
  const [hasMounted, setHasMounted] = useState(false);
  const { isReady } = useAuthGuard();  // Use the auth guard hook
  const { data: session } = useSession(); // Access session data
  
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Prevent rendering until authentication status is checked
  if (!hasMounted || !isReady) return null;

  return (
    <header className="w-full bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center">
      <h1 className="text-lg font-bold">{title ? title : "Dashboard"}</h1>
      <div className="flex items-center space-x-4">
        <span className="text-gray-700 dark:text-white">{session?.user?.email}</span>
        <ThemeToggle />
        <button
          onClick={() => signOut()}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
