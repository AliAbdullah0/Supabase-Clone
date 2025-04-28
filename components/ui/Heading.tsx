import Link from "next/link";

export const Heading = ({ text, className, to }: { text: string; className?: string; to?: string }) => {
    return (
      <Link href={to ?? ''}>
        <h2 className={`font-medium cursor-pointer text-sm ${className} mb-2`}>{text}</h2>
      </Link>
    )
  }