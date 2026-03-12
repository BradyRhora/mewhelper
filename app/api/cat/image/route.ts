import { CatExistsAndOwnedBy, EnsureUser, GetCat, prisma } from "@/app/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";
import { GetCatPic, GetFullCatPicPath, SetCatPic } from "@/app/lib/server/image";

import fs from "fs";

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
    const userId = await EnsureUser();
    const catId = req.nextUrl.searchParams.get('cat');

    if (!catId) return NextResponse.json({error:"Missing parameters"}, {status:400});
    const cat = await GetCat(catId);    
    if (!cat) return NextResponse.json({error:"Cat does not exist"}, {status:400});
    if (cat.userId != userId) return NextResponse.json({error:""}, {status:403});

    const file = await GetCatPic(cat.id);
    const headers = {
        "Content-Type": "image/png",
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0"
    }
    if (file) return new NextResponse(file, {headers: headers});
    else return NextResponse.redirect(new URL("/images/cats/cat.png", req.url), {headers: headers})
}

export async function POST(req: NextRequest) {
    const userId = await EnsureUser();
    const formData = await req.formData();

    const file = formData.get("image") as File;
    const catId = formData.get("catId") as string;

    if (file && catId && await CatExistsAndOwnedBy(catId, userId)) {
        const cat = await prisma.cat.findFirstOrThrow({where:{id:catId}});

        const picUrl = await SetCatPic(cat.id, file);

        if (picUrl) return NextResponse.json({src:picUrl}, {status:200});
        else return NextResponse.json({error:"Error processing image"}, {status:500});
    }
    else return NextResponse.json({error:""}, {status:400});
}

export async function DELETE(req: NextRequest) {
    const userId = await EnsureUser();
    const data = await req.json();
    const catId = data.catId;

    if (await CatExistsAndOwnedBy(catId, userId)) {

        if (await GetCatPic(catId)) {
            await fs.promises.rm(GetFullCatPicPath(catId));
            return new NextResponse(null,{status:200});
        }

        return new NextResponse(null, {status:204})
    }
    else return NextResponse.json({}, {status:400});
}