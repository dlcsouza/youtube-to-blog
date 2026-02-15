"use client";

import { useEffect, useState } from "react";
import { Clock, Zap } from "lucide-react";

interface UsageStats {
  used: number;
  limit: number;
  remaining: number;
  resetAt: number;
}

export function UsageBanner() {
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [timeUntilReset, setTimeUntilReset] = useState<string>("");

  useEffect(() => {
    fetchUsage();
  }, []);

  useEffect(() => {
    if (!stats) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = stats.resetAt - now;

      if (diff <= 0) {
        setTimeUntilReset("Resetting...");
        fetchUsage(); // Refresh stats
        return;
      }

      const hours = Math.floor(diff / 1000 / 60 / 60);
      const minutes = Math.floor((diff / 1000 / 60) % 60);

      setTimeUntilReset(`${hours}h ${minutes}m`);
    }, 1000);

    return () => clearInterval(interval);
  }, [stats]);

  async function fetchUsage() {
    try {
      const res = await fetch("/api/usage");
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch usage:", error);
    }
  }

  if (!stats) return null;

  const percentage = (stats.used / stats.limit) * 100;
  const isLimitReached = stats.remaining === 0;

  return (
    <div className="mb-6 rounded-lg border border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
            <Zap className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                Free Conversions
              </span>
              {isLimitReached && (
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                  Limit Reached
                </span>
              )}
            </div>
            <div className="mt-1 text-2xl font-bold text-gray-900">
              {stats.remaining} <span className="text-sm font-normal text-gray-500">/ {stats.limit} remaining</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>Resets in {timeUntilReset}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-full transition-all duration-300 ${
            isLimitReached
              ? "bg-red-500"
              : percentage > 66
              ? "bg-yellow-500"
              : "bg-blue-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {isLimitReached && (
        <div className="mt-3 rounded-md bg-white p-3 text-sm text-gray-700">
          <p className="font-medium">Want to convert more videos today?</p>
          <p className="mt-1">
            Purchase a single conversion for <span className="font-semibold">$5</span> or wait{" "}
            {timeUntilReset} for your free tier to reset.
          </p>
        </div>
      )}
    </div>
  );
}
