'use client'

import React, { useEffect, ReactNode, useState, useMemo } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useAdminKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useUnreadCount } from '@/hooks/useUnreadCount'
import Modal from '@/components/Modal'
import KeyboardShortcuts from '@/components/admin/KeyboardShortcuts'
import ThemeToggle from '@/components/admin/ThemeToggle'
import {
  LayoutDashboard,
  Home,
  Plus,
  MessageSquare,
  Mail,
  BarChart3,
  Users,
  FileText,
  FileCode,
  Database,
  Settings,
  Globe,
  LogOut,
  Building2,
  BookOpen,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface AdminLayoutProps {
  children: ReactNode
}

const menuItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { path: '/admin/propiedades', icon: Home, label: 'Propiedades', exact: true },
  { path: '/admin/propiedades/nueva?clear=true', icon: Plus, label: 'Nueva Propiedad', exact: true },
  { path: '/admin/blog', icon: BookOpen, label: 'Blog', exact: false },
  { path: '/admin/consultas', icon: MessageSquare, label: 'Consultas', exact: false },
  { path: '/admin/contactos', icon: Mail, label: 'Contactos', exact: false },
  { path: '/admin/analytics', icon: BarChart3, label: 'Analytics', exact: false },
  { path: '/admin/usuarios', icon: Users, label: 'Usuarios', exact: false },
  { path: '/admin/logs', icon: FileText, label: 'Logs', exact: false },
  { path: '/admin/plantillas', icon: FileCode, label: 'Plantillas', exact: false },
  { path: '/admin/backup', icon: Database, label: 'Backup', exact: false },
  { path: '/admin/configuracion', icon: Settings, label: 'Configuración', exact: false },
]

const pathLabels: Record<string, string> = {
  admin: 'Admin',
  propiedades: 'Propiedades',
  nueva: 'Nueva',
  blog: 'Blog',
  nuevo: 'Nuevo',
  consultas: 'Consultas',
  contactos: 'Contactos',
  analytics: 'Analytics',
  usuarios: 'Usuarios',
  logs: 'Logs',
  plantillas: 'Plantillas',
  backup: 'Backup',
  configuracion: 'Configuración',
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, isLoading, user, logout } = useAuth()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const unreadCount = useUnreadCount()

  useAdminKeyboardShortcuts()

  // All hooks must be called before any conditional returns
  const breadcrumbs = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean)
    const items: { label: string; href: string; isLast: boolean }[] = []

    let currentPath = ''
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === segments.length - 1

      // Check if it's a dynamic segment (like an ID)
      const isDynamicSegment = /^[a-f0-9-]{36}$|^\d+$/.test(segment)

      items.push({
        label: isDynamicSegment ? 'Detalle' : (pathLabels[segment] || segment),
        href: currentPath,
        isLast,
      })
    })

    return items
  }, [pathname])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
    }
  }, [isAuthenticated, isLoading, router, pathname])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const handleLogoutClick = () => {
    setShowLogoutModal(true)
  }

  const handleLogoutConfirm = async () => {
    await logout()
    router.push('/login')
  }

  const isActive = (path: string, exact: boolean) => {
    // Remover query params para comparar
    const pathWithoutQuery = path.split('?')[0]
    if (exact) {
      return pathname === pathWithoutQuery
    }
    return pathname.startsWith(pathWithoutQuery)
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r border-slate-100">
        {/* Header - debe coincidir con la altura del header principal (h-14) */}
        <SidebarHeader className="h-12 border-b border-slate-100 px-3 flex items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-slate-800 to-slate-700 text-white shadow-sm">
              <Building2 className="h-4 w-4" />
            </div>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="font-semibold text-sm text-slate-800">Julieta Arena</span>
              <span className="text-xs text-slate-500">Admin Panel</span>
            </div>
          </div>
        </SidebarHeader>

        {/* Content */}
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menú Principal</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => {
                  const showBadge = item.path === '/admin/consultas' && unreadCount > 0
                  return (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(item.path, item.exact)}
                        tooltip={item.label}
                      >
                        <Link href={item.path}>
                          <item.icon className="h-4 w-4" />
                          <span className="flex-1">{item.label}</span>
                          {showBadge && (
                            <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1.5 text-[10px] font-bold text-white">
                              {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

        </SidebarContent>

        {/* Footer - Usuario */}
        <SidebarFooter className="border-t border-slate-100 p-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200">
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-slate-700 to-slate-600 text-white text-sm font-medium">
                    {(user?.name || user?.email || 'A').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                  <p className="text-sm font-medium text-slate-800 truncate">
                    {user?.name || 'Administrador'}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {user?.email}
                  </p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 rounded-lg shadow-lg"
              side="top"
              align="start"
              sideOffset={8}
            >
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-sm font-medium text-slate-800">{user?.name || 'Administrador'}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
              <div className="p-1">
                <DropdownMenuItem asChild className="cursor-pointer rounded-md">
                  <Link href="/admin/configuracion" className="flex items-center gap-2 px-2 py-1.5">
                    <Settings className="h-4 w-4 text-slate-500" />
                    <span>Configuración</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer rounded-md">
                  <Link href="/" target="_blank" className="flex items-center gap-2 px-2 py-1.5">
                    <Globe className="h-4 w-4 text-slate-500" />
                    <span>Ver Sitio Web</span>
                  </Link>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator className="my-1" />
              <div className="p-1">
                <DropdownMenuItem
                  onClick={handleLogoutClick}
                  className="cursor-pointer rounded-md text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>

      {/* Main Content */}
      <SidebarInset className="bg-slate-50/50">
        <header className="sticky top-0 z-10 flex h-12 items-center gap-3 border-b border-slate-100 bg-white/80 backdrop-blur-sm px-4">
          <SidebarTrigger className="h-8 w-8 hover:bg-slate-100 rounded-md transition-colors" />
          <Separator orientation="vertical" className="h-5 bg-slate-200" />
          <Breadcrumb>
            <BreadcrumbList className="text-sm">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.href}>
                  {index > 0 && <BreadcrumbSeparator className="hidden md:block text-slate-400" />}
                  <BreadcrumbItem>
                    {crumb.isLast ? (
                      <BreadcrumbPage className="font-medium text-slate-900">{crumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild className="text-slate-500 hover:text-slate-700">
                        <Link href={crumb.href}>{crumb.label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6 md:p-8 animate-fade-in">
          {children}
        </main>
      </SidebarInset>

      {/* Global Components */}
      <KeyboardShortcuts />

      {/* Logout Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
        title="Cerrar Sesión"
        message="¿Estás seguro de que deseas cerrar sesión?"
        type="confirm"
      />
    </SidebarProvider>
  )
}
