import { useState } from "react";
import { Eye, EyeDisabled } from "@tailgrids/icons";
import { Input } from "@/components/tailgrids/core/input";
import { Label } from "@/components/tailgrids/core/label";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, } from "@/components/tailgrids/core/input-group";
import type { UpdateUserRequest } from "@/models/auth/UpdateUserRequest";
import { authService } from "@/services/authService";
import type { UserDto } from "@/models/auth/UserDto";
import { useAuth } from "@/contexts/AuthContext";
import { validateUpdateUser } from "@/validators/authValidator";

interface Props {
    user: UserDto;
    onUserUpdated?: (user: UserDto) => void;
}

export default function EditUserModal({ user, onUserUpdated }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState<File | undefined>();
  const [imagePreview, setImagePreview] = useState(user?.photoUrl ?? "");
  const { user: currentUser, login, token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
        const request: UpdateUserRequest = {
        userId: user.id,
        firstName: user.firstName === firstName ? undefined : firstName,
        lastName: user.lastName === lastName ? undefined : lastName,
        password: password || undefined,
        image,
        };

        //console.log(request);

        const error = validateUpdateUser(request);
        if (error)
        {
            setIsLoading(false);
            alert(error);
            return;
        }

        const result = await authService.updateUser(request);
        
        if (result.success && result.data) {
            if (onUserUpdated)
                onUserUpdated(result.data);
            alert("Profile updated successfully");
            if (currentUser?.id === user.id)
                login({user: result.data, token: token!});
        } else {
        alert("Failed to update profile. " + result.message);
        }
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="py-10 text-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl bg-background-100">
    <div className="mb-8 flex flex-col items-center ">
        <img
        src={ imagePreview }
        alt="Profile"
        className="h-32 w-32 rounded-full border border-white/20 object-cover"
        />

        <label className="mt-4 cursor-pointer rounded-xl bg-green-700 px-4 py-2 text-white transition hover:bg-green-800">
        Upload new photo

        <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
        />
        </label>
    </div>

    <div className="grid gap-5 md:grid-cols-2">
        <div className="grid gap-2">
        <Label className="text-white">
            First name
        </Label>

        <Input
            value={firstName}
            className="bg-transparent"
            onChange={(e) =>
            setFirstName(e.target.value)
            }
        />
        </div>

        <div className="grid gap-2">
        <Label className="text-white">
            Last name
        </Label>

        <Input
            value={lastName}
            onChange={(e) =>
            setLastName(e.target.value)
            }
            className="bg-transparent"
        />
        </div>
    </div>

    <div className="mt-5 grid gap-2">
        <Label className="text-white">
        Email
        </Label>

        <Input
        value={user.email}
        disabled
        className="bg-transparent"
        />
    </div>

    <div className="mt-5 grid gap-2">
        <Label className="text-white">
        New password
        </Label>

        <InputGroup>
        <InputGroupInput
            type={showPassword ? "text" : "password"}
            value={password}
            placeholder="Leave empty if you don't want to change"
            className="bg-transparent"
            onChange={(e) =>
            setPassword(e.target.value)
            }
        />

        <InputGroupAddon align="inline-end">
            <InputGroupButton
            type="button"
            className="w-fit px-0 text-gray-500"
            onClick={() =>
                setShowPassword((prev) => !prev)
            }
            >
            {showPassword ? (
                <EyeDisabled />
            ) : (
                <Eye />
            )}
            </InputGroupButton>
        </InputGroupAddon>
        </InputGroup>
    </div>

    <button
        type="button"
        onClick={handleSave}
        className="mt-8 rounded-xl bg-green-700 px-6 py-3 font-medium text-white transition hover:bg-green-800"
    >
        {isLoading ? "Saving changes..." : "Save changes"}
    </button>
    </div>
  );
}