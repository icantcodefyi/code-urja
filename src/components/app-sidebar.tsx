import type * as React from "react"
import { Briefcase, Users, FileText, BarChart2, Settings, User, Video } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "~/components/ui/sidebar"

// This is HR Platform data
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/app",
      icon: <BarChart2 className="size-4" />,
      isActive: true,
    },
    {
      title: "Assessments",
      url: "/app/assessments/create",
      icon: <FileText className="size-4" />,
      items: [
        {
          title: "Create Assessment",
          url: "/app/assessments/create",
        },
        {
          title: "Active Assessments",
          url: "/app/assessments/active",
        },
        {
          title: "Assessment Templates",
          url: "/app/assessments/templates",
        },
      ],
    },
    {
      title: "Candidates",
      url: "/app/candidates",
      icon: <Users className="size-4" />,
      items: [
        {
          title: "All Candidates",
          url: "/app/candidates/all",
        },
        {
          title: "Shortlisted",
          url: "/app/candidates/shortlisted",
        },
        {
          title: "Rejected",
          url: "/app/candidates/rejected",
        },
      ],
    },
    {
      title: "Media Responses",
      url: "/app/media",
      icon: <Video className="size-4" />,
    },
    {
      title: "Jobs",
      url: "/app/jobs",
      icon: <Briefcase className="size-4" />,
    },
    {
      title: "Settings",
      url: "/app/settings",
      icon: <Settings className="size-4" />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="floating" side="right" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/app">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <User className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">HR Platform</span>
                  <span className="">Talent Assessment</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={item.isActive}>
                  <a href={item.url} className="font-medium flex items-center gap-2">
                    {item.icon}
                    {item.title}
                  </a>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
                    {item.items.map((subItem: { title: string; url: string; isActive?: boolean }) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild isActive={subItem.isActive}>
                          <a href={subItem.url}>{subItem.title}</a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

