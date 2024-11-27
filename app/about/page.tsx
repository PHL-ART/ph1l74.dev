export default function About() {
  return (
    <div className="flex flex-col gap-40">
      <div className="flex flex-row basis-full items-center gap-10">
        <div className="grow shrink basis-0 flex justify-center font-bold text-6xl ">
          About
        </div>
        <div className="grow shrink basis-0 text-4xl font-light ">
          <div>Education</div>
          <div>Career</div>
          <div>Skills</div>
        </div>
      </div>
    </div>
  );
}
