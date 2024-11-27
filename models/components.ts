interface FuncComponent {
  children: React.ReactNode | React.ReactNode[] | string | null;
}

interface MainLayoutProps extends FuncComponent {
  header: FuncComponent["children"];
}

interface MainNavigationLinkProps {
  title: string;
  href: string;
  description?: string;
}
