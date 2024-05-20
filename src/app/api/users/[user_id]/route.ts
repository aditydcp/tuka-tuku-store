import { NextResponse, NextRequest } from "next/server";

import { prisma } from "@/utils/configs/db";

interface Params {
  params: { user_id: string };
}

export async function GET(request: NextRequest, context: Params) {
  try {
    // TODO: Protect this endpoint (admin only)
    const { user_id } = context.params;

    const data = await prisma.user.findFirst({
      where: {
        id: user_id,
      },
      cacheStrategy: { ttl: 60 },
    });

    if (!data) {
      return NextResponse.json(
        {
          message: "Failed to get user, data not found",
          method: "GET",
          data,
          error: "The user you are trying to retrieve does not exist",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Successfully get user",
      method: "GET",
      data,
      error: null,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "An error has occurred, please try again later",
        method: "GET",
        data: null,
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}