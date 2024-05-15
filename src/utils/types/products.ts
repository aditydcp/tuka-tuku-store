import { z } from "zod"
import { File } from "buffer"

const MAX_MB = 2
const MAX_UPLOAD_SIZE = 1024 * 1024 * MAX_MB
const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
]

export const productSchema = z.object({
    name: z
        .string()
        .min(10, {
            message: "Product name must be at least 10 characters long"
        })
        .max(50, {
            message: "Product name cannot be more than 50 characters long"
        }),
    description: z
        .string()
        .min(10, {
            message: "Product description must be at least 10 characters long"
        }),
    price: z
        .string({
            message: "Price is required"
        }),
    image: z
        .instanceof(File)
        .optional()
        .refine((file) => 
            !file || file.size <= MAX_UPLOAD_SIZE, 
            `Max image size is ${MAX_MB} MB`
        )
        .refine((file) => 
            !file || file.type === '' || ACCEPTED_IMAGE_TYPES.includes(file.type),
            "Only .jpg, .jpeg, .png, and .webp formats are supported"
        ),
    category_id: z
        .string({
            message: "Category is required"
        }),
})

export type ProductSchema = z.infer<typeof productSchema>