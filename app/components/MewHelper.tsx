"use client"
import { createContext, useEffect, useState, useCallback } from "react";
import CatInfo from "./CatInfo";
import CatList from "./CatList";
import { Cat } from "../generated/prisma/client";
import CatHighest from "./CatHighest";
import CatTable from "./CatTable";

export const SelectedCatContext = createContext<[Cat | undefined, React.Dispatch<React.SetStateAction<Cat | undefined>>]>([undefined, () => {}]);
export const ReloadCounterContext = createContext<[number, React.Dispatch<React.SetStateAction<number>>]>([0, () => {}]);

export default function MewHelper() {
    const [selectedCat, setSelectedCat] = useState<Cat|undefined>(undefined);
    const [reloadCounter, setReloadCounter] = useState<number>(0);
    const [catList, setCatList] = useState<Cat[]>([]);

    const updateCatList = useCallback(async (newCat = false) => {
        const res = await fetch('/api/catlist');
        const data = await res.json() as Cat[];
        setCatList(data);
        if (newCat) {
            setSelectedCat(data[data.length-1]);
        }

        setReloadCounter(reloadCounter+1);

        return data;
    }, [reloadCounter]);

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
        <ReloadCounterContext.Provider value={[reloadCounter, setReloadCounter]}>
            <CatList catList={catList} updateCatList={updateCatList}/>
            <CatInfo updateCatList={updateCatList}/>
            <CatHighest catList={catList}/>
            <CatTable catList={catList} updateCatList={updateCatList}/>
        </ReloadCounterContext.Provider>
        </SelectedCatContext.Provider>
        
    </div>;
}