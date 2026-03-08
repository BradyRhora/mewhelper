import Image from "next/image";
import { Cat } from "../generated/prisma/client";

interface IconProps {
    cat: Cat | null,
    className: string | null
}

export default function CatIcon({cat, className}: IconProps) {
    return cat ? <div className={`${className} flex flex-col select-none`}>
        <Image loading="eager" src="/cat.png" alt={cat.name ?? ""} width={200} height={200}/>
        <span className="text-center">{cat.name}</span>
    </div> : <></>
}