"use client";

import { forwardRef, type SVGProps } from "react";
import { mergeProps } from "react-aria";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/tailgrids/core/sidebar";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/tailgrids/core/collapsible";
import { ChevronRight, CalendarTime } from "@tailgrids/icons";

import { navigation } from "./navigation";
import type { UserRole } from "@/enums/UserRole";

interface Props {
  role: UserRole;
}

export function AppSidebar({
  role
}: Props) {
  const items = navigation.filter(item =>
    item.roles.includes(role)
  );

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="p-4 flex-row items-center">
        <span className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary-500 text-white">
          <CalendarTime className="size-4" />
        </span>

        <span className="font-medium">
          Aventura
        </span>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupLabel>
            Navigation
          </SidebarGroupLabel>

          <SidebarMenu>
            {items.map(item => (
              <SidebarMenuItem key={item.title}>
                {item.items ? (
                  <Collapsible
                    defaultExpanded
                    className="group/collapsible w-full bg-transparent border-0 p-0 "
                  >
                    <SidebarMenuButton
                      slot="trigger"
                      className="justify-between"
                    >
                      <item.icon />

                      <span>{item.title}</span>

                      <ChevronRight className="ml-auto transition-transform group-data-expanded/collapsible:rotate-90" />
                    </SidebarMenuButton>

                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map(subItem => (
                          <SidebarMenuSubItem
                            key={subItem.title}
                          >
                            <SidebarMenuSubButton
                              href={subItem.url}
                            >
                              {subItem.title}
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <SidebarMenuButton
                    tooltip={item.title}
                    render={({ ref, ...props }) => (
                      <SidebarMenuItemLink
                        ref={
                          ref as React.Ref<HTMLAnchorElement>
                        }
                        title={item.title}
                        url={item.url!}
                        icon={item.icon}
                        {...props}
                      />
                    )}
                  />
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

const SidebarMenuItemLink = forwardRef<
  HTMLAnchorElement,
  {
    title: string;
    url: string;
    icon: React.FunctionComponent<
      SVGProps<SVGSVGElement>
    >;
    [key: string]: any;
  }
>(({ title, url, icon: Icon, ...props }, ref) => {
  return (
    <a
      {...mergeProps(props, {
        href: url,
        className: "flex items-center gap-2",
      })}
      ref={ref}
    >
      <Icon />
      <span>{title}</span>
    </a>
  );
});

SidebarMenuItemLink.displayName = "SidebarMenuItemLink";