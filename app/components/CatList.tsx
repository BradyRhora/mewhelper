"use client"
import { DefaultButton } from "../lib/themes";
import CatIcon from "./CatIcon";
import { useContext, useEffect, useCallback } from "react";
import { SelectedCatContext } from "./MewHelper";
import { Cat } from "../generated/prisma/client";
import { CatListInfo } from "../lib/db/prisma";

interface CatListProps {
    catList: CatListInfo[],
    updateCatList: () => void,
}

export default function CatList({catList, updateCatList} : CatListProps) {
    const [selectedCat, setSelectedCat] = useContext(SelectedCatContext);

    const selectCat = useCallback((index: number) => {
        if (catList.length <= index) return;

        fetch('/api/cats?id=' + catList[index].id)
        .then((res) => res.json())
        .then((data : Cat) => {
            setSelectedCat(data);
        })
    }, [catList, setSelectedCat]);

    function createNewCat() {
        fetch('/api/cats', {
            method: 'POST'
        })

        updateCatList();
    }

    return <>
    <div className="flex flex-row overflow-x-auto pb-1">
        {catList.map((cat, idx) => {
            return <div key={cat.id} onClick={() => selectCat(idx)} className={selectedCat && selectedCat.id == cat.id ? "border-white border" : "border-transparent border"}>
                <CatIcon cat={cat}/>
            </div>
        })}
    </div>
    <button className={`w-30 ${DefaultButton}`} onClick={createNewCat}>New Cat..</button>
    </>;
}