"use client"
import { DefaultButton, DefaultHoverable } from "../lib/themes";
import CatIcon from "./CatIcon";
import { useContext, useCallback } from "react";
import { ReloadCounterContext, SelectedCatContext } from "./MewHelper";
import { Cat } from "../generated/prisma/client";

interface CatListProps {
    catList: Cat[],
    updateCatList: (newCat?: boolean) => Promise<Cat[]>,
}

export default function CatList({catList, updateCatList} : CatListProps) {
    const [reloadCounter, ] = useContext(ReloadCounterContext);
    const [selectedCat, setSelectedCat] = useContext(SelectedCatContext);

    const selectCat = useCallback((index: number) => {
        if (catList.length <= index) return;

        fetch('/api/cat?id=' + catList[index].id)
        .then((res) => res.json())
        .then((data : Cat) => {
            setSelectedCat(data);
        })
    }, [catList, setSelectedCat]);

    async function createNewCat() {
        await fetch('/api/cat', { method: 'POST' });
        await updateCatList(true);
    }

    return <>
    <div className="flex flex-row overflow-x-auto pb-1 mb-2">
        {catList.map((cat, idx) => {
            return <div key={`${cat.id}-${reloadCounter}`} onClick={() => selectCat(idx)} className={`cursor-pointer`}>
                <CatIcon cat={cat} className={`w-20 md:w-40 m-0.5 p-1 border rounded-md ${DefaultHoverable} ${(selectedCat && selectedCat.id == cat.id ? "border-blue-500" : "")}`}/>
            </div>
        })}
    </div>
    <button className={`w-30 ${DefaultButton} mb-2 select-none`} onClick={createNewCat}>New Cat..</button>
    </>;
}