import { prisma } from "@/utils/configs/db";
import { isNotLoggedIn, nullIfError } from "@/utils/functions";
import { CategorySchema, categorySchema } from "@/utils/types/categories";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { NextAuthRequest } from "@/utils/types/api";

interface Params {
  params: { category_id: string }
}

export async function GET(request: NextRequest, context: Params) {
  try {
    const { category_id } = context.params

    const data = await prisma.category.findUnique({
      where: {
        id: Number(category_id),
      },
      cacheStrategy: { ttl: 60 },
    })

    if (!data) {
      return NextResponse.json({
        message: "Failed to get category, data not found",
        method: "GET",
        data,
        error: "The data you are trying to retrieve does not exist"
      }, { status: 404 })
    }

    return NextResponse.json({
      message: "Successfully get category",
      method: "GET",
      data,
      error: null,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json({
      message: "An error has occurred, please try again later.",
      method: "GET",
      data: null,
      error: (error as Error).message,
    }, { status: 500 })
  }
}

export async function PUT(request: NextAuthRequest, context: Params) {
  return auth(async () => {
    try {
      if (isNotLoggedIn(request.auth, true)) {
        return NextResponse.json({
          message: "Not authenticated or unauthorized access",
          method: "POST",
          data: null,
          error: "You are not authenticated or unauthorized to access this resource"
        }, { status: 401 })
      }

      const body = (await request.json()) as CategorySchema
      const { name } = body

      const validatedFields = categorySchema.safeParse({
        name,
      })

      if (!validatedFields.success) {
        return NextResponse.json({
          message: "Failed to create category, please check your input",
          method: "PUT",
          data: null,
          error: validatedFields.error.flatten().fieldErrors
        },
          { status: 400 }
        )
      }

      const { category_id } = context.params

      const data = await nullIfError(prisma.category.update)({
        where: {
          id: Number(category_id),
        },
        data: {
          name
        },
      })

      if (!data) {
        return NextResponse.json({
          message: "Failed to update category, data not found",
          method: "PUT",
          data,
          error: "The data you are trying to update does not exist"
        }, { status: 404 })
      }

      return NextResponse.json({
        message: "Successfully update category",
        method: "PUT",
        data,
        error: null,
      })
    } catch (error) {
      console.error(error)

      return NextResponse.json({
        message: "An error has occurred, please try again later.",
        method: "PUT",
        data: null,
        error: (error as Error).message,
      }, { status: 500 })
    }
  })(request, context)
}

export async function DELETE(request: NextAuthRequest, context: Params) {
  return auth(async () => {
    try {
      if (isNotLoggedIn(request.auth, true)) {
        return NextResponse.json({
          message: "Not authenticated or unauthorized access",
          method: "POST",
          data: null,
          error: "You are not authenticated or unauthorized to access this resource"
        }, { status: 401 })
      }
  
      const { category_id } = context.params
  
      const data = await nullIfError(prisma.category.delete)({
        where: {
          id: Number(category_id),
        },
      })
  
      if (!data) {
        return NextResponse.json({
          message: "Failed to delete category, data not found",
          method: "DELETE",
          data,
          error: "The data you are trying to delete does not exist"
        }, { status: 404 })
      }
  
      return NextResponse.json({
        message: "Successfully delete category",
        method: "DELETE",
        data,
        error: null,
      })
    } catch (error) {
      console.error(error)
  
      return NextResponse.json({
        message: "An error has occurred, please try again later.",
        method: "DELETE",
        data: null,
        error: (error as Error).message,
      }, { status: 500 })
    }
  })(request, context) 
}