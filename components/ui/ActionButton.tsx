import { cn } from '@/lib/utils';
import React from 'react'

interface ActionButtonProps {
    text:string;
    onClick:()=>void;
    className?:string;
}

const ActionButton = ({text,onClick,className}:ActionButtonProps) => {
  return (
    <button
        onClick={onClick}
        className={cn(
          `bg-main text-white text-sm px-3 py-1 rounded-md hover:border border-green-600 hover:transition-all duration-200 font-medium ${className}`
        )}
      >
        {text}
      </button>
  )
}

export default ActionButton