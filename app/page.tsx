import MewHelper from "./components/MewHelper";
import { DefaultMenu } from "./lib/themes";

export default function Home() {
  return (
    <div className="">
      <main className={`p-2 m-1 rounded-lg ${DefaultMenu}`}>
        <h1>MewHelper</h1>
        <MewHelper/>
      </main>
    </div>
  );
}
