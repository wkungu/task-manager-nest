"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";  // Import the useAuthGuard hook
import ThemeToggle from '@/components/ThemeToggle';
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [hasMounted, setHasMounted] = useState(false);

  // Apply the useAuthGuard to manage user authentication
  const { isReady } = useAuthGuard();  // Use the hook here to check the auth status

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted || !isReady) return null;  // Only render the settings once the guard has finished checking the auth status

  return (
    <>
      <div className="flex justify-between items-center">
        <h6 className="font-bold">App Settings</h6>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="flex w-md items-center">
          <ThemeToggle />
          <span className="flex pl-5 align-center text-sm">Toggle Theme</span>
        </div>
      </div>
    </>
  );
}
