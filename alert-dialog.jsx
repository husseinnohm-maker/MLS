const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { ClipboardEdit, LayoutDashboard, LogOut, Warehouse } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Layout() {
  const { user } = useAuth();
  const location = useLocation();
  const isAdmin = user?.role === "admin";

  const navItems = [
    { to: "/", label: "Data Entry", icon: ClipboardEdit },
    ...(isAdmin ? [{ to: "/dashboard", label: "Dashboard", icon: LayoutDashboard }] : []),
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Warehouse className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-sm sm:text-base hidden sm:block">
              Mosanada PCR Tracker
            </span>
          </div>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to}>
                <Button
                  variant={location.pathname === item.to ? "secondary" : "ghost"}
                  size="sm"
                  className="gap-2 text-xs sm:text-sm"
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              </Link>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => db.auth.logout()}
              className="ml-2 text-muted-foreground"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}