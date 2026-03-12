import { DefaultInput, DefaultSubMenu } from "../lib/themes";
import StatUpDown from "./StatUpDown";
import { ClipboardEvent, useContext, useRef } from "react";
import { ReloadCounterContext, SelectedCatContext } from "./MewHelper";
import { Cat, Gender, Sexuality } from "../generated/prisma/client";
import { FaTrashAlt } from "react-icons/fa";
import { GetTotalStats } from "../lib/helper";
import CatImage from "./CatImage";
import { UploadCatImage } from "../lib/image";

interface CatInfoProps {
    updateCatList: (selectCat?: boolean) => Promise<Cat[]>,
}

export default function CatInfo({updateCatList} : CatInfoProps) {
    const [selectedCat, setSelectedCat] = useContext(SelectedCatContext);
    const [reloadCounter, ] = useContext(ReloadCounterContext);

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const imageUploadRef = useRef<HTMLInputElement>(null);
    const imageDeleteRef = useRef<HTMLButtonElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

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
            userId: '0', // placeholder
            name: data['Name'] as string,
            retired: data['Retired'] == 'on',
            gender: data['Gender'] as Gender,
            sexuality: data['Sexuality'] === "NULL" ? null : data['Sexuality'] as Sexuality,
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

        setSelectedCat(newCatData);
        
        fetch('/api/cat', {
            method:'PUT',
            body: JSON.stringify(newCatData)
        }).then(() => updateCatList())
    }

    function deleteCat() {
        if (!selectedCat) return;

        fetch('/api/cat?id=' + selectedCat.id, {
            method:'DELETE'
        })

        updateCatList().then(() => setSelectedCat(undefined));
    }

    // just return cata data from delete and set to selected cat?
    async function deleteCatImage() {
        if (!selectedCat) return;
        
        await fetch("/api/cat/image", {
            method: "DELETE",
            body: JSON.stringify({catId: selectedCat.id})
        })

        await updateCatList();
    }

    function selectCatImage() {
        if (imageUploadRef.current) {
            const imgup = imageUploadRef.current;
            imgup.click();
        }
    }

    async function uploadCatImage() {
        const input = imageUploadRef.current;
        if (!input?.files?.length || !selectedCat) return;
        
        const file = input.files[0];

        await UploadCatImage(file, selectedCat.id);
    }

    function showImageDeleteButton(visible: boolean) {
        if (imageDeleteRef.current) {
            imageDeleteRef.current.hidden = !visible;
        }
    }

    async function pasteCallback(event : ClipboardEvent<HTMLFormElement>) {
        const data = event.clipboardData;
        if (data) {
            console.log(data.types);
            //if (data.types.includes('text/plain')) console.log(data.getData('text/plain'));
            if (data.types.includes('Files') && selectedCat) {
                event.stopPropagation();

                const pasteFile = data.files[0];
                await UploadCatImage(pasteFile, selectedCat.id);
            }
        }
    }

    return selectedCat ? (
    <form onPaste={pasteCallback} key={selectedCat.id} ref={formRef} onChange={formChanged} onInput={formChanged} className={`p-1 md:p-2 mb-2 rounded ${DefaultSubMenu} flex flex-col md:max-w-150 m-auto`}>    
            <div className="flex flex-row">
                <div className="flex flex-1 flex-col md:flex-row items-center md:items-start">
                    <input ref={imageUploadRef} type="file" accept="image/png, image/jpeg" className="hidden" onChange={uploadCatImage}></input>
                    {/*<input ref={newImageSrcRef} type="text" className="hidden"></input>*/}
                    <div key={`${selectedCat.id}-${reloadCounter}`} onClick={selectCatImage} onMouseEnter={() => showImageDeleteButton(true)} onMouseLeave={() => showImageDeleteButton(false)} className="relative md:mr-2">
                        <CatImage
                            cat={selectedCat} width={300} height={200}
                            alt={(selectedCat.name ? selectedCat.name : "cat") + "'s portrait"}
                            className={`md border border-black dark:border-white hover:bg-gray-400 cursor-pointer rounded-xl ${DefaultInput}`}
                        />
                        {imageRef.current?.src != '/images/cats/cat.png' &&
                            <button type="button" ref={imageDeleteRef} onClick={(e) => {
                                e.stopPropagation();
                                deleteCatImage();
                            }} className="absolute right-0 bottom-0 z-10 m-2 cursor-pointer hover:text-red-400" hidden={true}><FaTrashAlt/></button>
                        }
                    </div>
                    <div className="flex flex-col w-full mt-2">
                        <input name="Name" type="text" placeholder="Name" className={`text-2xl rounded border ${DefaultInput}`} defaultValue={selectedCat.name ?? ""} onChange={formChanged}/>
                        <label>
                            <input name="Retired" type="checkbox" className="w-4 h-4 mr-1 cursor-pointer" defaultChecked={selectedCat.retired ?? false} onChange={formChanged}/>
                            <span className="text-xl">Retired</span>
                        </label>
                        <label>
                            <select name="Gender" className="*:bg-gray-500 cursor-pointer *:cursor-pointer" defaultValue={selectedCat.gender ?? "MALE"} onChange={formChanged}>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="DITTO">Ditto</option>
                            </select>
                        </label>
                        <label>
                            <select name="Sexuality" className="*:bg-gray-500 cursor-pointer *:cursor-pointer" defaultValue={selectedCat.sexuality ?? "NULL"} onChange={formChanged}>
                                <option value="NULL">Unknown</option>
                                <option value="STRAIGHT">Straight</option>
                                <option value="GAY">Gay</option>
                            </select>
                        </label>
                    </div>
                    {/* Some input for parents...*/}
                </div>
                <FaTrashAlt onClick={deleteCat} size={24} className="m-3 text-red-400 hover:text-red-300 cursor-pointer"/>
            </div>
            <div className='mt-2 bg-gray-800'>
                <h2 className="text-2xl rounded-2xl">Stats - Total: {GetTotalStats(selectedCat)}</h2>
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
        </form>
        ) : <></>
}