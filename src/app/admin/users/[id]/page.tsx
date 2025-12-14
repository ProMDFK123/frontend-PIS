import { UserDetailView } from "@/views/app/admin/users/[id]";

interface PageProps {
    params: {
        id: string;
    };
}

export default async function UserDetailPage({ params }: PageProps) {
    const { id } = await params;
    return <UserDetailView id={id} />;
}