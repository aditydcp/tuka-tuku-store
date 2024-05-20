import { NextResponse, NextRequest } from "next/server";

import { OrderSchema, orderSchema } from "@/utils/types/transactions";
import { prisma } from "@/utils/configs/db";
import { error } from "console";

interface Params {
  params: { transaction_id: string };
}

export async function GET(request: NextRequest, context: Params) {
  try {
    // TODO: Protect this endpoint (admin only)
    const { transaction_id } = context.params;

    const data = await prisma.transaction.findUnique({
      where: {
        id: transaction_id,
      },
      include: {
        user: {
          select: {
            email: true,
            name: true,
            address: true,
          },
        },
        order: {
          select: {
            id: true,
            total: true,
            status: true,
            items: {
              select: {
                id: true,
                quantity: true,
                price: true,
                product: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
      },
      cacheStrategy: { ttl: 60 },
    });

    return NextResponse.json({
      message: "Successfully get transaction",
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

export async function PUT(request: NextRequest, context: Params) {
  try {
    // TODO: Protect this endpoint (admin only)
    const { status } = (await request.json()) as OrderSchema;
    const { transaction_id } = context.params;

    const validatedFields = orderSchema.safeParse({
      status,
    });

    if (!validatedFields.success) {
      return NextResponse.json(
        {
          message: "Failed to update transaction, please check your input",
          method: "PUT",
          data: null,
          reason: validatedFields.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = await prisma.order.update({
      where: {
        transaction_id: transaction_id,
      },
      data: {
        status,
      },
    });

    return NextResponse.json({
      message: "Successfully update transaction",
      method: "PUT",
      data,
      reason: null,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "An error has occurred, please try again later",
        method: "PUT",
        data: null,
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}