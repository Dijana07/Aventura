import AppLayout from "@/layout/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import EditUserModal from "@/components/auth/EditUserModal";

export default function MyProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <AppLayout>
        <div className="py-10 text-center text-white">
          Loading...
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-5xl max-h-[90dvh] md:max-h-[95dvh] overflow-y-auto">
        <h1 className="mb-2 text-3xl font-bold text-white">
          My Profile
        </h1>

        <p className="mb-8 text-white/70">
          Manage your account information
        </p>

        <EditUserModal user={user}/>
      </div>
    </AppLayout>
  );
}