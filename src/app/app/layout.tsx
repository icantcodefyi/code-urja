import type React from "react"
import { AppSidebar } from "../../components/app-sidebar"
import { UserButton } from "../../components/user-button"
import { BellIcon, SearchIcon } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar"

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
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b px-6 bg-background">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/app" className="text-primary font-medium">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Assessment Generator</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="ml-auto flex items-center gap-4">
            <div className="relative w-64">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search candidates..."
                className="w-full pl-8 bg-background"
              />
            </div>
            <Button variant="outline" size="icon" className="rounded-full">
              <BellIcon className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </Button>
            <UserButton />
            <SidebarTrigger className="rotate-180" />
          </div>
        </header>
        <main className="flex-1 overflow-auto mx-auto max-w-4xl min-w-4xl">
          {children}
        </main>
      </SidebarInset>
      <AppSidebar />
    </SidebarProvider>
  )
}

