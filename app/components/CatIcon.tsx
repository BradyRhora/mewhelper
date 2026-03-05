import Image from "next/image";
import {DefaultHoverable} from "@/app/lib/themes";

interface IconProps {
    cat: string
}

export default function CatIcon({cat}: IconProps) {
    return <div className={`min-w-12 m-0.5 p-1 border border-black cursor-pointer rounded-md ${DefaultHoverable}`}>
        <Image src="/cat.png" alt={cat} width={200} height={200}/>
    </div>;
}