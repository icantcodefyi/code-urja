"use client"
import type * as React from "react"
import { Briefcase, Users, FileText, BarChart2, Settings, User, Video, ChevronDown } from "lucide-react"
import { usePathname } from "next/navigation"

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
import { useState, useEffect } from "react"
import Link from "next/link"

// Type definitions for navigation items
interface SubMenuItem {
  title: string
  url: string
}

interface MenuItem {
  title: string
  url: string
  icon: React.ReactNode
  items?: SubMenuItem[]
}

// This is HR Platform data
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/app",
      icon: <BarChart2 className="size-4" />,
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
      url: "/app/settings",
      icon: <Settings className="size-4" />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  
  // State to track which menu items are open
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  // Set submenu open states based on current path
  useEffect(() => {
    const newOpenItems: Record<string, boolean> = {}
    
    data.navMain.forEach(item => {
      if (item.items?.some(subItem => subItem.url === pathname || pathname.startsWith(subItem.url))) {
        newOpenItems[item.title] = true
      }
    })
    
    setOpenItems(prev => ({...prev, ...newOpenItems}))
  }, [pathname])

  // Toggle function for collapsible items
  const toggleItem = (title: string) => {
    setOpenItems(prev => ({
      ...prev,
      [title]: !prev[title]
    }))
  }

  // Check if route is active (exact match or child route)
  const isRouteActive = (url: string) => {
    if (url === "#") return false
    if (url === "/app" && pathname === "/app") return true
    if (url !== "/app" && pathname.startsWith(url)) return true
    return false
  }

  // Check if a parent menu should be highlighted (when any child is active)
  const isParentActive = (item: MenuItem) => {
    if (!item.items) return isRouteActive(item.url)
    return item.items.some((subItem) => isRouteActive(subItem.url))
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
            {data.navMain.map((item: MenuItem) => (
              <SidebarMenuItem key={item.title}>
                {item.items?.length ? (
                  <Collapsible
                    open={openItems[item.title]}
                    onOpenChange={() => toggleItem(item.title)}
                  >
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="justify-between" isActive={isParentActive(item)}>
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
                        {item.items.map((subItem: SubMenuItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild isActive={isRouteActive(subItem.url)}>
                              <Link href={subItem.url}>{subItem.title}</Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <SidebarMenuButton asChild isActive={isRouteActive(item.url)}>
                    <Link href={item.url} className="font-medium flex items-center gap-2">
                      {item.icon}
                      {item.title}
                    </Link>
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

