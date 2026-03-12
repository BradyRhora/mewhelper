import sharp from "sharp";
import fs from "fs";

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

export async function fileExists(path: string) {
    try {
        await fs.promises.access(path);
        return true;
    } catch {
        return false;
    }
}

export async function GetCatPic(catId: string) {
    const path = GenerateCatPicPath(catId);
    
    if (await fileExists('public/' + path)) return path;
    else return DEFAULT_CAT_PIC;
}

export function GenerateCatPicPath(catId: string) {
    const path = `/images/cats/${catId}_${Date.now()}.png`;
    return path;
}