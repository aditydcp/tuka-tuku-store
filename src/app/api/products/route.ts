import { NextResponse, NextRequest } from "next/server";
import { productSchema } from "@/utils/types/products";

export async function GET(request: NextRequest) {
    // TODO: Modularize query params handler
    const searchParams = request.nextUrl.searchParams

    console.log(searchParams)
    return NextResponse.json({message: "success", method: "GET", data: []})
}

export async function POST(request: NextRequest) {
    // TODO: Protect this method

    try {
        const formData = await request.formData()
        
        const name = formData.get("name") as string
        const description = formData.get("description") as string
        const price = formData.get("price") as string
        const image = formData.get("image") as File
        const category_id = formData.get("category_id") as string

        const validatedFields = productSchema.safeParse({
            name,
            description,
            price,
            image: image ?? undefined,
            category_id
        })

        if (!validatedFields.success) {
            return NextResponse.json({
                message: "Failed to create product. Please check your input.",
                method: "POST",
                data: null,
                error: validatedFields.error.flatten().fieldErrors
            },
            { status: 400 }
        )}

        // TODO: Upload image to cloudinary

        // TODO: Create new record in database

        return NextResponse.json({
            message: "Product successfully created.",
            method: "POST",
            data: [],
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