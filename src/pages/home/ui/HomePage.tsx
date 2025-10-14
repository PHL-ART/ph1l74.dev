import { MainPageNavigation } from '@/src/widgets/navigation/ui/MainPageNavigation';
import { Title } from '@/src/widgets/title/ui/Title';

export const HomePage = () => {
  return (
    <div className="flex flex-col gap-40 h-full">
      <div className="flex flex-row basis-full items-center gap-10">
        <div className="grow shrink basis-0 flex justify-center font-bold text-6xl">
          Filat Astakhov
        </div>
        <div className="grow shrink basis-0 text-4xl font-light">
          <Title />
          <div>Developer</div>
        </div>
      </div>
      <MainPageNavigation />
    </div>
  );
};
