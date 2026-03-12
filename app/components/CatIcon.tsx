import { Cat } from "../generated/prisma/client";
import CatImage from "./CatImage";

interface IconProps {
    cat: Cat | null,
    className: string | null,
    width?: number,
    height?: number
}

export default function CatIcon({cat, className, width, height}: IconProps) {
    return cat ? <div className={`${className} flex flex-col select-none`}>
        <CatImage cat={cat} alt={cat.name ?? ""} width={width ?? 150} height={height ?? 150}/>
        <span className="text-center">{cat.name}</span>
    </div> : <></>
}