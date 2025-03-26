"use client"
import React from "react"
import { AppSidebar } from "../../components/app-sidebar"
import { UserButton } from "../../components/user-button"
import { BellIcon, SearchIcon } from "lucide-react"
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
      <SidebarInset className="max-w-full overflow-x-hidden">
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 sm:gap-4 border-b px-2 sm:px-6 bg-background overflow-hidden">
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
            <Button variant="outline" size="icon" className="rounded-full shrink-0">
              <BellIcon className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </Button>
            <UserButton />
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

