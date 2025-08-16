import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

type Props = { size?: number; className?: string };

export default function Plane({ size = 48, className = "" }: Props) {
    return (
        <PaperAirplaneIcon
            className={`text-sky-700 ${className}`}
            style={{ width: size, height: size }}
        />
    );
}