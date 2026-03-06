"use client"
import { createContext, useEffect, useState } from "react";
import CatInfo from "./CatInfo";
import CatList from "./CatList";
import { Cat } from "../generated/prisma/client";
import { CatListInfo } from "../lib/db/prisma";

export const SelectedCatContext = createContext<[Cat | undefined, React.Dispatch<React.SetStateAction<Cat | undefined>>]>([undefined, () => {}]);

export default function MewHelper() {
    const [selectedCat, setSelectedCat] = useState<Cat|undefined>(undefined);
    const [catList, setCatList] = useState<CatListInfo[]>([]);

    function updateCatList() {
        fetch('/api/catlist')
        .then((res) => res.json())
        .then((data) => {
            setCatList(data);
        });
    }

    useEffect(() => {
        updateCatList();
    }, []);

    return <>
        <SelectedCatContext.Provider value={[selectedCat, setSelectedCat]}>
            <CatList catList={catList} updateCatList={updateCatList}/>
            <div className="mt-1"></div>
            <CatInfo updateCatList={updateCatList}/>
        </SelectedCatContext.Provider>
    </>;
}