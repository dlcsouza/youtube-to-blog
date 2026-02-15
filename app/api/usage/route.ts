import { NextResponse } from "next/server";
import { getUsageStats } from "@/lib/rate-limit";

export async function GET() {
  try {
    const stats = getUsageStats();
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Usage stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch usage stats" },
      { status: 500 }
    );
  }
}
