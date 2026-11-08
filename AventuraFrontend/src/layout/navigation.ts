import { Calendar, Gear1, Home, User2 } from "@tailgrids/icons";
import type { UserRole } from "@/enums/UserRole";

export interface NavigationItem {
  title: string;
  url?: string;
  icon: React.ElementType;
  roles: UserRole[];
  items?: {
    title: string;
    url: string;
  }[];
}

export const navigation: NavigationItem[] = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
    roles: ["ADMIN", "USER"],
  },
  {
    title: "Management",
    icon: Gear1,
    roles: ["ADMIN"],
    items: [
      {
        title: "Users",
        url: "/management/users",
      },
      {
        title: "Trips",
        url: "/management/trips",
      },
    ],
  },
  {
    title: "My Trips",
    url: "/trips",
    icon: Calendar,
    roles: ["ADMIN", "USER"],
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User2,
    roles: ["ADMIN", "USER"],
  },
];