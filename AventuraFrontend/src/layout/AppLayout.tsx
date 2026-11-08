"use client";

import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/tailgrids/core/sidebar";
import { MenuHamburger1, Exit, User2 } from "@tailgrids/icons";
import { AppSidebar } from "./AppSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/tailgrids/core/button";
import { Spinner } from "@/core/spinner";
import { useNavigate } from "react-router-dom";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen">
        <Button disabled>
          <Spinner size="sm" />
            Loading...
        </Button>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-[100dvh] w-full overflow-hidden">
        {user && (
          <AppSidebar role={user?.userRole}/>
        )}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 items-center gap-2 border-b border-base-100 px-4 bg-background-100 text-white">
            {user && (  
              <SidebarTrigger className="p-0 border-0">
                <MenuHamburger1 size={24} />
              </SidebarTrigger>
            )}
            <span className="font-medium text-lg">Aventura</span>

            {user ? (
              <button
                className="ml-auto text-sm text-white/70"
                onClick={() => { logout(); navigate("/") }}
              >
                Logout
                <Exit size={18} className="inline-block mx-2" /> 
              </button>
            ) : (
              <button
                className="ml-auto text-sm text-white/70"
                onClick={() => {navigate("/")}}
              >
                Sign In
                <User2 size={18} className="inline-block mx-2" /> 
              </button>
            )}
          </header>

          <main className="flex-1 overflow-auto p-6 bg-background-100">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}