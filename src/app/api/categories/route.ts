import { CategorySchema, categorySchema } from "@/utils/types/categories";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({message: "success", method: "GET", data: []})
}

export async function POST(request: NextRequest) {
    // TODO: Protect this method
    
    try {
        const body = (await request.json()) as CategorySchema
        const { name } = body

        const validatedFields = categorySchema.safeParse({
            name,
        })

        if (!validatedFields.success) {
            return NextResponse.json({
                message: "Failed to create category. Please check your input.",
                method: "POST",
                data: null,
                error: validatedFields.error.flatten().fieldErrors
            },
            { status: 400 }
        )}

        return NextResponse.json({
            message: "Category successfully created.",
            method: "POST",
            data: [body],
        }, { status: 201 })
    }
    catch (error) {
        console.error(error)

        return NextResponse.json({
            message: "An error has occurred. Please try again later.", 
            method: "POST",
            data: null,
            error: (error as Error).message,
        }, { status: 500 })
    }
}