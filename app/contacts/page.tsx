export default function Contacts() {
  return (
    <div className="flex flex-col gap-40">
      <div className="flex flex-row basis-full items-center gap-10">
        <div className="grow shrink basis-0 flex justify-center font-bold text-6xl ">
          Contacts
        </div>
        <div className="grow shrink basis-0 text-4xl font-light ">
          <div>Github</div>
          <div>LinkedIn</div>
          <div>Telegram</div>
        </div>
      </div>
    </div>
  );
}
