export const AboutPage = () => {
  return (
    <div className="flex flex-col gap-40">
      <div className="flex flex-row basis-full items-center gap-10">
        <div className="grow shrink basis-0 flex justify-center font-bold text-6xl">
          About
        </div>
        <div className="grow shrink basis-0 text-4xl font-light">
          <div>Frontend Developer</div>
          <div className="text-xl mt-4 text-gray-300">
            Passionate about creating beautiful and functional web applications
          </div>
        </div>
      </div>
    </div>
  );
};
