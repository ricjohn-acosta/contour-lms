"use client";
import Link from "next/link";
import Image from "next/image";
import { MessageSquare } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth/auth.service";
import { useRouter } from "next/navigation";

const LOGO_URL =
  "https://www.contoureducation.com.au/wp-content/uploads/2023/02/Contour-Education-Full-Logo-Single-Line-2048x271-2.png";

export const CustomSidebar = () => {
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
      <SidebarFooter>
        <SidebarMenuButton asChild tooltip="Logout">
          <Button
            variant="ghost"
            className="text-red-500"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
};
