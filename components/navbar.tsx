"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar, List, Settings, Printer, Home, UserX, Users, LayoutGrid } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Gestion des Espaces
        </Link>

        <nav className="flex items-center space-x-2">
          <Link href="/" passHref>
            <Button variant={pathname === "/" ? "default" : "ghost"} className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Calendrier</span>
            </Button>
          </Link>

          <Link href="/global" passHref>
            <Button variant={pathname === "/global" ? "default" : "ghost"} className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">Global</span>
            </Button>
          </Link>

          <Link href="/planning" passHref>
            <Button variant={pathname === "/planning" ? "default" : "ghost"} className="flex items-center gap-2">
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">Planning</span>
            </Button>
          </Link>

          <Link href="/actions" passHref>
            <Button variant={pathname === "/actions" ? "default" : "ghost"} className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Actions</span>
            </Button>
          </Link>

          <Link href="/rooms" passHref>
            <Button variant={pathname === "/rooms" ? "default" : "ghost"} className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Espaces</span>
            </Button>
          </Link>

          <Link href="/collaborators" passHref>
            <Button variant={pathname === "/collaborators" ? "default" : "ghost"} className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Collaborateurs</span>
            </Button>
          </Link>

          <Link href="/leaves" passHref>
            <Button variant={pathname === "/leaves" ? "default" : "ghost"} className="flex items-center gap-2">
              <UserX className="h-4 w-4" />
              <span className="hidden sm:inline">Congés</span>
            </Button>
          </Link>

          <Link href="/print" passHref>
            <Button variant={pathname === "/print" ? "default" : "ghost"} className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              <span className="hidden sm:inline">Imprimer</span>
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}

