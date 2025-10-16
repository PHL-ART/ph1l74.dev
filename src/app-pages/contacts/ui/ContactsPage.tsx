export const ContactsPage = () => {
  return (
    <div className="flex flex-col gap-40">
      <div className="flex flex-row basis-full items-center gap-10">
        <div className="grow shrink basis-0 flex justify-center font-bold text-6xl">
          Contacts
        </div>
        <div className="grow shrink basis-0 text-4xl font-light">
          <div>Get in touch</div>
          <div className="text-xl mt-4 text-gray-300">
            Email: filat@example.com
          </div>
        </div>
      </div>
    </div>
  );
};
