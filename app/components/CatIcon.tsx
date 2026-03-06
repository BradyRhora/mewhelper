import Image from "next/image";
import {DefaultHoverable} from "@/app/lib/themes";
import { CatListInfo } from "../lib/db/prisma";

interface IconProps {
    cat: CatListInfo
}

export default function CatIcon({cat}: IconProps) {
    return <div className={`w-20 md:w-40 m-0.5 p-1 border border-black cursor-pointer rounded-md ${DefaultHoverable} flex flex-col`}>
        <Image loading="eager" src="/cat.png" alt={cat.name ?? ""} width={200} height={200}/>
        <span className="text-center">{cat.name}</span>
    </div>;
}