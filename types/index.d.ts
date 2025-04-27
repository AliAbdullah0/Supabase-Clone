import { getProject } from "@/actions/project.actions";
import { getCurrentUser } from "@/actions/user.actions";

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
}
   
interface AuthFormProps {
  mode: 'signin' | 'signup';
}

interface AuthResponse {
  success: boolean;
  status: number;
}

type User = Awaited<ReturnType<typeof getCurrentUser>>
type Project = Awaited<ReturnType<typeof getProject>>