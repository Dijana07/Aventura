import { Avatar } from "@/components/tailgrids/core/avatar";
import { Button, buttonStyles } from "../../components/tailgrids/core/button";
import { List } from "@/components/tailgrids/core/list";
import type { UserDto } from "@/models/auth/UserDto";
import { useState } from "react";
import EditUserModal from "./EditUserModal";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, 
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../tailgrids/core/alert-dialog";
import { authService } from "@/services/authService";
import { Pencil, Trash2 } from "lucide-react";

interface Props {
  users: UserDto[];
  onUserUpdated: (user: UserDto) => void;
  onUserDeleted: (userId: string) => void;
}

export default function UsersDashboard({ users, onUserUpdated, onUserDeleted }: Props) {
  const [editUserModalOpen, setEditUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDto>();

  const handleDelete = async (userId: string) => {
    const result = await authService.deleteUser(userId);
    
    if (result.success)
    {
      onUserDeleted(userId);
      alert("User deleted successfully!");
    }
    else
    {
      alert("Error while deleting user: " + result.message);
    }
  };

  return (
    <>
      {editUserModalOpen && selectedUser !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background-100 rounded-lg p-6 w-full max-w-md">
            <button
              onClick={() => setEditUserModalOpen(false)}
              className="absolute top-2 right-2 text-white text-4xl mr-2"
            >
                &times;
            </button>
            <EditUserModal user={selectedUser!} onUserUpdated={onUserUpdated}/>
          </div>
        </div>
      )} 
      <List className="w-window">
        {users.map((user) => (
          <li
            key={user.id}
            className="flex w-full items-center justify-between gap-4 py-3"
          >
            <div className="flex items-center gap-3">
              <Avatar
                src={user.photoUrl}
                alt={user.firstName + " " + user.lastName}
                fallback={user.firstName.charAt(0) + user.lastName.charAt(0)}
              />

              <div className="flex flex-col">
                <span className="font-medium text-title-50">
                  {user.firstName + " " + user.lastName}
                </span>
                <span className="text-sm text-text-200">
                  {user.email}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button                
                size="sm"
                onClick={() => { setEditUserModalOpen(true); setSelectedUser(user);}}
                className="rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700"
              >
                <Pencil size={18} />
              </Button>

              <AlertDialog>
                <AlertDialogTrigger className="rounded-lg bg-red-600! p-2 text-white hover:bg-red-700!">
                  <Trash2 size={18} />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete account</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this account? This action is
                      permanent and all related data will be lost.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className={buttonStyles({ variant: "danger", size: "sm" })}
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </li>
        ))}
      </List>
    </>
  );
}