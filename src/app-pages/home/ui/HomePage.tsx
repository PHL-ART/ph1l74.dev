import { HomePageTitle } from '@/src/widgets/home-page-title/ui/HomePageTitle';
import { HomePageNavigation } from '@/src/widgets/home-page-navigation';

export const HomePage = () => {
  return (
    <main className="ds-hero">
      <div className="ds-hero-inner">
        <HomePageTitle />
      </div>
      <HomePageNavigation />
    </main>
  );
};
