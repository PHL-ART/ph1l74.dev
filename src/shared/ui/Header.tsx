import { Navigation } from "@/src/widgets/navigation";
import { FC } from "react";

export const Header: FC = () => {
    return (
        <header className="flex justify-center items-center py-4 text-sm text-gray-400">
            <Navigation />
        </header>
    );
};
