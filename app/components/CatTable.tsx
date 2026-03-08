import { useContext, useState } from "react";
import { Cat } from "../generated/prisma/client"
import { GetTotalStats } from "../lib/helper";
import { FaSortDown, FaSortUp } from "react-icons/fa";
import { SelectedCatContext } from "./MewHelper";

interface TableProps {
    catList: Cat[]
}

export default function CatTable({catList} : TableProps) {
    const stats : (keyof Cat)[] = ["str", "dex", "con", "int", "spd", "cha", "luk"];
    const [sortStat, setSortStat] = useState<keyof Cat | "total">("total");
    const [sortDirection, setSortDirection] = useState(true); // False -> Asc., True -> Desc.
    const [selectedCat, setSelectedCat] = useContext(SelectedCatContext)

    const sortedCatList = [...catList].sort((a,b) => {
        const dirMult = (sortDirection ? -1 : 1);
        if (sortStat == "total") {
            return (GetTotalStats(a) - GetTotalStats(b)) * dirMult;
        } else if (a[sortStat] && b[sortStat]) {
            const statA = a[sortStat];
            const statB = b[sortStat];

            if (typeof(statA) === "number" && typeof(statB) === "number") {
                const statCompare = (statA - statB) * dirMult;
                return statCompare == 0 ? (GetTotalStats(a) - GetTotalStats(b)) * dirMult : statCompare;
            }
            else if (typeof(statA) === "string" && typeof(statB) === "string") {
                return statA.localeCompare(statB) * dirMult;
            } 
        }     
        
        return 0;           
    });

    function changeSort(stat: keyof Cat | "total") {
        if (sortStat == stat) setSortDirection(!sortDirection);
        else setSortStat(stat);
    }

    const sortArrow = sortDirection ? <FaSortDown/> : <FaSortUp/>

    return <table className="mx-auto mb-4 *:border *:border-white *:w-1 *:overflow-hidden">
        <thead>
            <tr className="md:*:px-2 *:cursor-pointer *:hover:bg-gray-500 *:border *:border-white">
                <th onClick={() => changeSort("name")} className="cursor-pointer">
                    <span className="flex items-center justify-center">Cat{sortStat == "name" && sortArrow}</span>                
                </th>
                <th onClick={() => changeSort("retired")} className="cursor-pointer">
                    <span className="flex items-center justify-center">Retired{sortStat == "retired" && sortArrow}</span>
                </th>
                <th onClick={() => changeSort("gender")} className="cursor-pointer">
                    <span className="flex items-center justify-center">Gender{sortStat == "gender" && sortArrow}</span>
                </th>
                <th onClick={() => changeSort("sexuality")} className="cursor-pointer">
                    <span className="flex items-center justify-center">Sexuality{sortStat == "sexuality" && sortArrow}</span>
                </th>
                <th onClick={() => changeSort("total")} className="cursor-pointer">
                    <span className="flex items-center justify-center">Total{sortStat == "total" && sortArrow}</span>
                </th>
                {stats.map((stat) => {
                    return <th onClick={() => changeSort(stat)} className="cursor-pointer" key={"header" + stat}>
                        <span className="flex items-center justify-center">{stat.toUpperCase()}{sortStat == stat && sortArrow}</span>
                    </th>}
                )}
            </tr>
        </thead>
        <tbody>
            {
            sortedCatList.map((cat) => {
                const statColors : Partial<Record<keyof Cat, string>> = {};

                function lerpColor(color1: number[], color2: number[], t: number) {
                    // Clamp t between 0 and 1
                    t = Math.max(0, Math.min(1, t));

                    const r = Math.round(color1[0] + t * (color2[0] - color1[0]));
                    const g = Math.round(color1[1] + t * (color2[1] - color1[1]));
                    const b = Math.round(color1[2] + t * (color2[2] - color1[2]));

                    return `rgb(${r},${g},${b})`;
                }

                const lowStatColor = [235, 52, 52];
                const highStatColor = [42, 219, 68];

                stats.forEach((stat : keyof Cat) => {
                    const statValue = cat[stat];
                    if (typeof statValue === "number" && statValue != null)
                        statColors[stat] = lerpColor(lowStatColor, highStatColor, (statValue - 3)/4);
                });

                return (
                    <tr onClick={() => {setSelectedCat(cat)}} key={cat.id} className={`md:*:p-1 text-center *:border cursor-pointer ${selectedCat?.id == cat.id ? "*:bg-blue-400" : ""}`}>
                        <td>{cat.name}</td>
                        <td>{cat.retired ? "✔" : "❌"}</td>
                        <td>{cat.gender?.charAt(0)}</td>
                        <td>{cat.sexuality?.charAt(0)}</td>
                        <td>{GetTotalStats(cat)}</td>
                        {
                        stats.map((stat) => {
                            const textColor = (cat[stat] as number) > 6 ? "text-black" : "text-white";
                            return <td key={cat.id + stat} className={textColor} style={{backgroundColor: statColors[stat]}}>{cat[stat]}</td>
                        })
                        }
                    </tr>
                )
            })
            }    
        </tbody> 
    </table>
}