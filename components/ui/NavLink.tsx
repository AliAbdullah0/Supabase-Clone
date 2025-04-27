import { cn } from "@/lib/utils";
import Link from "next/link";

export const NavLink = ({ href, children, className }:{href:string,className:string,children:React.ReactNode}) => {
    return (
      <Link
        href={href}
        className={cn(
          'px-4 py-2 hover:text-[#57ad89] rounded text-neutral-100 font-medium text-sm transition-colors duration-200',
          className
        )}
      >
        {children}
      </Link>
    );
  };
  
