
import { HomePageTitle } from '@/src/widgets/home-page-title/ui/HomePageTitle';
import { HomePageNavigation } from '@/src/widgets/home-page-navigation';

export const HomePage = () => {
  return (
    <div className="flex flex-col gap-40 h-full">
      <HomePageTitle />
      <HomePageNavigation />
    </div>
  );
};
