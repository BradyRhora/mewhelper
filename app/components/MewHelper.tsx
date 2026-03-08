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

    const updateCatList = useCallback(async () => {
        fetch('/api/catlist')
        .then((res) => res.json())
        .then((data) => {
            setCatList(data);
        });
    }, []);

    useEffect(() => {
        updateCatList();
    }, [updateCatList]);

    return <>
        <SelectedCatContext.Provider value={[selectedCat, setSelectedCat]}>
            <CatList catList={catList} updateCatList={updateCatList}/>
            <CatInfo updateCatList={updateCatList}/>
            <CatHighest catList={catList}/>
            <CatTable catList={catList}/>
        </SelectedCatContext.Provider>
    </>;
}