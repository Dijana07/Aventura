import { useState, useId } from "react";
import { Eye, EyeDisabled } from "@tailgrids/icons";
import { Input } from "../../components/tailgrids/core/input";
import { Label } from "../../components/tailgrids/core/label";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, } from "../../components/tailgrids/core/input-group";
import { authService } from "@/services/authService";
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterPage() {
  const firstNameId = useId();
  const lastNameId = useId();
  const emailId = useId();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    //console.log(formData);
    setIsLoading(true);

    try {
    const result = await authService.register({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password
    });

    if (result.success) 
    {
      alert("Registration successful!");
      await login(result.data!);
      window.location.href = "/home";
    }
    else 
    {
      alert("Registration failed. " + result.message);
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

  return (
    <div
        className="min-h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/background.jpg')",
        }}
    >
      <div className="flex min-h-screen items-center justify-center bg-black/35 px-4">
        <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white">
                Create Account
            </h1>

            <p className="mt-2 text-sm text-white/70">
                Start planning your next adventure
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-2">
                <Label
                htmlFor={firstNameId}
                className="text-white"
                >
                First name
                </Label>

                <Input
                id={firstNameId}
                name="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
                className="bg-transparent"
                />
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor={lastNameId}
                className="text-white"
                >
                Last name
              </Label>

              <Input
                id={lastNameId}
                name="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
                className="bg-transparent"
              />
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor={emailId}
                className="text-white"
              >
                Email
              </Label>

              <Input
                id={emailId}
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                className="bg-transparent"
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-white">
                Password
              </Label>

              <InputGroup>
                <InputGroupInput
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="bg-transparent"
                />

                <InputGroupAddon align="inline-end">
                    <InputGroupButton
                    type="button"
                    className="w-fit px-0 text-gray-500"
                    onClick={() =>
                        setShowPassword(prev => !prev)
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
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-green-700 px-4 py-3 font-medium text-white transition hover:bg-green-800"
            >
              {isLoading ? "Creating account..." : "Create account"}
            </button>

            <p className="text-center text-sm text-white/70">
              Already have an account?
              <span className="ml-1 cursor-pointer text-green-300 hover:text-green-200">
                <a href="/">
                  Sign In
                </a>
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
);
}