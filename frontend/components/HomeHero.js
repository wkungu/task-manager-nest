'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import { RocketIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HomeHero() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white px-4">
      <div className="max-w-2xl text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center space-x-2 justify-center mb-2">
            <RocketIcon className="h-6 w-6 text-blue-600" />
            <span className="text-blue-600 font-semibold tracking-wide uppercase text-sm">
              Task Manager
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800">
            Organize Your Work & Life
          </h1>

          <p className="text-gray-600 text-lg mt-2">
            Simplify task tracking, stay productive, and get things done — all in one place.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex justify-center space-x-4 pt-4"
        >
          <Link href="/login">
            <Button className="px-6 py-2 text-base">Login</Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" className="px-6 py-2 text-base">
              Register
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
