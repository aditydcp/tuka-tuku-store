import { NextRequest, NextResponse } from "next/server";

import {
  TransactionSchema,
  transactionSchema,
} from "@/utils/types/transactions";
import { prisma } from "@/utils/configs/db";

export const POST = async (request: NextRequest) => {
  let transactionId = "";

  try {
    const { amount, cart_id } = (await request.json()) as TransactionSchema;

    const validatedFields = transactionSchema.safeParse({
      amount,
      cart_id,
    });

    if (!validatedFields.success) {
      return NextResponse.json(
        {
          message: "Transaction failed, please check your input",
          method: "POST",
          data: null,
          error: validatedFields.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // TODO: Create transaction

    return NextResponse.json({
      message: "Transaction successful",
      method: "POST",
      data: null,
      error: null,
    });
  } catch (error) {
    console.log(error);

    const deleteOrder = prisma.order.delete({
      where: { transaction_id: transactionId },
    });
    const deleteTransaction = prisma.transaction.delete({
      where: { id: transactionId },
    });

    await prisma.$transaction([deleteOrder, deleteTransaction]);

    return NextResponse.json(
      {
        message: "An error has occurred, please try again later",
        method: "POST",
        data: null,
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
};