import { Navigation } from "@/components/main/Navigation";

export default function Home() {
  return (
    <div className="flex flex-col gap-40">
      <div className="flex flex-row basis-full items-center gap-10">
        <div className="grow shrink basis-0 flex justify-center font-bold text-6xl ">
          Filat Astakhov
        </div>
        <div className="grow shrink basis-0 text-4xl font-light ">
          <div>React Typescript</div>
          <div>Frontend</div>
          <div>Developer</div>
        </div>
      </div>
        <Navigation />
    </div>
  );
}
