import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({message: "success", method: "GET", data: []})
}

export async function POST() {
    return NextResponse.json({message: "success", method: "POST", data: []})
}