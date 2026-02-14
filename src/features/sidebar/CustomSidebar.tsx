"use client";
import Link from "next/link";
import Image from "next/image";
import { LogOut, MessageSquare } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { authService } from "@/services/auth/auth.service";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

const LOGO_URL =
  "https://www.contoureducation.com.au/wp-content/uploads/2023/02/Contour-Education-Full-Logo-Single-Line-2048x271-2.png";

interface CustomSidebarProps {
  user: User;
}

export const CustomSidebar = ({ user }: CustomSidebarProps) => {
  const router = useRouter();

  const handleLogout = async () => {
    await authService.logout();
    router.replace("/");
  };

  return (
    <Sidebar>
      <SidebarHeader className="flex h-14 shrink-0 flex-row items-center gap-2 border-b px-4">
        <Link
          href="/dashboard"
          className="flex items-center focus:outline-none"
        >
          <Image
            src={LOGO_URL}
            alt="Contour Education"
            width={120}
            height={44}
            className="h-11 w-auto object-contain"
            unoptimized
          />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-gray-500">
            Home
          </SidebarGroupLabel>

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Consultations">
                <Link href="/dashboard">
                  <MessageSquare />
                  <span>Consultations</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-sidebar-border">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 truncate px-2">
            {user.email}
          </SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Logout"
                onClick={handleLogout}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="size-4 shrink-0" />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
};
