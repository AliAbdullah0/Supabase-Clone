import { cn } from "@/lib/utils";
import Link from "next/link";

export const PrimaryButton = ({text,to}:{text:string,to:string}) => {
    return (
      <Link
        href={to}
        className={cn(
          'bg-main text-white text-sm px-3 py-1 rounded-md hover:border border-green-600 hover:transition-all duration-200 font-medium'
        )}
      >
        {text}
      </Link>
    );
  };