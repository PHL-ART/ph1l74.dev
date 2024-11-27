import { FC } from "react";

export const ContentLayout: FC<FuncComponent> = ({ children }) => {
  const className = "container mx-auto flex flex-col align-middle max-w-[75%]";
  return <div className={className}>{children}</div>;
};
