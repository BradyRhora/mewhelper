import { Cat } from "../generated/prisma/client";

export function GetTotalStats(cat : Cat) {
    return cat.str + cat.dex + cat.con + cat.int + cat.spd + cat.cha + cat.luk;
}