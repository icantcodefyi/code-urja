"use client"
import React from "react"
import { AppSidebar } from "../../components/app-sidebar"
import { UserButton } from "../../components/user-button"
import { BellIcon, SearchIcon, VideoIcon, MicIcon, FileTextIcon } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { usePathname } from "next/navigation"
import { useMemo } from "react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Badge } from "~/components/ui/badgee"

function DynamicBreadcrumbs() {
  const pathname = usePathname()
  
  const breadcrumbs = useMemo(() => {
    // Remove /app prefix and split by /
    const paths = pathname.replace(/^\/app\/?/, '').split('/')
      .filter(segment => segment !== '')
    
    // Start with Dashboard
    const items = [
      { 
        label: 'Dashboard', 
        href: '/app', 
        current: paths.length === 0 
      }
    ]
    
    // Add all path segments
    let currentPath = '/app'
    paths.forEach((path, index) => {
      currentPath += `/${path}`
      items.push({
        label: path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' '),
        href: index === paths.length - 1 ? '' : currentPath,
        current: index === paths.length - 1
      })
    })
    
    return items
  }, [pathname])

  return (
    <Breadcrumb className="overflow-hidden">
      <BreadcrumbList className="flex-nowrap overflow-hidden">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem className="whitespace-nowrap overflow-hidden text-ellipsis min-w-0">
              {crumb.current ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={crumb.href} className="text-primary font-medium">
                  {crumb.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "19rem",
        } as React.CSSProperties
      }
    >
      <SidebarInset className="max-w-full overflow-x-hidden flex flex-col h-screen">
        <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 sm:gap-4 border-b px-2 sm:px-6 bg-background">
          <div className="overflow-hidden min-w-0 flex-shrink">
            <DynamicBreadcrumbs />
          </div>
          
          <div className="ml-auto flex items-center gap-2 sm:gap-4 flex-nowrap">
            <div className="relative hidden sm:block sm:w-64">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search candidates..."
                className="w-full pl-8 bg-background"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full shrink-0 relative">
                  <BellIcon className="h-4 w-4" />
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center">
                   <span className="text-[10px]">3</span>
                  </Badge>
                  <span className="sr-only">Notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[350px]">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="py-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <VideoIcon className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">New Video Cover Letter</span>
                        <Badge variant="secondary" className="ml-auto px-2 py-1" size={"sm"} >New</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        John Smith submitted a video cover letter for Software Engineer position
                      </p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="py-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <MicIcon className="h-4 w-4 text-green-500" />
                        <span className="font-medium">New Audio Assessment</span>
                        <Badge variant="secondary" className="ml-auto px-2 py-1" size={"sm"} >New</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Sarah Lee completed audio assessment for Product Manager role
                      </p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="py-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <FileTextIcon className="h-4 w-4 text-purple-500" />
                        <span className="font-medium">Candidate Analysis Ready</span>
                        <Badge variant="secondary" className="ml-auto px-2 py-1" size={"sm"} >New</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        AI analysis completed for Michael Johnson&apos;s application with 85% match score
                      </p>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center font-medium">
                  View all notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* <UserButton /> */}
            <SidebarTrigger className="rotate-180 shrink-0" />
          </div>
        </header>
        <main className="flex-1 overflow-auto px-2 sm:px-0 mx-auto max-w-4xl w-full">
          {children}
        </main>
      </SidebarInset>
      <AppSidebar />
    </SidebarProvider>
  )
}

