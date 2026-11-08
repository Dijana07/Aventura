import UsersDashboard from "@/components/auth/UsersDashboard";
import AppLayout from "@/layout/AppLayout";
import type { UserDto } from "@/models/auth/UserDto";
import { authService } from "@/services/authService";
import { useEffect, useState } from "react";

export default function UsersManagementPage() {
    const [users, setUsers] = useState<UserDto[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const result = await authService.getAllUsers();
            if (result.success && result.data) {
                setUsers(result.data);
            }
        };

        fetchUsers();
    }, []);

    return (
        <AppLayout>         
            <h2 className="text-2xl font-bold text-white mb-3">
              All registered users in the system
            </h2>
            <UsersDashboard 
                users={users} 
                onUserUpdated={(updatedUser) => {
                    setUsers(prev =>
                    prev.map(u =>
                        u.id === updatedUser.id ? updatedUser : u
                    )
                    );
                }}
                onUserDeleted={(userId) => {
                  setUsers(prev =>
                    prev.filter(u => u.id !== userId)
                  );
                }}
            />
        </AppLayout>
    );
}