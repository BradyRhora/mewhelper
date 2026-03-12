import { CatExists, EnsureUser, GetCat, UpdateCat } from "@/app/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    const userId = await EnsureUser();
    const data = await req.json();
    const catId = data.id;
    
    if (await CatExists(catId)) {
        const cat = await GetCat(catId);
        if (cat?.userId == userId) {
            cat.retired = !cat.retired;
            await UpdateCat(cat);
            return NextResponse.json({},{status:200})
        }
        else return NextResponse.json({error:""},{status:403});
    }
    else return NextResponse.json({error:"Cat not found"}, {status:401});
}