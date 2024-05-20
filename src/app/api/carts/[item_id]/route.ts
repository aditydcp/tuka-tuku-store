import { CartSchema, cartSchema } from "@/utils/types/carts";
import { nullIfError } from "@/utils/functions";
import { prisma } from "@/utils/configs/db";
import { NextRequest, NextResponse } from "next/server";
import { error } from "console";

interface Params {
  params: { item_id: string };
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    // TODO: Protect this endpoint

    const { quantity } = (await request.json()) as CartSchema;
    const { item_id } = params;

    const validatedFields = cartSchema.safeParse({
      quantity,
    });

    if (!validatedFields.success) {
      return NextResponse.json(
        {
          message: "Failed to update item, please check your input",
          method: "PUT",
          data: null,
          error: validatedFields.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    const data = await nullIfError(prisma.cartItem.update)({
      where: {
        id: +item_id,
      },
      data: { quantity },
    });

    if (!data) {
      return NextResponse.json(
        {
          message: "Failed to update item, data not found",
          method: "PUT",
          data: null,
          error: "The item you are trying to update does not exist"
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Successfully update item",
      method: "PUT",
      data: null,
      error: null,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "An error has occurred, please try again later.",
        method: "PUT",
        data: null,
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    // TODO: Protect this endpoint

    const { item_id } = params;

    const data = await nullIfError(prisma.cartItem.delete)({
      where: {
        id: +item_id,
      },
    });

    if (!data) {
      return NextResponse.json(
        {
          message: "Failed to delete item, data not found",
          method: "DELETE",
          data,
          error: "The item you are trying to delete does not exist"
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Successfully deleted item from cart",
      method: "DELETE",
      data,
      error: null,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "An error has occurred, please try again later",
        method: "DELETE",
        data: null,
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}