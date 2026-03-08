import { useContext } from "react";
import { SelectedCatContext } from "./MewHelper";
import { Cat } from "../generated/prisma/client";
import CatIcon from "./CatIcon";
import { DefaultHoverable } from "../lib/themes";
import { GetTotalStats } from "../lib/helper";

interface CatHelperProps {
    catList: Cat[],
}

export default function CatHighest({catList} : CatHelperProps) {
    const [selectedCat, setSelectedCat] = useContext(SelectedCatContext);

    function getHighest(stat : keyof Cat) {
        if (catList.length == 0) return null;

        const sorted = [...catList].sort((a,b) => {
            const aN = Number(a[stat]);
            const bN = Number(b[stat]);
            const statCompare = bN - aN;
            return statCompare == 0 ? (GetTotalStats(b) - GetTotalStats(a)) : statCompare;
        });

        const highest = catList.filter((c) => c.id == sorted[0].id);
        if (highest.length == 0) return null;
        else return highest[0];
    }

    const stats = ["str", "dex", "con", "int", "spd", "cha", "luk"];

    return <div className="flex flex-wrap items-center justify-around mb-4">
        {stats.map((s) => {
            const highest = getHighest(s as keyof Cat);

            return (<div key={s} className="mx-1" onClick={() => highest && setSelectedCat(highest)}>
                <h3>Highest {s.toUpperCase()}</h3>
                <CatIcon cat={highest} className={`w-20 m-0.5 p-1 border rounded-md ${DefaultHoverable} ${highest?.id == selectedCat?.id ? "border-blue-500" : ""}`}/>
            </div>)
        })}
    </div>
}
