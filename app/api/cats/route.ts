import { CatExists, DeleteCat, GetCat, NewCat, UpdateCat } from "@/app/lib/db/prisma";
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

export async function POST(req: NextRequest) {
        const data = await req.json().catch(() => null); // Gracefully handle JSON parsing errors

        if (!data) {
            const cat = NewCat();
            return NextResponse.json(cat);
        }

        if (await CatExists(data.id)) { // is this necessary or can we just check the update for errors
            await UpdateCat(data);
            return NextResponse.json({}, {status:200});
        }
        else return NextResponse.json({error: `Cat with id: '${data.id}' not found.`}, {status: 400});    
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