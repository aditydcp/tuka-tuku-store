import { NextResponse, NextRequest } from "next/server";
import { productSchema } from "@/utils/types/products";
import { prisma } from "@/utils/configs/db";

export async function GET(request: NextRequest) {
    try {
        const data = await prisma.product.findMany({
            include: {
                category: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                created_at: "desc",
            },
            cacheStrategy: { ttl: 60 },
        });

        const totalCount = await prisma.product.count();
        const totalPages = Math.ceil(totalCount / 10);

        return NextResponse.json({
            message: "Successfully get products",
            metadata: {
                totalCount,
                totalPages,
            },
            data,
        });
    } catch (error) {
        console.log(error);

        return NextResponse.json(
            {
                message: "Get products failed, please try again later",
                reason: (error as Error).message,
            },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        // TODO: Protect this endpoint

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
                message: "Failed to create product, please check your input",
                method: "POST",
                data: null,
                error: validatedFields.error.flatten().fieldErrors
            },
                { status: 400 }
            )
        }

        // TODO: Upload image to cloudinary
        let imageUrl = null

        const data = await prisma.product.create({
            data: {
                name,
                description,
                price,
                image: imageUrl,
                category_id: +category_id!,
            },
        });

        return NextResponse.json({
            message: "Product successfully created",
            method: "POST",
            data,
            error: null,
        }, { status: 201 })
    }
    catch (error) {
        console.error(error)

        return NextResponse.json({
            message: "An error has occurred please try again later",
            method: "POST",
            data: null,
            error: (error as Error).message,
        }, { status: 500 })
    }
}