import { useEffect, useState, WheelEvent } from "react";
import { DefaultTriangleButton } from "../lib/themes";

interface StatUpDownProps {
    name: string
    startValue: number
    updateForm: () => void;
}

export default function StatUpDown({name, startValue, updateForm}: StatUpDownProps) {
    const [value, setValue] = useState(startValue);

    useEffect(() => {
        setValue(startValue);
    }, [startValue])

    function update(newVal : number) {        
        const MAX_VAL = 7;
        const MIN_VAL = 3;

        newVal = Math.max(Math.min(newVal, MAX_VAL), MIN_VAL);

        setValue(newVal);
        updateForm();
    }

    function handleWheel(event: WheelEvent<HTMLInputElement>) {
        const scrollDir = Math.sign(-event.deltaY);
        update(value + scrollDir);
    }

    return <div onWheel={handleWheel} className="p-1 flex flex-col items-center text-center w-full text-lg rounded mx-0.5 md:mx-2">
        <button type="button" onClick={() => update(value + 1)} className={`border-b-15 border-b-gray-500 hover:border-b-gray-400 ${DefaultTriangleButton}`}></button>
        <input name={name} type="number" className="text-xl md:text-3xl h-10 w-6 md:w-12 text-center focus:outline-none focus:ring-0 focus:border-none" value={value} readOnly={true}/>
        <button type="button" onClick={() => update(value - 1)} className={`border-t-15 border-t-gray-500 hover:border-t-gray-400 ${DefaultTriangleButton}`}></button>
        <span className="text-sm">{name.toUpperCase()}</span>
    </div>
}