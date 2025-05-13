interface FuncComponent {
  children: React.ReactNode | React.ReactNode[] | string | null;
}

interface MainLayoutProps extends FuncComponent {
  header: FuncComponent["children"];
}

interface ProjectsLayoutProps extends FuncComponent {
}

interface MainNavigationLinkProps {
  title: React.ReactNode | React.ReactNode[] | string | null;
  href: string;
  description?: string;
  isActive?: boolean;
}
