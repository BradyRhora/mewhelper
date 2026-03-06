import { GetCatList } from "@/app/lib/db/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const cats = await GetCatList();
    return NextResponse.json(cats);
}