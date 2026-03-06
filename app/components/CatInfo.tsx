import Image from "next/image";
import { DefaultInput, DefaultSubMenu } from "../lib/themes";
import StatUpDown from "./StatUpDown";
import { useContext, useEffect, useRef } from "react";
import { SelectedCatContext } from "./MewHelper";
import { Cat, Gender } from "../generated/prisma/client";
import { FaTrashAlt } from "react-icons/fa";

interface CatInfoProps {
    updateCatList: () => void,
}

export default function CatInfo({updateCatList} : CatInfoProps) {
    const [selectedCat, setSelectedCat] = useContext(SelectedCatContext);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const formRef = useRef<HTMLFormElement>(null);

    function formChanged() {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        const id = selectedCat?.id;
        debounceRef.current = setTimeout(() => {
            pushCatUpdates(id);
        }, 200);
    }

    function pushCatUpdates(id: string | undefined) {
        if (!formRef.current || !id) return;

        const formData = new FormData(formRef.current);
        const data = Object.fromEntries(formData.entries());
    
        const newCatData : Cat = {
            id: id,
            name: data['Name'] as string,
            retired: data['Retired'] == 'on',
            gender: data['Gender'] as Gender,
            sexuality: "STRAIGHT", // *
            str: Number(data['str']),
            dex: Number(data['dex']),
            con: Number(data['con']),
            int: Number(data['int']),
            spd: Number(data['spd']),
            cha: Number(data['cha']),
            luk: Number(data['luk']),
            parent1Id: null, // *
            parent2Id: null  // *
        }
        
        fetch('/api/cats', {
            method:'POST',
            body: JSON.stringify(newCatData)
        })
    }

    function deleteCat() {
        if (!selectedCat) return;

        fetch('/api/cats?id=' + selectedCat.id, {
            method:'DELETE'
        })

        updateCatList();
        setSelectedCat(undefined);
    }

    function sumStats() {
        if (!selectedCat) return;

        return selectedCat.str + selectedCat.dex + selectedCat.con + selectedCat.int + selectedCat.spd + selectedCat.cha + selectedCat.luk;
    }

    useEffect(() => {
        console.log('Selected cat updated!');
        console.log(selectedCat);
    }, [selectedCat])

    return <form key={selectedCat?.id} ref={formRef} onChange={formChanged} onInput={formChanged} className={`p-1 md:p-2 rounded ${DefaultSubMenu} flex flex-col md:max-w-150 m-auto`}>
            {selectedCat ? <>
            <div className="flex flex-row">
                <div className="flex flex-1 flex-col md:flex-row items-center md:items-start">
                    <Image 
                        loading="eager"
                        src="/cat.png" width={200} height={200}
                        alt={(selectedCat.name ? selectedCat.name : "cat") + "'s portrait"} 
                        className={`max-w-40 md md:mr-2 border border-black dark:border-white rounded-2xl ${DefaultInput}`}
                    />
                    <div className="flex flex-col w-full mt-2">
                        <input name="Name" type="text" placeholder="Name" className={`text-2xl rounded border ${DefaultInput}`} defaultValue={selectedCat.name ?? ""} onChange={formChanged}/>
                        <label>
                            <input name="Retired" type="checkbox" className="w-4 h-4 mr-1" defaultChecked={selectedCat.retired ?? false} onChange={formChanged}/>
                            <span className="text-xl">Retired</span>
                        </label>
                        <label>
                            <select name="Gender" className="*:bg-gray-500" defaultValue={selectedCat.gender ?? "MALE"} onChange={formChanged}>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="DITTO">Ditto</option>
                            </select>
                        </label>
                    </div>
                    {/* Some input for parents...*/}
                </div>
                <FaTrashAlt onClick={deleteCat} size={24} className="m-3 text-red-400 hover:text-red-300 cursor-pointer"/>
            </div>
            <div className='mt-2 bg-gray-800'>
                <h2 className="text-2xl rounded-2xl">Stats - Total: {sumStats()}</h2>
                <div className="flex flex-row">
                    <StatUpDown name="str" startValue={selectedCat.str} updateForm={formChanged}/>
                    <StatUpDown name="dex" startValue={selectedCat.dex} updateForm={formChanged}/>
                    <StatUpDown name="con" startValue={selectedCat.con} updateForm={formChanged}/>
                    <StatUpDown name="int" startValue={selectedCat.int} updateForm={formChanged}/>
                    <StatUpDown name="spd" startValue={selectedCat.spd} updateForm={formChanged}/>
                    <StatUpDown name="cha" startValue={selectedCat.cha} updateForm={formChanged}/>
                    <StatUpDown name="luk" startValue={selectedCat.luk} updateForm={formChanged}/>
                </div>
            </div>
            </> : <></>}
        </form>
}