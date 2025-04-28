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

type ColumnForm = {
  name: string;
  type: string;
  isNullable: boolean;
  isPrimary: boolean;
  isForeignKey: boolean;
  foreignTableId?: string;
  foreignColumnId?: string;
};

type TableForm = {
  name: string;
  columns: ColumnForm[];
};

type User = Awaited<ReturnType<typeof getCurrentUser>>
type Project = Awaited<ReturnType<typeof getProject>>
type PageProps = { params: Promise<{ slug: string }> };
type DatabasePageProps = { params: Promise<{ databaseId: string }> };
