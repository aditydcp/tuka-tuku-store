import { prisma } from "@/utils/configs/db";
import { CategorySchema, categorySchema } from "@/utils/types/categories";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const data = await prisma.category.findMany({
            cacheStrategy: { ttl: 60 },
        })

        return NextResponse.json({
            message: "Successfully get categories",
            method: "GET",
            data,
            error: null,
        })
    } catch (error) {
        console.error(error)

        return NextResponse.json({
            message: "An error has occurred, please try again later",
            method: "GET",
            data: null,
            error: (error as Error).message,
        }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        // TODO: Protect this endpoint

        const body = (await request.json()) as CategorySchema
        const { name } = body

        const validatedFields = categorySchema.safeParse({
            name,
        })

        if (!validatedFields.success) {
            return NextResponse.json({
                message: "Failed to create category, please check your input",
                method: "POST",
                data: null,
                error: validatedFields.error.flatten().fieldErrors
            },
                { status: 400 }
            )
        }

        const data = await prisma.category.create({
            data: {
                name
            }
        })

        return NextResponse.json({
            message: "Category successfully created",
            method: "POST",
            data,
            error: null,
        }, { status: 201 })
    }
    catch (error) {
        console.error(error)

        return NextResponse.json({
            message: "An error has occurred, please try again later",
            method: "POST",
            data: null,
            error: (error as Error).message,
        }, { status: 500 })
    }
}