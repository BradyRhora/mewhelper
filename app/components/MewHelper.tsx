"use client"
import { createContext, useEffect, useState, useCallback } from "react";
import CatInfo from "./CatInfo";
import CatList from "./CatList";
import { Cat } from "../generated/prisma/client";
import CatHighest from "./CatHighest";
import CatTable from "./CatTable";

export const SelectedCatContext = createContext<[Cat | undefined, React.Dispatch<React.SetStateAction<Cat | undefined>>]>([undefined, () => {}]);

export default function MewHelper() {
    const [selectedCat, setSelectedCat] = useState<Cat|undefined>(undefined);
    const [catList, setCatList] = useState<Cat[]>([]);

    // const getCatById = useCallback((id: string) => {
    //     const cat = catList.filter((c) => c.id == id);
    //     if (cat.length > 0) return cat[0];
    // }, [catList]);

    const updateCatList = useCallback(async (newCat = false) => {
        const res = await fetch('/api/catlist');
        const data = await res.json() as Cat[];
        setCatList(data);
        if (newCat) {
            setSelectedCat(data[data.length-1]);
        }

        return data;
    }, []);

    useEffect(() => {
        async function loadCats() {
            const res = await fetch('/api/catlist');
            const data = await res.json();
            setCatList(data);
        }

        loadCats();
    }, []);

    return <div>
        <SelectedCatContext.Provider value={[selectedCat, setSelectedCat]}>
            <CatList catList={catList} updateCatList={updateCatList}/>
            <CatInfo updateCatList={updateCatList}/>
            <CatHighest catList={catList}/>
            <CatTable catList={catList} updateCatList={updateCatList}/>
        </SelectedCatContext.Provider>
    </div>;
}