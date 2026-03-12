import { CatExistsAndOwnedBy, EnsureUser, GetCat, prisma } from "@/app/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { fileExists, GetCatPic, GenerateCatPicPath } from "@/app/lib/server/image";
import { ResizeImage } from "@/app/lib/server/image";

export async function GET(req: NextRequest) {
    const userId = await EnsureUser();
    const catId = req.nextUrl.searchParams.get('cat');

    if (!catId) return NextResponse.json({error:"Missing parameters"}, {status:400});
    const cat = await GetCat(catId);    
    if (!cat) return NextResponse.json({error:"Cat does not exist"}, {status:400});
    if (cat.userId != userId) return NextResponse.json({error:""}, {status:403});

    const path = await GetCatPic(cat.id);
    return NextResponse.json({src:path}, {status:200});
}

export async function POST(req: NextRequest) {
    const userId = await EnsureUser();
    const formData = await req.formData();

    const file = formData.get("image") as File;
    const catId = formData.get("catId") as string;

    if (file && catId && await CatExistsAndOwnedBy(catId, userId)) {
        const cat = await prisma.cat.findFirstOrThrow({where:{id:catId}});

        if (cat?.imagePath && await fileExists('public'+cat.imagePath)) {
            await fs.promises.rm('public'+cat.imagePath);
        }

        // TODO: Should move this logic into lib/server/image
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const sizedBuffer = await ResizeImage(buffer, 200);
        if (sizedBuffer) {
            const picPath = GenerateCatPicPath(catId);
            await fs.promises.writeFile('public'+picPath, sizedBuffer);
            await prisma.cat.update({data:{imagePath:picPath}, where:{id:catId}});
            return NextResponse.json({src:picPath}, {status:200});
        } else {
            return NextResponse.json({error:"Image processing failed"}, {status:500});
        }
        
    }
    else return NextResponse.json({error:""}, {status:400});
}

export async function DELETE(req: NextRequest) {
    const userId = await EnsureUser();
    const data = await req.json();
    const catId = data.catId;

    if (await CatExistsAndOwnedBy(catId, userId)) {
        const cat = await prisma.cat.findFirstOrThrow({where:{id:catId}});
        
        const picPath = cat.imagePath;

        if (await fileExists('public'+picPath)) {
            await fs.promises.rm('public'+picPath);
            const updatedCat = await prisma.cat.update({where:{id:catId}, data:{imagePath:null}});
            return NextResponse.json({cat:updatedCat},{status:200});
        }

        return new NextResponse(null, {status:204})
    }
    else return NextResponse.json({}, {status:400});
}