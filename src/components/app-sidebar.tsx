"use client"
import type * as React from "react"
import { Briefcase, Users, FileText, BarChart2, Settings, User, Video, ChevronDown } from "lucide-react"

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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible"
import { useState } from "react"

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
    },
    {
      title: "Media Responses",
      url: "/app/media",
      icon: <Video className="size-4" />,
    },
    {
      title: "Jobs",
      url: "#",
      icon: <Briefcase className="size-4" />,
    },
    {
      title: "Settings",
      url: "#",
      icon: <Settings className="size-4" />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // State to track which menu items are open
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    "Assessments": true // Default open
  })

  // Toggle function for collapsible items
  const toggleItem = (title: string) => {
    setOpenItems(prev => ({
      ...prev,
      [title]: !prev[title]
    }))
  }

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
                {item.items?.length ? (
                  <Collapsible
                    open={openItems[item.title]}
                    onOpenChange={() => toggleItem(item.title)}
                  >
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="justify-between" isActive={item.isActive}>
                        <div className="flex items-center gap-2">
                          {item.icon}
                          {item.title}
                        </div>
                        <ChevronDown 
                          className={`size-4 transition-transform duration-200 ${
                            openItems[item.title] ? "rotate-180" : ""
                          }`} 
                        />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
                        {item.items.map((subItem: { title: string; url: string; isActive?: boolean }) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild isActive={subItem.isActive}>
                              <a href={subItem.url}>{subItem.title}</a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <SidebarMenuButton asChild isActive={item.isActive}>
                    <a href={item.url} className="font-medium flex items-center gap-2">
                      {item.icon}
                      {item.title}
                    </a>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

