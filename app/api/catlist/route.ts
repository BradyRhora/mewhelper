import { EnsureUser, GetCatList } from "@/app/lib/db/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const userId = await EnsureUser();        
    if (!userId) return NextResponse.json({error:"Missing parameters"}, {status:400});
    const cats = await GetCatList(userId);
    return NextResponse.json(cats);
}