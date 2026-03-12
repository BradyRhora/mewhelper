import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

import { Cat } from "@/app/generated/prisma/client";
import { cookies } from "next/headers";

const connectionString = process.env.DATABASE_URL as string;
const adapter = new PrismaBetterSqlite3({url: connectionString});

export const prisma = new PrismaClient({adapter});

// Users

export async function CreateUser() {
    return await prisma.user.create({});
}

export async function EnsureUser() {
    let userId = (await cookies()).get("user")?.value;

    if (!userId || (await prisma.user.count({where:{id:userId}})) == 0) {
        const user = await CreateUser();
        (await cookies()).set({name:'user', value:user.id, httpOnly: true, sameSite: 'lax'})
        userId = user.id;
    }

    return userId;
}

// Cats

export async function GetAllCats() {
    return await prisma.cat.findMany();
}

export async function GetCatList(userId: string) {
    const cats = await prisma.cat.findMany({where:{userId:userId}})
    return cats;
}

export async function CatExists(id: string) {
    return await prisma.cat.count({where: {id: id}}) > 0;
}

export async function CatExistsAndOwnedBy(catId: string, userId: string) {
    return await prisma.cat.count({where:{id:catId,userId:userId}}) > 0;
}

export async function GetCat(id: string) {
    return await prisma.cat.findFirst({where: {id: id}});
}

export async function GetCatOwner(id: string) {
    return (await GetCat(id))?.userId;
}

export async function CreateCat(userId: string) {
    return await prisma.cat.create({data: {userId: userId}});
}

export async function UpdateCat(catData: Cat) {
    await prisma.cat.update({where: {id: catData.id}, data: catData})
}

export async function DeleteCat(catId: string) {
    await prisma.cat.delete({where: {id: catId}});
}