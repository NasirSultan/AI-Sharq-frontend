'use client'

import { usePathname } from "next/navigation"
import Navbar from "./Navbar"

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()?.toLowerCase()
  const hideNavbar = pathname === "/" || pathname.startsWith("/authentication/")

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  )
}
