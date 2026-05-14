"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BookOpen, User } from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/courses", label: "Course", icon: BookOpen },
  { href: "/profile", label: "Profile", icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-32px)] max-w-[380px]">
      <div className="bg-[#100F06] rounded-full px-2 py-2 flex items-center justify-around shadow-lg">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          const Icon = item.icon
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all ${
                isActive
                  ? "bg-[#00917A] text-white"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              {isActive && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
