import { prisma } from "@/utils/configs/db";
import { fileUploader, nullIfError } from "@/utils/functions";
import { productSchema } from "@/utils/types/products";
import { NextRequest, NextResponse } from "next/server";

interface Params {
    params: { product_id: string }
}

interface DataToUpdate {
    name: string;
    description: string;
    price: string;
    category_id: number;
    image?: string;
}

export async function GET(request: NextRequest, context: Params) {
    try {
        const { product_id } = context.params

        const data = await prisma.product.findFirst({
            where: {
                id: product_id,
            },
            include: {
                category: {
                    select: { name: true },
                },
            },
            cacheStrategy: { ttl: 60 },
        });

        if (!data) {
            return NextResponse.json({
                message: "Failed to get product, data not found",
                method: "GET",
                data,
                error: "The data you are trying to retrieve does not exist"
            }, { status: 404 })
        }

        return NextResponse.json({
            message: "Successfully get product",
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

export async function PUT(request: NextRequest, context: Params) {
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

        const { product_id } = context.params

        let dataToUpdate: DataToUpdate = {
            name,
            description,
            price,
            category_id: +category_id!,
        };

        if (image) {
            const uploadFile = await fileUploader(image, {
                folder: "tuka-tuku-product",
            })
            dataToUpdate.image = uploadFile.data
        }

        const data = await nullIfError(prisma.product.update)({
            where: {
                id: product_id,
            },
            data: dataToUpdate,
        });

        if (!data) {
            return NextResponse.json({
                message: "Failed to update product, data not found",
                method: "PUT",
                data,
                error: "The data you are trying to update does not exist"
            }, { status: 404 })
        }

        return NextResponse.json({
            message: "Successfully update product",
            method: "PUT",
            data,
            error: null,
        })
    } catch (error) {
        console.error(error)

        return NextResponse.json({
            message: "An error has occurred, please try again later",
            method: "PUT",
            data: null,
            error: (error as Error).message,
        }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, context: Params) {
    try {
        // TODO: Protect this endpoint

        const { product_id } = context.params

        const data = await nullIfError(prisma.category.delete)({
            where: {
                id: Number(product_id),
            },
        })

        if (!data) {
            return NextResponse.json({
                message: "Failed to delete product, data not found",
                method: "DELETE",
                data,
                error: "The data you are trying to delete does not exist"
            }, { status: 404 })
        }

        return NextResponse.json({
            message: "Successfully delete product",
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
}