import CatIcon from "./CatIcon";

export default function CatList() {
    // Scrollable List of CatIcons with option to add new. When one is selected, set SelectedCat and update CatInfo

    const dummyCats = ["meowther", "fud", "jenkins", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"];

    return <div className="flex flex-row overflow-x-scroll pb-1">
        {dummyCats.map((cat) => {
            return <div key={cat}>
                <CatIcon cat={cat}/>
            </div>
        })}
    </div>;
}