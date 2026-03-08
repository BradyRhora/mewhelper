import { CatExists, DeleteCat, GetCat, CreateCat, UpdateCat, EnsureUser } from "@/app/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const id = req.nextUrl.searchParams.get('id');
    if (id) {
        if (await CatExists(id)) { // is this necessary or can we just check the update for errors
            return NextResponse.json(await GetCat(id), {status:200});
        }
        else return NextResponse.json({error: `Cat with id: '${id}' not found.`}, {status: 400});
    } else {
        return NextResponse.json({error: `No id given.`}, {status: 400});
    }
}

export async function PUT(req: NextRequest) {
    const userId = await EnsureUser();
    const data = await req.json();

    if (data && await CatExists(data.id)) {
        data.userId = userId;
        await UpdateCat(data);
        return NextResponse.json({}, {status:200});
    }
    else return NextResponse.json({error: `Cat with id: '${data.id}' not found.`}, {status: 400});    
}

export async function POST() {
    const userId = await EnsureUser();        
    
    if (userId) return NextResponse.json(CreateCat(userId));
    else return NextResponse.json({error:"Server error"},{status:500});
}

export async function DELETE(req: NextRequest) {
    const id = req.nextUrl.searchParams.get('id');
    if (id) {
        if (await CatExists(id)) {
            await DeleteCat(id);
            return NextResponse.json({}, {status: 200});
        } else return NextResponse.json({error: `Cat with id: '${id}' not found.`}, {status: 400});
    }
}