
export const generateSlug = (name:string)=>{
    const slug = name.toLowerCase().replace(/\s+/g, '-').concat("-supabase-clone");    
    return slug
}

export const generateApiKey = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}