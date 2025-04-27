// import { cookies } from "next/headers";
// import { NextRequest, NextResponse } from "next/server";
// import { verifyToken } from "./actions/user.actions";


// export const middleware = async (req: NextRequest) => {
//     const cookieStore = await cookies();
//     const token = cookieStore.get('session_token')?.value;

//     if (!token) {
//         return NextResponse.redirect(new URL('/sign-in', req.url));
//     }
//     try {
//         const response = await verifyToken();

//         if (response.success && response.status === 200) {
//             return NextResponse.next();
//         } else {
//             return NextResponse.redirect(new URL('/sign-in', req.url));
//         }
//     } catch (error) {
//         console.error("Middleware token verification failed:", error);
//         return NextResponse.redirect(new URL('/sign-in', req.url));
//     }
// };
