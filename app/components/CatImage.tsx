import Image from "next/image"
import { Cat } from "../generated/prisma/client";

interface CatImageProps {
    cat: Cat,
    width: number,
    height: number,
    alt?: string,
    className?: string,
}

export default function CatImage({cat, width, height, alt, className} : CatImageProps) {
    return <Image 
            loading="eager"
            unoptimized={true}
            width={width}
            height={height}
            src={`/api/cat/image?cat=${cat.id}`}
            alt={alt ?? "Image of a cat"}
            className={`${className}`}
            style={{width:width, height:height}}
        />
}