import sharp from "sharp";
import fs from "fs";
import path from "path";

export const DEFAULT_CAT_PIC = '/images/cats/cat.png';

export async function ResizeImage(fileBuffer: Buffer, width: number, height?:number) : Promise<Buffer<ArrayBufferLike>|void> {
    const buffer = await sharp(fileBuffer)
        .resize(width, height)
        .toBuffer()
        .catch((err) => {
            console.error(err);
        });

    return buffer;
}

export async function FileExists(filePath: string) {
    try {
        await fs.promises.access(filePath);
        return true;
    } catch {
        return false;
    }
}

export async function SetCatPic(catId: string, image: File) {
    const picPath = GetFullCatPicPath(catId);

    // Delete existing cat picture
    if (await FileExists(picPath)) {
        await fs.promises.rm(picPath);
    }

    // Resize image to 200x200
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const sizedBuffer = await ResizeImage(buffer, 200);

    // If resize successful, save file
    if (sizedBuffer) {
        await fs.promises.writeFile(picPath, sizedBuffer);
        return picPath;
    } 
    
    return null;
}

export async function GetCatPic(catId: string) {
    const filePath = GetFullCatPicPath(catId);
    
    if (await FileExists(filePath)) {
        return await fs.promises.readFile(filePath);
    }
    else {
        return await fs.promises.readFile(path.join(process.cwd(), 'public', DEFAULT_CAT_PIC))
    }
}

export function GetRelativeCatPicPath(catId: string) {
    const path = `/data/cat_images/${catId}.png`;
    return path;
}

export function GetFullCatPicPath(catId: string) {
    return path.join(process.cwd(), GetRelativeCatPicPath(catId))
}