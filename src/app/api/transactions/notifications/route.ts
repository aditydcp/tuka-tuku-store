import { NextResponse, NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  return NextResponse.json({
    message: "Transaction failed",
    data: null,
  });
};