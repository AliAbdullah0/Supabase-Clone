import React from 'react'

const Badge = ({text,className}:{text:string,className?:string})=>{
    return(
      <span className={`bg-transparent text-white/60 hover:bg-[#171717] hover:transiton-colors flex items-center border border-white/10 rounded-2xl text-xs px-3 py-1 ${className}`}>{text}</span>
    )
  }
  

export default Badge